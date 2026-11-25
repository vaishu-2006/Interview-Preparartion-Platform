const asyncHandler = require('../utils/asyncHandler');
const contestService = require('../services/contestService');
const Profile = require('../models/Profile');
const { renderPdfFromHtml } = require('../utils/renderPdf');
const { buildCertificateHtml } = require('../services/certificatePdfTemplate');

const getCurrentContest = asyncHandler(async (req, res) => {
  const contest = await contestService.getCurrentContest(req.user._id);
  res.status(200).json({ success: true, contest });
});

const getLeaderboard = asyncHandler(async (req, res) => {
  let college;
  if (req.query.scope === 'college') {
    const profile = await Profile.findOne({ userId: req.user._id }).select('college');
    college = profile?.college || undefined;
  }
  const leaderboard = await contestService.getLeaderboard(req.params.contestId, { college });
  res.status(200).json({ success: true, leaderboard, scopedToCollege: college || null });
});

const getPreviousContest = asyncHandler(async (req, res) => {
  const contest = await contestService.getPreviousContest();
  res.status(200).json({ success: true, contest });
});

const getMyStats = asyncHandler(async (req, res) => {
  const stats = await contestService.getMyContestStats(req.user._id);
  res.status(200).json({ success: true, stats });
});

const downloadCertificate = asyncHandler(async (req, res) => {
  const eligibility = await contestService.getCertificateEligibility(req.user._id, req.params.contestId);
  const html = buildCertificateHtml(eligibility);
  const pdfBuffer = await renderPdfFromHtml(html);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="contest-certificate.pdf"',
    'Content-Length': pdfBuffer.length,
  });
  res.send(pdfBuffer);
});

module.exports = { getCurrentContest, getLeaderboard, getMyStats, getPreviousContest, downloadCertificate };
