const JobApplication = require('../models/JobApplication');
const ApiError = require('../utils/ApiError');

const STATUSES = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];

const listApplications = (userId) => JobApplication.find({ userId }).sort({ createdAt: -1 });

const createApplication = async (userId, { company, role, status, link, notes, appliedDate }) => {
  if (!company?.trim() || !role?.trim()) {
    throw new ApiError(422, 'company and role are required');
  }
  if (status && !STATUSES.includes(status)) {
    throw new ApiError(422, `status must be one of: ${STATUSES.join(', ')}`);
  }
  return JobApplication.create({
    userId,
    company: company.trim(),
    role: role.trim(),
    status: status || 'saved',
    link: link || '',
    notes: notes || '',
    appliedDate: appliedDate ? new Date(appliedDate) : undefined,
  });
};

const updateApplication = async (userId, id, updates) => {
  if (updates.status && !STATUSES.includes(updates.status)) {
    throw new ApiError(422, `status must be one of: ${STATUSES.join(', ')}`);
  }
  const allowed = ['company', 'role', 'status', 'link', 'notes', 'appliedDate'];
  const payload = {};
  allowed.forEach((field) => {
    if (updates[field] !== undefined) payload[field] = updates[field];
  });

  const application = await JobApplication.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  return application;
};

const deleteApplication = async (userId, id) => {
  const application = await JobApplication.findOneAndDelete({ _id: id, userId });
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
};

module.exports = { listApplications, createApplication, updateApplication, deleteApplication };
