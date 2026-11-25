const asyncHandler = require('../utils/asyncHandler');
const jobApplicationService = require('../services/jobApplicationService');

const listApplications = asyncHandler(async (req, res) => {
  const applications = await jobApplicationService.listApplications(req.user._id);
  res.status(200).json({ success: true, applications });
});

const createApplication = asyncHandler(async (req, res) => {
  const application = await jobApplicationService.createApplication(req.user._id, req.body);
  res.status(201).json({ success: true, application });
});

const updateApplication = asyncHandler(async (req, res) => {
  const application = await jobApplicationService.updateApplication(req.user._id, req.params.id, req.body);
  res.status(200).json({ success: true, application });
});

const deleteApplication = asyncHandler(async (req, res) => {
  await jobApplicationService.deleteApplication(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Application removed' });
});

module.exports = { listApplications, createApplication, updateApplication, deleteApplication };
