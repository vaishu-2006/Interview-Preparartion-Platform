const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const githubService = require('../services/githubService');
const resumeService = require('../services/resumeService');

const getRepos = asyncHandler(async (req, res) => {
  const { username } = req.query;
  if (!username) {
    throw new ApiError(422, 'A GitHub username is required');
  }
  const repos = await githubService.fetchPublicRepos(username);
  res.status(200).json({ success: true, repos });
});

const importRepos = asyncHandler(async (req, res) => {
  const { repos } = req.body;
  if (!Array.isArray(repos) || !repos.length) {
    throw new ApiError(422, 'At least one repository must be provided');
  }
  const resume = await resumeService.addProjectsFromGithub(req.user._id, repos);
  res.status(200).json({ success: true, message: 'Repositories imported into your resume', resume });
});

module.exports = { getRepos, importRepos };
