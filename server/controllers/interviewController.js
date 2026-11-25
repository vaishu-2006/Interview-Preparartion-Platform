const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const interviewService = require('../services/interviewService');
const { buildInterviewReportHtml } = require('../services/reportPdfTemplate');
const { renderPdfFromHtml } = require('../utils/renderPdf');

const createConfig = asyncHandler(async (req, res) => {
  const { jobRole, interviewType, difficulty, durationMinutes, resumeSource } = req.body;
  if (!jobRole || !interviewType || !difficulty) {
    throw new ApiError(422, 'jobRole, interviewType and difficulty are required');
  }

  const config = await interviewService.createConfig(req.user._id, {
    jobRole,
    interviewType,
    difficulty,
    durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
    resumeSource,
    uploadedResumePath: req.file ? `/uploads/${req.file.filename}` : '',
  });

  res.status(201).json({ success: true, message: 'Interview configuration saved', config });
});

const startSession = asyncHandler(async (req, res) => {
  const { configId } = req.body;
  if (!configId) {
    throw new ApiError(422, 'configId is required');
  }
  const { session, turns } = await interviewService.startSession(req.user._id, configId);
  res.status(201).json({ success: true, message: 'Interview session started', session, turns });
});

const getSession = asyncHandler(async (req, res) => {
  const { session, turns } = await interviewService.getSession(req.user._id, req.params.sessionId);
  res.status(200).json({ success: true, session, turns });
});

const answerTurn = asyncHandler(async (req, res) => {
  const turn = await interviewService.answerTurn(req.user._id, req.params.sessionId, req.params.index, req.body);
  res.status(200).json({ success: true, turn });
});

const skipTurn = asyncHandler(async (req, res) => {
  const turn = await interviewService.skipTurn(req.user._id, req.params.sessionId, req.params.index);
  res.status(200).json({ success: true, turn });
});

const recordMetric = asyncHandler(async (req, res) => {
  await interviewService.recordMetricSample(req.user._id, req.params.sessionId, req.body);
  res.status(200).json({ success: true });
});

const recordViolation = asyncHandler(async (req, res) => {
  const { type, questionIndex, screenshot } = req.body;
  if (!type) {
    throw new ApiError(422, 'Violation type is required');
  }
  const result = await interviewService.recordViolation(req.user._id, req.params.sessionId, {
    type,
    questionIndex,
    screenshot,
  });
  res.status(200).json({ success: true, ...result });
});

const completeSession = asyncHandler(async (req, res) => {
  const { session, report } = await interviewService.completeSession(req.user._id, req.params.sessionId, {
    autoSubmitted: Boolean(req.body?.autoSubmitted),
  });
  res.status(200).json({ success: true, message: 'Interview completed', session, report });
});

const getReport = asyncHandler(async (req, res) => {
  const { report, turns, proctoring } = await interviewService.getReport(req.user._id, req.params.sessionId);
  res.status(200).json({ success: true, report, turns, proctoring });
});

const getSessions = asyncHandler(async (req, res) => {
  const sessions = await interviewService.getSessions(req.user._id);
  res.status(200).json({ success: true, sessions });
});

const getReports = asyncHandler(async (req, res) => {
  const reports = await interviewService.getReports(req.user._id);
  res.status(200).json({ success: true, reports });
});

const getReportPdf = asyncHandler(async (req, res) => {
  const { report } = await interviewService.getReport(req.user._id, req.params.sessionId);
  const html = buildInterviewReportHtml(report);
  const pdfBuffer = await renderPdfFromHtml(html);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="interview-report.pdf"',
  });
  res.send(pdfBuffer);
});

module.exports = {
  createConfig,
  startSession,
  getSession,
  answerTurn,
  skipTurn,
  recordMetric,
  recordViolation,
  completeSession,
  getReport,
  getSessions,
  getReports,
  getReportPdf,
};
