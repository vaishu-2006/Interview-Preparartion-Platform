const Resume = require('../models/Resume');
const ApiError = require('../utils/ApiError');
const githubService = require('./githubService');

const EDITABLE_FIELDS = [
  'template',
  'sectionOrder',
  'personalDetails',
  'education',
  'skills',
  'projects',
  'experience',
  'certifications',
  'achievements',
  'languages',
  'declaration',
];

const getOrCreateResume = async (userId) => {
  let resume = await Resume.findOne({ userId });
  if (!resume) {
    resume = await Resume.create({ userId });
  }
  return resume;
};

const updateResume = async (userId, updates) => {
  const payload = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (updates[field] !== undefined) payload[field] = updates[field];
  });

  const resume = await Resume.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return resume;
};

const deleteResume = async (userId) => {
  const result = await Resume.findOneAndDelete({ userId });
  if (!result) {
    throw new ApiError(404, 'Resume not found');
  }
};

const addProjectsFromGithub = async (userId, repos) => {
  const resume = await getOrCreateResume(userId);
  const newProjects = await Promise.all(
    repos.map(async (repo) => {
      // Most personal repos never fill in the GitHub "description" field — fall back to
      // pulling one from the README so imported projects aren't left blank on the resume.
      const description = repo.description?.trim() || (await githubService.fetchReadmeSummary(repo.owner, repo.name));
      return {
        title: repo.name,
        description,
        techStack: repo.language ? [repo.language] : [],
        link: repo.homepage || repo.htmlUrl,
        githubUrl: repo.htmlUrl,
        fromGithub: true,
      };
    })
  );
  resume.projects.push(...newProjects);
  await resume.save();
  return resume;
};

module.exports = { getOrCreateResume, updateResume, deleteResume, addProjectsFromGithub };
