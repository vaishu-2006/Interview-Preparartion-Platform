// One-off bootstrap script — there is no in-app way to grant faculty/admin access, by design
// (a self-service role-escalation endpoint would be a privilege-escalation hole). Run this
// directly against the database to promote the first admin/faculty account:
//   node scripts/promoteUser.js someone@example.com admin
//   node scripts/promoteUser.js someone@example.com faculty
require('dotenv').config();
const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const User = require('../models/User');

const [, , email, role] = process.argv;

if (!email || !['faculty', 'admin'].includes(role)) {
  console.error('Usage: node scripts/promoteUser.js <email> <faculty|admin>');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(async () => {
    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
    if (!user) {
      console.error(`No user found with email ${email}`);
      process.exit(1);
    }
    console.log(`${user.email} is now "${role}".`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to promote user:', err.message);
    process.exit(1);
  });
