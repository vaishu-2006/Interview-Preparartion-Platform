const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.register(req.body);
  res.status(201).json({ success: true, message: 'Account created successfully', token, user });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.status(200).json({ success: true, message: 'Logged in successfully', token, user });
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT: client discards the token. Endpoint exists for a consistent API contract.
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: authService.sanitizeUser(req.user) });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const rawToken = await authService.forgotPassword(req.body.email);

  // No email provider is configured yet; log the reset link server-side so the flow
  // is testable end-to-end. Wire in a real mailer (SendGrid/Nodemailer) before production.
  if (rawToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;
    console.log(`Password reset link for ${req.body.email}: ${resetUrl}`);
  }

  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent',
    ...(process.env.NODE_ENV !== 'production' && rawToken ? { devResetToken: rawToken } : {}),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(req.user._id);
  res.status(200).json({ success: true, message: 'Account deleted successfully' });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
};
