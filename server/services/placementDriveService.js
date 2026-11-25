const PlacementDrive = require('../models/PlacementDrive');
const Resume = require('../models/Resume');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const CodingAttempt = require('../models/CodingAttempt');
const InterviewSession = require('../models/InterviewSession');
const InterviewReport = require('../models/InterviewReport');
const ApiError = require('../utils/ApiError');
const { parseResumePdf } = require('../utils/parseResumeFile');
const aiService = require('./aiService');
const aptitudeService = require('./aptitudeService');
const codingService = require('./codingService');
const interviewService = require('./interviewService');

const RESUME_SCREENING_PASS_THRESHOLD = 40;
const ASSESSMENT_PASS_THRESHOLD = 40;
const ASSESSMENT_CATEGORIES = ['Numerical', 'Logical'];
const QUESTIONS_PER_CATEGORY = 5;
// Weights and verdict thresholds are deliberately simple, tunable placeholders — not a
// researched hiring model. Interviews are weighted heaviest since that's the strongest
// real signal; adjust here if the balance should shift.
const FINAL_WEIGHTS = { resume: 0.15, assessment: 0.2, technical: 0.35, hr: 0.3 };
const VERDICT_THRESHOLDS = { selected: 75, onHold: 50 };

const INTERVIEW_STAGE_TYPES = { technical_interview: 'Technical', hr_interview: 'HR' };
// currentStage uses snake_case ('technical_interview') but the embedded subdocument fields
// on the drive are camelCase ('technicalInterview') — this maps one to the other so callers
// never have to remember which spelling applies where.
const STAGE_FIELD = { technical_interview: 'technicalInterview', hr_interview: 'hrInterview' };
const NEXT_STAGE = {
  resume_screening: 'online_assessment',
  online_assessment: 'technical_interview',
  technical_interview: 'hr_interview',
  hr_interview: 'final_evaluation',
  final_evaluation: 'result',
};

const requireDrive = async (userId, driveId) => {
  const drive = await PlacementDrive.findOne({ _id: driveId, userId });
  if (!drive) {
    throw new ApiError(404, 'Placement drive not found');
  }
  return drive;
};

const requireStage = (drive, stage) => {
  if (drive.currentStage !== stage) {
    throw new ApiError(409, `This drive is on stage "${drive.currentStage}", not "${stage}"`);
  }
};

const startDrive = async (userId, { course, branch, jobRole, difficulty }) => {
  if (!['BE', 'BCA'].includes(course)) {
    throw new ApiError(422, 'Course must be BE or BCA');
  }
  if (!jobRole?.trim()) {
    throw new ApiError(422, 'jobRole is required');
  }

  const existing = await PlacementDrive.findOne({ userId, status: 'in_progress' });
  if (existing) {
    return existing;
  }

  return PlacementDrive.create({
    userId,
    course,
    branch: branch || '',
    jobRole: jobRole.trim(),
    difficulty: difficulty || 'Medium',
  });
};

const abandonDrive = async (userId, driveId) => {
  const drive = await requireDrive(userId, driveId);
  drive.status = 'abandoned';
  await drive.save();
  return drive;
};

const getActiveDrive = async (userId) => PlacementDrive.findOne({ userId, status: 'in_progress' });

const getDrive = async (userId, driveId) => requireDrive(userId, driveId);

const getDrives = async (userId) => PlacementDrive.find({ userId }).sort({ createdAt: -1 }).limit(20);

// `uploadedFile` (from multer, { path, originalname }) is optional — when the candidate
// doesn't attach a new resume, this falls back to whatever they already built in the Resume
// Builder, exactly as before uploads were supported.
const runResumeScreening = async (userId, driveId, uploadedFile) => {
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, 'resume_screening');

  let scored;
  let source;
  let uploadedFileName = '';
  if (uploadedFile) {
    const resumeText = await parseResumePdf(uploadedFile.path);
    scored = await aiService.scoreResume({ resumeText });
    source = 'uploaded';
    uploadedFileName = uploadedFile.originalname;
  } else {
    const resume = await Resume.findOne({ userId });
    scored = await aiService.scoreResume({ resume });
    source = 'platform';
  }
  const { score, feedback, generatedByAI, aiProvider } = scored;

  drive.resumeScreening = {
    status: score >= RESUME_SCREENING_PASS_THRESHOLD ? 'passed' : 'failed',
    score,
    feedback,
    generatedByAI,
    aiProvider,
    source,
    uploadedFileName,
    completedAt: new Date(),
  };
  if (score >= RESUME_SCREENING_PASS_THRESHOLD) {
    drive.currentStage = NEXT_STAGE.resume_screening;
  }
  await drive.save();
  return drive;
};

