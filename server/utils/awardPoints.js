const Profile = require('../models/Profile');

// Fire-and-forget point awards for real, already-verified actions (an accepted submission,
// a completed test, a finished interview) — never for actions that could be gamed by retrying,
// and never tied to a "reward store" since this app has no real fulfillment pipeline.
const awardPoints = async (userId, amount) => {
  try {
    await Profile.findOneAndUpdate({ userId }, { $inc: { points: amount } });
  } catch {
    // Points are a nice-to-have gamification layer, not core functionality — never let a
    // point-award failure break the underlying action (a submission, a completed test).
  }
};

module.exports = awardPoints;
