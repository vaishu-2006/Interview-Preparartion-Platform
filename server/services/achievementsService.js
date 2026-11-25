const Profile = require('../models/Profile');
const InterviewSession = require('../models/InterviewSession');
const codingService = require('./codingService');
const aptitudeService = require('./aptitudeService');
const subjectService = require('./subjectService');
const upscService = require('./upscService');
const answerWritingService = require('./answerWritingService');

// Point thresholds for each level — same points value used everywhere else on the platform
// (Profile.points, awarded via awardPoints for real actions only). Purely a relabeling of an
// existing number, not a new currency.
const LEVELS = [
  { level: 1, title: 'Getting Started', min: 0 },
  { level: 2, title: 'Building Momentum', min: 100 },
  { level: 3, title: 'Committed', min: 300 },
  { level: 4, title: 'Advanced', min: 700 },
  { level: 5, title: 'Expert', min: 1500 },
  { level: 6, title: 'Master', min: 3000 },
];

const levelFor = (points) => {
  const current = [...LEVELS].reverse().find((l) => points >= l.min) || LEVELS[0];
  const next = LEVELS.find((l) => l.min > current.min);
  const progressPercent = next
    ? Math.round(((points - current.min) / (next.min - current.min)) * 100)
    : 100;
  return {
    level: current.level,
    title: current.title,
    points,
    nextLevelPoints: next?.min ?? null,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
  };
};

// Every badge here is unlocked purely from thresholds on real, already-recorded activity
// (points, solved counts, tests taken, interviews completed) — nothing fabricated, nothing
// that can be unlocked without the underlying action actually happening.
const getAchievements = async (userId) => {
  const profile = await Profile.findOne({ userId });
  const points = profile?.points || 0;
  const course = profile?.course || null;

  const badges = [];

  if (course === 'UPSC') {
    const [upscStats, answerWritingHistory] = await Promise.all([
      upscService.getStats(userId),
      answerWritingService.getHistory(userId),
    ]);

    badges.push(
      { id: 'first_mock_test', label: 'First Mock Test', description: 'Complete your first UPSC mock test', unlocked: upscStats.totalTests >= 1 },
      { id: 'mock_test_regular', label: 'Test Series Regular', description: 'Complete 10 UPSC mock tests', unlocked: upscStats.totalTests >= 10 },
      { id: 'mock_test_veteran', label: 'Test Series Veteran', description: 'Complete 25 UPSC mock tests', unlocked: upscStats.totalTests >= 25 },
      { id: 'prelims_cleared', label: 'Prelims Cleared', description: `Score ${upscStats.passPercent}%+ on a Prelims mock test`, unlocked: upscStats.prelimsCleared },
      { id: 'mains_attempted', label: 'Mains Contender', description: 'Attempt a Mains-tier mock test', unlocked: upscStats.mainsAttempts >= 1 },
      { id: 'answer_writer', label: 'Answer Writing Starter', description: 'Submit your first Mains-style answer for AI feedback', unlocked: answerWritingHistory.length >= 1 },
      { id: 'answer_writer_regular', label: 'Answer Writing Regular', description: 'Submit 10 answers for AI feedback', unlocked: answerWritingHistory.length >= 10 },
    );
  } else {
    // subjectService only recognizes BE/BCA — a user who hasn't finished course selection yet
    // (course is null) still has coding/aptitude/interview badges to show, just none from
    // subject-wise prep yet.
    const [codingProgress, aptitudeStats, subjectStats, completedInterviews] = await Promise.all([
      codingService.getUserProgress(userId),
      aptitudeService.getStats(userId),
      ['BE', 'BCA'].includes(course) ? subjectService.getStats(userId, course) : Promise.resolve({ totalTests: 0 }),
      InterviewSession.countDocuments({ userId, status: 'completed' }),
    ]);

    badges.push(
      { id: 'first_solve', label: 'First Blood', description: 'Solve your first coding problem', unlocked: codingProgress.solvedCount >= 1 },
      { id: 'coding_10', label: 'Problem Solver', description: 'Solve 10 coding problems', unlocked: codingProgress.solvedCount >= 10 },
      { id: 'coding_30', label: 'Coding Pro', description: 'Solve 30 coding problems', unlocked: codingProgress.solvedCount >= 30 },
      { id: 'coding_60', label: 'Coding Master', description: 'Solve 60 coding problems', unlocked: codingProgress.solvedCount >= 60 },
      { id: 'hard_solver', label: 'Hard Mode', description: 'Solve a Hard-difficulty problem', unlocked: (codingProgress.byDifficulty?.Hard || 0) >= 1 },
      { id: 'streak_3', label: 'On a Roll', description: 'Keep a 3-day coding streak', unlocked: codingProgress.currentStreak >= 3 },
      { id: 'streak_7', label: 'Week-Long Streak', description: 'Keep a 7-day coding streak', unlocked: codingProgress.currentStreak >= 7 },
      { id: 'aptitude_5', label: 'Aptitude Regular', description: 'Complete 5 aptitude tests', unlocked: aptitudeStats.totalTests >= 5 },
      { id: 'aptitude_sharp', label: 'Sharp Mind', description: 'Score 80%+ on an aptitude test', unlocked: aptitudeStats.highestScorePercent >= 80 },
      { id: 'subject_5', label: 'Subject Prep Regular', description: 'Complete 5 subject-wise MCQ tests', unlocked: subjectStats.totalTests >= 5 },
      { id: 'interview_1', label: 'Interview Ready', description: 'Complete your first mock interview', unlocked: completedInterviews >= 1 },
      { id: 'interview_5', label: 'Interview Veteran', description: 'Complete 5 mock interviews', unlocked: completedInterviews >= 5 },
    );
  }

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return {
    ...levelFor(points),
    badges,
    unlockedCount,
    totalBadges: badges.length,
  };
};

module.exports = { getAchievements };
