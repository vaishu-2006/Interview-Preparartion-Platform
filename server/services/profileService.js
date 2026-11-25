const User = require('../models/User');
const Profile = require('../models/Profile');
const ApiError = require('../utils/ApiError');

const getFullProfile = async (userId) => {
  const [user, profile] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ userId }),
  ]);

  if (!user || !profile) {
    throw new ApiError(404, 'Profile not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    githubUsername: user.githubUsername,
    profileImage: user.profileImage,
    course: profile.course,
    branch: profile.branch,
    college: profile.college,
    year: profile.year,
    skills: profile.skills,
    targetRole: profile.targetRole,
    targetCompany: profile.targetCompany,
  };
};

const updateFullProfile = async (userId, updates) => {
  const userFields = ['name', 'githubUsername', 'profileImage'];
  const profileFields = ['college', 'year', 'skills', 'targetRole', 'targetCompany'];

  const userUpdates = {};
  const profileUpdates = {};

  userFields.forEach((field) => {
    if (updates[field] !== undefined) userUpdates[field] = updates[field];
  });
  profileFields.forEach((field) => {
    if (updates[field] !== undefined) profileUpdates[field] = updates[field];
  });

  await Promise.all([
    Object.keys(userUpdates).length
      ? User.findByIdAndUpdate(userId, userUpdates)
      : Promise.resolve(),
    Object.keys(profileUpdates).length
      ? Profile.findOneAndUpdate({ userId }, profileUpdates)
      : Promise.resolve(),
  ]);

  return getFullProfile(userId);
};

module.exports = { getFullProfile, updateFullProfile };
