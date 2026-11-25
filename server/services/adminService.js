const User = require('../models/User');
const Profile = require('../models/Profile');
const Dashboard = require('../models/Dashboard');
const CodingQuestion = require('../models/CodingQuestion');
const CodingAttempt = require('../models/CodingAttempt');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const SubjectAttempt = require('../models/SubjectAttempt');
const UpscAttempt = require('../models/UpscAttempt');
const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');
const InterviewSession = require('../models/InterviewSession');
const PlacementDrive = require('../models/PlacementDrive');
const ProblemAssignment = require('../models/ProblemAssignment');
const PlatformEvent = require('../models/PlatformEvent');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');
const notificationService = require('./notificationService');

// ---- Platform-wide stats (admin only) — real counts, no estimates ----
const getPlatformStats = async () => {
  const [totalUsers, byCourse, codingAttempts, aptitudeAttempts, subjectAttempts, upscAttempts, interviewsCompleted] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Profile.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]),
    CodingAttempt.countDocuments(),
    AptitudeAttempt.countDocuments(),
    SubjectAttempt.countDocuments(),
    UpscAttempt.countDocuments(),
    InterviewSession.countDocuments({ status: 'completed' }),
  ]);
  const courseBreakdown = byCourse.reduce((acc, row) => {
    acc[row._id || 'unselected'] = row.count;
    return acc;
  }, {});
  return {
    totalUsers,
    courseBreakdown,
    totalAttempts: codingAttempts + aptitudeAttempts + subjectAttempts + upscAttempts,
    codingAttempts,
    aptitudeAttempts,
    subjectAttempts,
    upscAttempts,
    interviewsCompleted,
  };
};

// ---- Student roster (faculty + admin) — real Profile/Dashboard data, optionally scoped ----
const listStudents = async ({ course, college } = {}) => {
  const profileFilter = {};
  if (course) profileFilter.course = course;
  if (college) profileFilter.college = college;

  const profiles = await Profile.find(profileFilter).select('userId course branch college points');
  const userIds = profiles.map((p) => p.userId);

  const [users, dashboards] = await Promise.all([
    User.find({ _id: { $in: userIds }, role: 'student' }).select('name email'),
    Dashboard.find({ userId: { $in: userIds } }).select('userId lastLogin'),
  ]);
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const lastLoginMap = new Map(dashboards.map((d) => [String(d.userId), d.lastLogin]));

  return profiles
    .filter((p) => userMap.has(String(p.userId)))
    .map((p) => ({
      userId: p.userId,
      name: userMap.get(String(p.userId)).name,
      email: userMap.get(String(p.userId)).email,
      course: p.course,
      branch: p.branch,
      college: p.college,
      points: p.points,
      lastLogin: lastLoginMap.get(String(p.userId)) || null,
    }))
    .sort((a, b) => b.points - a.points);
};

// ---- Assign a coding problem to a student, or every student in a course ----
const assignProblem = async (assignedBy, { studentId, course, problemId, dueDate }) => {
  const problem = await CodingQuestion.findById(problemId).select('title slug');
  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  const assignedToAll = !studentId;
  if (assignedToAll && !course) {
    throw new ApiError(422, 'Assigning to everyone requires a course');
  }

  const assignment = await ProblemAssignment.create({
    assignedBy,
    assignedTo: assignedToAll ? null : studentId,
    assignedToAll,
    course: assignedToAll ? course : undefined,
    problemId,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });

  const message = `New problem assigned: "${problem.title}"${dueDate ? ` — due ${new Date(dueDate).toLocaleDateString()}` : ''}.`;
  const link = `/coding/${problem.slug}`;
  if (assignedToAll) {
    const students = await listStudents({ course });
    await notificationService.notifyMany(students.map((s) => s.userId), { type: 'assignment', message, link });
  } else {
    await notificationService.notify(studentId, { type: 'assignment', message, link });
  }

  return assignment;
};

const listMyAssignments = async (userId, course) => {
  const assignments = await ProblemAssignment.find({
    $or: [{ assignedTo: userId }, { assignedToAll: true, course }],
  })
    .populate('problemId', 'title slug difficulty')
    .sort({ createdAt: -1 });
  return assignments.filter((a) => a.problemId);
};

// ---- Platform Events ----
const createEvent = async (createdBy, { title, description, bonusPoints, course, startsAt, endsAt }) => {
  if (!title?.trim() || !startsAt || !endsAt) {
    throw new ApiError(422, 'title, startsAt and endsAt are required');
  }
  const event = await PlatformEvent.create({
    title: title.trim(),
    description: description || '',
    bonusPoints: bonusPoints || 0,
    course: course || null,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
    createdBy,
  });

  const students = await listStudents(course ? { course } : {});
  await notificationService.notifyMany(students.map((s) => s.userId), {
    type: 'event',
    message: `New event: "${event.title}"${bonusPoints ? ` — up to ${bonusPoints} bonus points` : ''}.`,
    link: '/dashboard',
  });

  return event;
};

const listEvents = () => PlatformEvent.find().sort({ startsAt: -1 });

const listActiveEvents = (course) => {
  const now = new Date();
  return PlatformEvent.find({
    startsAt: { $lte: now },
    endsAt: { $gte: now },
    $or: [{ course: null }, { course }],
  }).sort({ endsAt: 1 });
};

// ---- Manual, human-verified point award (e.g. for completing an event) ----
const awardPointsToStudent = async (userId, amount, reason) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(422, 'amount must be a positive number');
  }
  await awardPoints(userId, amount);
  await notificationService.notify(userId, {
    type: 'event',
    message: `You were awarded ${amount} bonus points${reason ? ` — ${reason}` : ''}.`,
  });
};