const startAssessment = async (userId, driveId) => {
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, 'online_assessment');

  const aptitudeSets = await Promise.all(
    ASSESSMENT_CATEGORIES.map(async (category) => ({
      category,
      questions: await aptitudeService.getQuestionsForQuiz(category, QUESTIONS_PER_CATEGORY),
    }))
  );

  const easyProblems = await codingService.listProblems({ difficulty: 'Easy' });
  if (!easyProblems.length) {
    throw new ApiError(500, 'No Easy coding problems available to assign');
  }
  const chosen = easyProblems[Math.floor(Math.random() * easyProblems.length)];
  const codingProblem = await codingService.getProblemBySlug(chosen.slug);

  drive.onlineAssessment = {
    status: 'in_progress',
    assignedCategories: ASSESSMENT_CATEGORIES,
    assignedCodingSlug: chosen.slug,
    aptitudeAttemptIds: [],
    codingAttemptId: undefined,
    aptitudeScorePercent: 0,
    codingScorePercent: 0,
    score: 0,
  };
  await drive.save();

  return { drive, aptitudeSets, codingProblem };
};

const syncAssessment = async (userId, driveId, { aptitudeAttemptIds, codingAttemptId }) => {
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, 'online_assessment');
  if (drive.onlineAssessment.status !== 'in_progress') {
    throw new ApiError(409, 'Start the assessment before syncing results');
  }
  if (!Array.isArray(aptitudeAttemptIds) || !aptitudeAttemptIds.length || !codingAttemptId) {
    throw new ApiError(422, 'aptitudeAttemptIds and codingAttemptId are required');
  }

  const aptitudeAttempts = await AptitudeAttempt.find({ _id: { $in: aptitudeAttemptIds }, userId });
  if (aptitudeAttempts.length !== aptitudeAttemptIds.length) {
    throw new ApiError(400, 'One or more aptitude attempts could not be verified');
  }
  const validCategories = new Set(drive.onlineAssessment.assignedCategories);
  if (!aptitudeAttempts.every((a) => validCategories.has(a.category))) {
    throw new ApiError(400, 'Aptitude attempts do not match this drive\'s assigned categories');
  }

  const codingAttempt = await CodingAttempt.findOne({ _id: codingAttemptId, userId }).populate('questionId', 'slug');
  if (!codingAttempt || codingAttempt.questionId?.slug !== drive.onlineAssessment.assignedCodingSlug) {
    throw new ApiError(400, 'Coding attempt does not match this drive\'s assigned problem');
  }

  const totalCorrect = aptitudeAttempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = aptitudeAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const aptitudeScorePercent = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const codingScorePercent = codingAttempt.totalTestCases
    ? Math.round((codingAttempt.passedTestCases / codingAttempt.totalTestCases) * 100)
    : 0;
  const score = Math.round(0.6 * aptitudeScorePercent + 0.4 * codingScorePercent);
  const passed = score >= ASSESSMENT_PASS_THRESHOLD;

  drive.onlineAssessment.aptitudeAttemptIds = aptitudeAttemptIds;
  drive.onlineAssessment.codingAttemptId = codingAttemptId;
  drive.onlineAssessment.aptitudeScorePercent = aptitudeScorePercent;
  drive.onlineAssessment.codingScorePercent = codingScorePercent;
  drive.onlineAssessment.score = score;
  drive.onlineAssessment.status = passed ? 'passed' : 'failed';
  drive.onlineAssessment.completedAt = new Date();
  if (passed) {
    drive.currentStage = NEXT_STAGE.online_assessment;
  }
  await drive.save();
  return drive;
};

