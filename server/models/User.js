const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    githubUsername: { type: String, trim: true, default: '' },
    profileImage: { type: String, default: '' },
    hasSelectedPath: { type: Boolean, default: false },
    // No self-service escalation anywhere in the app — the first faculty/admin account is
    // promoted directly in the database (see server/scripts/promoteUser.js), the same way
    // every real system bootstraps its first privileged account.
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
