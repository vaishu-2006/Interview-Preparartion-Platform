const Dashboard = require('../models/Dashboard');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');
const UpscAttempt = require('../models/UpscAttempt');
const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');
const ApiError = require('../utils/ApiError');
const codingService = require('./codingService');
const aptitudeService = require('./aptitudeService');
const historyService = require('./historyService');
const { resumeCompleteness } = require('../utils/resumeScoring');

const BRANCHES_BY_COURSE = {
  BE: ['Computer Science', 'AI & ML', 'AI & DS', 'ISE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'Others'],
  BCA: ['Programming', 'Computer Applications', 'IT', 'Others'],
  UPSC: [],
};

const getDashboard = async (userId) => {
  const [dashboard, profile, resume, recentEntries] = await Promise.all([
    Dashboard.findOne({ userId }),
    Profile.findOne({ userId }),
    Resume.findOne({ userId }),
    historyService.getUnifiedHistory(userId),
  ]);

  if (!dashboard) {
    throw new ApiError(404, 'Dashboard not found');
  }

  const resumePercent = resumeCompleteness(resume);
  const course = profile?.course || null;

  // UPSC has no coding/aptitude/technical-interview module — its dashboard is driven by its
  // own mock tests and answer-writing practice instead.
  let moduleProgress;
  let currentProgress;
  if (course === 'UPSC') {
    const [mockTestCount, answerWritingCount] = await Promise.all([
      UpscAttempt.countDocuments({ userId }),
      AnswerWritingAttempt.countDocuments({ userId }),
    ]);
    const mockTestsPercent = Math.min(100, mockTestCount * 10);
    const answerWritingPercent = Math.min(100, answerWritingCount * 10);
    moduleProgress = { mockTests: Math.round(mockTestsPercent), answerWriting: Math.round(answerWritingPercent) };
    currentProgress = Math.round((mockTestsPercent + answerWritingPercent) / 2);
  } else {
    const [codingProgress, aptitudeStats, completedInterviews] = await Promise.all([
      codingService.getUserProgress(userId),
      aptitudeService.getStats(userId),
      InterviewSession.countDocuments({ userId, status: 'completed' }),
    ]);
    const codingPercent = codingProgress.totalProblems ? (codingProgress.solvedCount / codingProgress.totalProblems) * 100 : 0;
    const aptitudePercent = Math.min(100, aptitudeStats.totalTests * 10);
    const interviewPercent = Math.min(100, completedInterviews * 25);
    moduleProgress = {
      coding: Math.round(codingPercent),
      aptitude: Math.round(aptitudePercent),
      resume: resumePercent,
      interview: Math.round(interviewPercent),
    };
    currentProgress = Math.round((codingPercent + aptitudePercent + resumePercent + interviewPercent) / 4);
  }

  return {
    selectedPath: dashboard.selectedPath,
    course,
    branch: profile?.branch || '',
    points: profile?.points || 0,
    lastLogin: dashboard.lastLogin,
    currentProgress,
    moduleProgress,
    recentActivities: recentEntries.slice(0, 5).map((e) => ({ label: `${e.type}: ${e.label}`, occurredAt: e.date })),
  };
};

const updateDashboard = async (userId, updates) => {
  const allowed = ['currentProgress', 'recentActivities'];
  const payload = {};
  allowed.forEach((field) => {
    if (updates[field] !== undefined) payload[field] = updates[field];
  });

  const dashboard = await Dashboard.findOneAndUpdate({ userId }, payload, { new: true });
  if (!dashboard) {
    throw new ApiError(404, 'Dashboard not found');
  }
  return dashboard;
};

const saveCourse = async (userId, course) => {
  if (!['BE', 'BCA', 'UPSC'].includes(course)) {
    throw new ApiError(422, 'Course must be one of BE, BCA, UPSC');
  }

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { course, branch: '' },
    { new: true }
  );

  const dashboardUpdate = { selectedPath: course };
  // UPSC has no branch step, so the selection flow is complete immediately.
  if (course === 'UPSC') {
    await User.findByIdAndUpdate(userId, { hasSelectedPath: true });
  }
  await Dashboard.findOneAndUpdate({ userId }, dashboardUpdate);

  return profile;
};

const saveBranch = async (userId, branch) => {
  const profile = await Profile.findOne({ userId });
  if (!profile || !profile.course) {
    throw new ApiError(400, 'Select a course before selecting a branch');
  }

  const validBranches = BRANCHES_BY_COURSE[profile.course] || [];
  if (!validBranches.includes(branch)) {
    throw new ApiError(422, `Branch must be one of: ${validBranches.join(', ')}`);
  }

  profile.branch = branch;
  await profile.save();

  await User.findByIdAndUpdate(userId, { hasSelectedPath: true });

  return profile;
};

module.exports = { getDashboard, updateDashboard, saveCourse, saveBranch, BRANCHES_BY_COURSE };
