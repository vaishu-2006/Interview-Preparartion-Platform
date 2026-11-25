const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const placementDriveService = require('../services/placementDriveService');
const { buildDriveReportHtml } = require('../services/reportPdfTemplate');
const { renderPdfFromHtml } = require('../utils/renderPdf');

const startDrive = asyncHandler(async (req, res) => {
  const { course, branch, jobRole, difficulty } = req.body;
  const drive = await placementDriveService.startDrive(req.user._id, { course, branch, jobRole, difficulty });
  res.status(201).json({ success: true, drive });
});

const getActiveDrive = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.getActiveDrive(req.user._id);
  res.status(200).json({ success: true, drive });
});

const getDrives = asyncHandler(async (req, res) => {
  const drives = await placementDriveService.getDrives(req.user._id);
  res.status(200).json({ success: true, drives });
});

const getDrive = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.getDrive(req.user._id, req.params.driveId);
  res.status(200).json({ success: true, drive });
});

const abandonDrive = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.abandonDrive(req.user._id, req.params.driveId);
  res.status(200).json({ success: true, drive });
});

const runResumeScreening = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.runResumeScreening(req.user._id, req.params.driveId, req.file);
  res.status(200).json({ success: true, drive });
});

const startAssessment = asyncHandler(async (req, res) => {
  const { drive, aptitudeSets, codingProblem } = await placementDriveService.startAssessment(req.user._id, req.params.driveId);
  res.status(200).json({ success: true, drive, aptitudeSets, codingProblem });
});

const syncAssessment = asyncHandler(async (req, res) => {
  const { aptitudeAttemptIds, codingAttemptId } = req.body;
  const drive = await placementDriveService.syncAssessment(req.user._id, req.params.driveId, {
    aptitudeAttemptIds,
    codingAttemptId,
  });
  res.status(200).json({ success: true, drive });
});

const startTechnicalInterview = asyncHandler(async (req, res) => {
  const result = await placementDriveService.startInterviewStage(req.user._id, req.params.driveId, 'technical_interview');
  res.status(200).json({ success: true, ...result });
});

const syncTechnicalInterview = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.syncInterviewStage(req.user._id, req.params.driveId, 'technical_interview');
  res.status(200).json({ success: true, drive });
});

const startHrInterview = asyncHandler(async (req, res) => {
  const result = await placementDriveService.startInterviewStage(req.user._id, req.params.driveId, 'hr_interview');
  res.status(200).json({ success: true, ...result });
});

const syncHrInterview = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.syncInterviewStage(req.user._id, req.params.driveId, 'hr_interview');
  res.status(200).json({ success: true, drive });
});

const finalize = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.finalize(req.user._id, req.params.driveId);
  res.status(200).json({ success: true, drive });
});

// The client calls this generically after completing either interview stage (it knows
// which one from the drive's currentStage), avoiding duplicated navigation logic per stage.
const syncCurrentInterviewStage = asyncHandler(async (req, res) => {
  const drive = await placementDriveService.getDrive(req.user._id, req.params.driveId);
  if (!['technical_interview', 'hr_interview'].includes(drive.currentStage)) {
    throw new ApiError(409, `Drive is not on an interview stage (currently: ${drive.currentStage})`);
  }
  const updated = await placementDriveService.syncInterviewStage(req.user._id, req.params.driveId, drive.currentStage);
  res.status(200).json({ success: true, drive: updated });
});

const getDriveReportPdf = asyncHandler(async (req, res) => {
  const { drive, technicalReport, hrReport } = await placementDriveService.getDriveReportData(req.user._id, req.params.driveId);
  const html = buildDriveReportHtml(drive, technicalReport, hrReport);
  const pdfBuffer = await renderPdfFromHtml(html);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="placement-drive-report.pdf"',
  });
  res.send(pdfBuffer);
});

module.exports = {
  startDrive,
  getActiveDrive,
  getDrives,
  getDrive,
  abandonDrive,
  runResumeScreening,
  startAssessment,
  syncAssessment,
  startTechnicalInterview,
  syncTechnicalInterview,
  startHrInterview,
  syncHrInterview,
  syncCurrentInterviewStage,
  finalize,
  getDriveReportPdf,
};
