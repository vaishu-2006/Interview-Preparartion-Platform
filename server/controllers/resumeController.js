const asyncHandler = require('../utils/asyncHandler');
const resumeService = require('../services/resumeService');
const aiService = require('../services/aiService');
const { parseResumePdf } = require('../utils/parseResumeFile');
const { renderPdfFromHtml } = require('../utils/renderPdf');
const { buildResumeHtml } = require('../services/resumePdfTemplate');

const getResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getOrCreateResume(req.user._id);
  res.status(200).json({ success: true, resume });
});

const updateResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateResume(req.user._id, req.body);
  res.status(200).json({ success: true, message: 'Resume saved', resume });
});

const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.user._id);
  res.status(200).json({ success: true, message: 'Resume deleted' });
});

const exportPdf = asyncHandler(async (req, res) => {
  const resume = await resumeService.getOrCreateResume(req.user._id);
  const html = buildResumeHtml(resume);
  const pdfBuffer = await renderPdfFromHtml(html);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="resume.pdf"',
  });
  res.send(pdfBuffer);
});

// Standalone ATS checker — independent of Placement Drive, so it works even for courses
// (UPSC) that don't have a Placement Drive at all. Same optional-upload-or-saved-resume
// pattern as the drive's resume-screening stage.
const atsCheck = asyncHandler(async (req, res) => {
  const jobDescription = req.body?.jobDescription || '';
  let scored;
  let source;
  let uploadedFileName = '';
  if (req.file) {
    const resumeText = await parseResumePdf(req.file.path);
    scored = await aiService.scoreResume({ resumeText, jobDescription });
    source = 'uploaded';
    uploadedFileName = req.file.originalname;
  } else {
    const resume = await resumeService.getOrCreateResume(req.user._id);
    scored = await aiService.scoreResume({ resume, jobDescription });
    source = 'platform';
  }
  res.status(200).json({ success: true, ...scored, source, uploadedFileName });
});

module.exports = { getResume, updateResume, deleteResume, exportPdf, atsCheck };
