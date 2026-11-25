const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.user._id);
  res.status(200).json({ success: true, dashboard });
});

const updateDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.updateDashboard(req.user._id, req.body);
  res.status(200).json({ success: true, message: 'Dashboard updated successfully', dashboard });
});

const saveCourse = asyncHandler(async (req, res) => {
  const profile = await dashboardService.saveCourse(req.user._id, req.body.course);
  res.status(200).json({ success: true, message: 'Course saved successfully', profile });
});

const saveBranch = asyncHandler(async (req, res) => {
  const profile = await dashboardService.saveBranch(req.user._id, req.body.branch);
  res.status(200).json({ success: true, message: 'Branch saved successfully', profile });
});

const getBranchOptions = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, branches: dashboardService.BRANCHES_BY_COURSE });
});

module.exports = { getDashboard, updateDashboard, saveCourse, saveBranch, getBranchOptions };
