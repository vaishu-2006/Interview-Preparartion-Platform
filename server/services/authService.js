const crypto = require('crypto');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Dashboard = require('../models/Dashboard');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');

const POINTS_PER_DAILY_LOGIN = 1;
const isSameCalendarDay = (a, b) => a && new Date(a).toDateString() === new Date(b).toDateString();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  githubUsername: user.githubUsername,
  profileImage: user.profileImage,
  hasSelectedPath: user.hasSelectedPath,
  role: user.role,
});

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  await Profile.create({ userId: user._id });
  await Dashboard.create({ userId: user._id });

  const token = generateToken(user._id);
  return { token, user: sanitizeUser(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const previousDashboard = await Dashboard.findOneAndUpdate({ userId: user._id }, { lastLogin: new Date() });
  if (!isSameCalendarDay(previousDashboard?.lastLogin, new Date())) {
    await awardPoints(user._id, POINTS_PER_DAILY_LOGIN);
  }

  const token = generateToken(user._id);
  return { token, user: sanitizeUser(user) };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  return rawToken;
};

const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
};

const deleteAccount = async (userId) => {
  await Promise.all([
    User.findByIdAndDelete(userId),
    Profile.findOneAndDelete({ userId }),
    Dashboard.findOneAndDelete({ userId }),
  ]);
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  sanitizeUser,
};
