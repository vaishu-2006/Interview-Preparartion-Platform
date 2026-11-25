const InterviewConfiguration = require('../models/InterviewConfiguration');
const InterviewSession = require('../models/InterviewSession');
const InterviewTurn = require('../models/InterviewTurn');
const InterviewMetrics = require('../models/InterviewMetrics');
const InterviewReport = require('../models/InterviewReport');
const Resume = require('../models/Resume');
const ApiError = require('../utils/ApiError');
const aiService = require('./aiService');
const awardPoints = require('../utils/awardPoints');

const QUESTIONS_PER_SESSION = 5;
const MAX_VIOLATIONS = 3;
const VIOLATION_TYPES = ['tab_switch', 'copy', 'paste', 'right_click', 'devtools_shortcut', 'phone_detected'];
const POINTS_PER_COMPLETED_INTERVIEW = 15;

const createConfig = async (userId, { jobRole, interviewType, difficulty, durationMinutes, resumeSource, uploadedResumePath }) => {
  const config = await InterviewConfiguration.create({
    userId,
    jobRole,
    interviewType,
    difficulty,
    durationMinutes: durationMinutes || 20,
    resumeSource: resumeSource || 'none',
    uploadedResumePath: uploadedResumePath || '',
  });
  return config;
};

const buildResumeSnapshot = async (userId, resumeSource) => {
  if (resumeSource !== 'platform') return null;
  const resume = await Resume.findOne({ userId });
  if (!resume) return null;
  return {
    skills: resume.skills,
    projects: resume.projects.map((p) => ({ title: p.title, techStack: p.techStack })),
    experience: resume.experience.map((e) => ({ role: e.role, company: e.company })),
  };
};

const startSession = async (userId, configId) => {
  const config = await InterviewConfiguration.findOne({ _id: configId, userId });
  if (!config) {
    throw new ApiError(404, 'Interview configuration not found');
  }

  const resumeSnapshot = await buildResumeSnapshot(userId, config.resumeSource);

  const previousTurns = await InterviewTurn.find({ userId }).select('questionText').limit(50);

  const session = await InterviewSession.create({
    userId,
    configId: config._id,
    jobRole: config.jobRole,
    interviewType: config.interviewType,
    difficulty: config.difficulty,
    durationMinutes: config.durationMinutes,
    resumeSnapshot,
    totalQuestions: QUESTIONS_PER_SESSION,
    status: 'in_progress',
    startedAt: new Date(),
  });

  const questions = await aiService.generateQuestions({
    jobRole: config.jobRole,
    interviewType: config.interviewType,
    difficulty: config.difficulty,
    resumeSnapshot,
    count: QUESTIONS_PER_SESSION,
    previousQuestions: previousTurns.map((t) => t.questionText),
  });

  const turns = await InterviewTurn.insertMany(
    questions.map((questionText, index) => ({
      sessionId: session._id,
      userId,
      index,
      questionText,
      questionCategory: config.interviewType,
    }))
  );

  await InterviewMetrics.create({ sessionId: session._id, userId, samples: [] });

  return { session, turns };
};

const getSession = async (userId, sessionId) => {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new ApiError(404, 'Interview session not found');
  }
  const turns = await InterviewTurn.find({ sessionId }).sort({ index: 1 });
  return { session, turns };
};

const answerTurn = async (userId, sessionId, index, { answerText, answerMode }) => {
  const turn = await InterviewTurn.findOneAndUpdate(
    { sessionId, userId, index: Number(index) },
    { answerText: answerText || '', answerMode: answerMode || 'text', skipped: false, answeredAt: new Date() },
    { new: true }
  );
  if (!turn) {
    throw new ApiError(404, 'Interview question not found');
  }
  return turn;
};

const skipTurn = async (userId, sessionId, index) => {
  const turn = await InterviewTurn.findOneAndUpdate(
    { sessionId, userId, index: Number(index) },
    { skipped: true, answerMode: 'skipped', answeredAt: new Date() },
    { new: true }
  );
  if (!turn) {
    throw new ApiError(404, 'Interview question not found');
  }
  return turn;
};

const recordMetricSample = async (userId, sessionId, sample) => {
  const metrics = await InterviewMetrics.findOneAndUpdate(
    { sessionId, userId },
    { $push: { samples: { ...sample, timestamp: new Date() } } },
    { new: true, upsert: true }
  );
  return metrics;
};

const recordViolation = async (userId, sessionId, { type, questionIndex, screenshot }) => {
  if (!VIOLATION_TYPES.includes(type)) {
    throw new ApiError(422, 'Invalid violation type');
  }
  const session = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId, status: 'in_progress' },
    {
      $push: { violations: { type, questionIndex, screenshot: screenshot || '', timestamp: new Date() } },
      $inc: { violationCount: 1 },
    },
    { new: true }
  );
  if (!session) {
    throw new ApiError(404, 'Interview session not found or not in progress');
  }
  return {
    violationCount: session.violationCount,
    maxViolations: MAX_VIOLATIONS,
    shouldAutoSubmit: session.violationCount >= MAX_VIOLATIONS,
  };
};

const completeSession = async (userId, sessionId, { autoSubmitted } = {}) => {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new ApiError(404, 'Interview session not found');
  }
  if (autoSubmitted) session.autoSubmitted = true;

  const [turns, metrics] = await Promise.all([
    InterviewTurn.find({ sessionId }).sort({ index: 1 }),
    InterviewMetrics.findOne({ sessionId, userId }),
  ]);

  const feedback = await aiService.generateFeedback({
    turns,
    metrics,
    jobRole: session.jobRole,
    interviewType: session.interviewType,
    difficulty: session.difficulty,
    autoSubmitted: Boolean(session.autoSubmitted),
  });

  const report = await InterviewReport.findOneAndUpdate(
    { sessionId },
    {
      sessionId,
      userId,
      jobRole: session.jobRole,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      durationMinutes: session.durationMinutes,
      ...feedback,
    },
    { new: true, upsert: true }
  );

  session.status = 'completed';
  session.completedAt = new Date();
  await session.save();
  await awardPoints(userId, POINTS_PER_COMPLETED_INTERVIEW);

  return { session, report };
};

const getReport = async (userId, sessionId) => {
  const report = await InterviewReport.findOne({ sessionId, userId });
  if (!report) {
    throw new ApiError(404, 'Report not found. Complete the interview first.');
  }
  const [turns, session] = await Promise.all([
    InterviewTurn.find({ sessionId }).sort({ index: 1 }),
    InterviewSession.findOne({ _id: sessionId, userId }).select('violations violationCount autoSubmitted'),
  ]);
  return {
    report,
    turns,
    proctoring: {
      violations: session?.violations || [],
      violationCount: session?.violationCount || 0,
      autoSubmitted: session?.autoSubmitted || false,
    },
  };
};

const getSessions = async (userId) => {
  return InterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

const getReports = async (userId) => {
  return InterviewReport.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

module.exports = {
  createConfig,
  startSession,
  getSession,
  answerTurn,
  skipTurn,
  recordMetricSample,
  recordViolation,
  completeSession,
  getReport,
  getSessions,
  getReports,
};