// ---- Cohort analytics (faculty + admin) — aggregate trends across a whole course's students,
// vs. the per-student-only view everything else on this platform gives. Course-aware: BE/BCA
// get coding + aptitude + placement-drive-funnel data; UPSC has none of those, so it gets GS
// category weakness + stage scores + answer-writing instead. Real aggregation only, no estimates.
const getCohortAnalyticsForTechCourse = async (course) => {
  const profiles = await Profile.find({ course }).select('userId');
  const userIds = profiles.map((p) => p.userId);
  const studentCount = userIds.length;
  if (!studentCount) return { studentCount: 0 };

  const [aptitudeAgg, topicSolverAgg, allTopicsAgg, solvedCountAgg, funnelAgg] = await Promise.all([
    AptitudeAttempt.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $unwind: '$answers' },
      { $group: { _id: '$category', total: { $sum: 1 }, correct: { $sum: { $cond: ['$answers.isCorrect', 1, 0] } } } },
    ]),
    CodingAttempt.aggregate([
      { $match: { userId: { $in: userIds }, status: 'Accepted' } },
      { $group: { _id: { userId: '$userId', questionId: '$questionId' } } },
      { $lookup: { from: 'codingquestions', localField: '_id.questionId', foreignField: '_id', as: 'q' } },
      { $unwind: '$q' },
      { $unwind: '$q.topics' },
      { $group: { _id: '$q.topics', solvers: { $addToSet: '$_id.userId' } } },
      { $project: { _id: 0, topic: '$_id', solverCount: { $size: '$solvers' } } },
    ]),
    CodingQuestion.aggregate([{ $unwind: '$topics' }, { $group: { _id: '$topics' } }]),
    CodingAttempt.aggregate([
      { $match: { userId: { $in: userIds }, status: 'Accepted' } },
      { $group: { _id: { userId: '$userId', questionId: '$questionId' } } },
      { $group: { _id: '$_id.userId', solvedCount: { $sum: 1 } } },
    ]),
    PlacementDrive.aggregate([{ $match: { userId: { $in: userIds } } }, { $group: { _id: '$currentStage', count: { $sum: 1 } } }]),
  ]);

  const aptitudeByCategory = aptitudeAgg
    .map((r) => ({ category: r._id, accuracy: Math.round((r.correct / r.total) * 100), attempts: r.total }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const topicSolverMap = new Map(topicSolverAgg.map((r) => [r.topic, r.solverCount]));
  const topicCoverage = allTopicsAgg
    .map((t) => ({ topic: t._id, coveragePercent: Math.round(((topicSolverMap.get(t._id) || 0) / studentCount) * 100) }))
    .sort((a, b) => a.coveragePercent - b.coveragePercent);

  const avgProblemsSolved = solvedCountAgg.length
    ? Math.round((solvedCountAgg.reduce((sum, r) => sum + r.solvedCount, 0) / studentCount) * 10) / 10
    : 0;

  return {
    studentCount,
    weakestAptitudeCategory: aptitudeByCategory[0] || null,
    aptitudeByCategory,
    weakestCodingTopic: topicCoverage[0] || null,
    topicCoverage: topicCoverage.slice(0, 8),
    avgProblemsSolved,
    driveFunnel: funnelAgg.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
  };
};

const getCohortAnalyticsForUpsc = async () => {
  const profiles = await Profile.find({ course: 'UPSC' }).select('userId');
  const userIds = profiles.map((p) => p.userId);
  const studentCount = userIds.length;
  if (!studentCount) return { studentCount: 0 };

  const [categoryAgg, stageAgg, answerWritingAgg] = await Promise.all([
    UpscAttempt.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $unwind: '$answers' },
      { $lookup: { from: 'upscquestions', localField: 'answers.questionId', foreignField: '_id', as: 'q' } },
      { $unwind: '$q' },
      { $group: { _id: '$q.category', total: { $sum: 1 }, correct: { $sum: { $cond: ['$answers.isCorrect', 1, 0] } } } },
    ]),
    UpscAttempt.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: '$stage',
          avgScorePercent: { $avg: { $multiply: [{ $divide: ['$score', { $max: ['$totalQuestions', 1] }] }, 100] } },
          count: { $sum: 1 },
        },
      },
    ]),
    AnswerWritingAttempt.aggregate([{ $match: { userId: { $in: userIds } } }, { $group: { _id: null, avgScore: { $avg: '$score' }, count: { $sum: 1 } } }]),
  ]);

  const gsCategoryBreakdown = categoryAgg
    .map((r) => ({ category: r._id, accuracy: Math.round((r.correct / r.total) * 100), attempts: r.total }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return {
    studentCount,
    weakestGsCategory: gsCategoryBreakdown[0] || null,
    gsCategoryBreakdown,
    stageBreakdown: stageAgg.reduce((acc, r) => ({ ...acc, [r._id]: { avgScorePercent: Math.round(r.avgScorePercent), attempts: r.count } }), {}),
    answerWriting: answerWritingAgg[0] ? { avgScore: Math.round(answerWritingAgg[0].avgScore), count: answerWritingAgg[0].count } : { avgScore: null, count: 0 },
  };
};

const getCohortAnalytics = async (course) => {
  if (course === 'UPSC') return { course, ...(await getCohortAnalyticsForUpsc()) };
  if (course === 'BE' || course === 'BCA') return { course, ...(await getCohortAnalyticsForTechCourse(course)) };
  throw new ApiError(422, 'course must be BE, BCA, or UPSC');
};

module.exports = {
  getPlatformStats,
  listStudents,
  assignProblem,
  listMyAssignments,
  createEvent,
  listEvents,
  listActiveEvents,
  awardPointsToStudent,
  getCohortAnalytics,
};