const startInterviewStage = async (userId, driveId, stage) => {
  const interviewType = INTERVIEW_STAGE_TYPES[stage];
  if (!interviewType) {
    throw new ApiError(400, `Unknown interview stage: ${stage}`);
  }
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, stage);
  const field = STAGE_FIELD[stage];

  const existingSessionId = drive[field].sessionId;
  if (existingSessionId) {
    const existingSession = await InterviewSession.findOne({ _id: existingSessionId, userId });
    if (existingSession && existingSession.status !== 'completed') {
      return { sessionId: existingSession._id };
    }
  }

  const config = await interviewService.createConfig(userId, {
    jobRole: drive.jobRole,
    interviewType,
    difficulty: drive.difficulty,
    durationMinutes: 20,
    resumeSource: 'platform',
  });
  const { session } = await interviewService.startSession(userId, config._id);

  drive[field].configId = config._id;
  drive[field].sessionId = session._id;
  drive[field].status = 'in_progress';
  await drive.save();

  return { sessionId: session._id };
};

const syncInterviewStage = async (userId, driveId, stage) => {
  if (!INTERVIEW_STAGE_TYPES[stage]) {
    throw new ApiError(400, `Unknown interview stage: ${stage}`);
  }
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, stage);
  const field = STAGE_FIELD[stage];

  const sessionId = drive[field].sessionId;
  if (!sessionId) {
    throw new ApiError(409, 'Start this interview stage before syncing results');
  }
  const report = await InterviewReport.findOne({ sessionId, userId });
  if (!report) {
    throw new ApiError(409, 'Interview has not been completed yet');
  }

  drive[field].overallScore = report.overallScore;
  drive[field].status = 'completed';
  drive[field].completedAt = new Date();
  drive.currentStage = NEXT_STAGE[stage];
  await drive.save();
  return drive;
};

const finalize = async (userId, driveId) => {
  const drive = await requireDrive(userId, driveId);
  requireStage(drive, 'final_evaluation');

  const resumeWeighted = drive.resumeScreening.score * FINAL_WEIGHTS.resume;
  const assessmentWeighted = drive.onlineAssessment.score * FINAL_WEIGHTS.assessment;
  const technicalWeighted = drive.technicalInterview.overallScore * FINAL_WEIGHTS.technical;
  const hrWeighted = drive.hrInterview.overallScore * FINAL_WEIGHTS.hr;
  const overallScore = Math.round(resumeWeighted + assessmentWeighted + technicalWeighted + hrWeighted);

  const verdict =
    overallScore >= VERDICT_THRESHOLDS.selected ? 'Selected' : overallScore >= VERDICT_THRESHOLDS.onHold ? 'OnHold' : 'Rejected';

  drive.finalEvaluation = {
    overallScore,
    verdict,
    breakdown: {
      resumeWeighted: Math.round(resumeWeighted),
      assessmentWeighted: Math.round(assessmentWeighted),
      technicalWeighted: Math.round(technicalWeighted),
      hrWeighted: Math.round(hrWeighted),
    },
    completedAt: new Date(),
  };
  drive.currentStage = 'result';
  drive.status = 'completed';
  await drive.save();
  return drive;
};

const getDriveReportData = async (userId, driveId) => {
  const drive = await requireDrive(userId, driveId);
  const [technicalReport, hrReport] = await Promise.all([
    drive.technicalInterview?.sessionId
      ? InterviewReport.findOne({ sessionId: drive.technicalInterview.sessionId, userId })
      : null,
    drive.hrInterview?.sessionId ? InterviewReport.findOne({ sessionId: drive.hrInterview.sessionId, userId }) : null,
  ]);
  return { drive, technicalReport, hrReport };
};

module.exports = {
  startDrive,
  abandonDrive,
  getActiveDrive,
  getDrive,
  getDrives,
  runResumeScreening,
  startAssessment,
  syncAssessment,
  startInterviewStage,
  syncInterviewStage,
  getDriveReportData,
  finalize,
};
