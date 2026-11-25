const RoleRoadmap = require('../models/RoleRoadmap');
const aiService = require('../services/aiService');

const slugify = (role) => role.trim().toLowerCase().replace(/\s+/g, ' ');

const getRoadmapForRole = async (role, course = '') => {
  const roleSlug = slugify(role);
  const cached = await RoleRoadmap.findOne({ roleSlug, course: course || '' });
  if (cached) {
    return { role: cached.role, stages: cached.stages, generatedByAI: true, aiProvider: cached.aiProvider, cached: true };
  }

  const result = await aiService.generateRoleRoadmap({ role, course });
  if (!result.stages.length) {
    return { role, ...result, cached: false };
  }

  const saved = await RoleRoadmap.findOneAndUpdate(
    { roleSlug, course: course || '' },
    { roleSlug, course: course || '', role: role.trim(), stages: result.stages, aiProvider: result.aiProvider },
    { upsert: true, new: true }
  );
  return { role: saved.role, stages: saved.stages, generatedByAI: true, aiProvider: saved.aiProvider, cached: false };
};

module.exports = { getRoadmapForRole };
