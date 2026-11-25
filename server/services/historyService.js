const CodingAttempt = require('../models/CodingAttempt');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const SubjectAttempt = require('../models/SubjectAttempt');
const UpscAttempt = require('../models/UpscAttempt');
const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');
const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const PlacementDrive = require('../models/PlacementDrive');

const getUnifiedHistory = async (userId) => {
  const [codingAttempts, aptitudeAttempts, subjectAttempts, upscAttempts, answerWritingAttempts, interviewSessions, resume, placementDrives] =
    await Promise.all([
      CodingAttempt.find({ userId, mode: 'submit' }).populate('questionId', 'title difficulty').sort({ createdAt: -1 }).limit(30),
      AptitudeAttempt.find({ userId }).sort({ createdAt: -1 }).limit(30),
      SubjectAttempt.find({ userId }).sort({ createdAt: -1 }).limit(30),
      UpscAttempt.find({ userId }).sort({ createdAt: -1 }).limit(30),
      AnswerWritingAttempt.find({ userId }).sort({ createdAt: -1 }).limit(30),
      InterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(30),
      Resume.findOne({ userId }),
      PlacementDrive.find({ userId, status: 'completed' }).sort({ createdAt: -1 }).limit(20),
    ]);

  const entries = [
    ...codingAttempts.map((a) => ({
      type: 'Coding',
      label: a.questionId?.title || 'Coding problem',
      status: a.status,
      date: a.createdAt,
      detail: `${a.language} · ${a.passedTestCases}/${a.totalTestCases} test cases`,
    })),
    ...aptitudeAttempts.map((a) => ({
      type: 'Aptitude',
      label: `${a.category} practice`,
      status: `${a.score}/${a.totalQuestions}`,
      date: a.createdAt,
      detail: `${a.timeTakenSeconds}s`,
    })),
    ...subjectAttempts.map((a) => ({
      type: 'Subject Prep',
      label: `${a.subject} quiz`,
      status: `${a.score}/${a.totalQuestions}`,
      date: a.createdAt,
      detail: `${a.timeTakenSeconds}s`,
    })),
    ...upscAttempts.map((a) => ({
      type: 'UPSC Mock Test',
      label: 'GS mock test',
      status: `${a.score}/${a.totalQuestions}`,
      date: a.createdAt,
      detail: `${a.timeTakenSeconds}s`,
    })),
    ...answerWritingAttempts.map((a) => ({
      type: 'Answer Writing',
      label: a.prompt.slice(0, 60) + (a.prompt.length > 60 ? '...' : ''),
      status: `${a.score}/100`,
      date: a.createdAt,
      detail: '',
    })),
    ...interviewSessions.map((s) => ({
      type: 'Mock Interview',
      label: `${s.interviewType} · ${s.jobRole}`,
      status: s.status,
      date: s.createdAt,
      detail: `${s.difficulty} · ${s.durationMinutes} min`,
      sessionId: s.status === 'completed' ? s._id : undefined,
    })),
    ...placementDrives.map((d) => ({
      type: 'Placement Drive',
      label: `${d.jobRole} · ${d.course}`,
      status: d.finalEvaluation?.verdict || 'Completed',
      date: d.updatedAt,
      detail: `Overall score: ${d.finalEvaluation?.overallScore ?? 0}%`,
      driveId: d._id,
    })),
  ];

  if (resume) {
    entries.push({
      type: 'Resume',
      label: 'Resume updated',
      status: 'Saved',
      date: resume.updatedAt,
      detail: '',
    });
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return entries.slice(0, 50);
};

module.exports = { getUnifiedHistory };
