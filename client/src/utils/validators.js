export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const passwordChecks = (password = '') => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
});

export const isPasswordStrong = (password) => {
  const checks = passwordChecks(password);
  return checks.minLength && checks.hasUppercase && checks.hasNumber;
};
