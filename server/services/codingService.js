const CodingQuestion = require('../models/CodingQuestion');
const CodingAttempt = require('../models/CodingAttempt');
const judge0Service = require('./judge0Service');
const aiService = require('./aiService');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');
const seededPick = require('../utils/seededPick');
const problemRatingService = require('./problemRatingService');

const POINTS_PER_FIRST_SOLVE = 10;
const POINTS_PER_CONTEST_SOLVE = 15;

const listProblems = async ({ difficulty, topic, userId } = {}) => {
  const filter = {};
  if (difficulty) filter.difficulty = difficulty;
  if (topic) filter.topics = topic;

  const problems = await CodingQuestion.find(filter).select('title slug difficulty topics').sort({ createdAt: 1 }).lean();
  const ratingMap = await problemRatingService.getSummariesForQuestionIds(problems.map((p) => p._id));

  let solvedSlugs = new Set();
  if (userId) {
    const accepted = await CodingAttempt.find({ userId, mode: 'submit', status: 'Accepted' })
      .populate('questionId', 'slug')
      .select('questionId');
    solvedSlugs = new Set(accepted.map((a) => a.questionId?.slug).filter(Boolean));
  }

  return problems.map((p) => ({ ...p, rating: ratingMap.get(String(p._id)) || null, solved: solvedSlugs.has(p.slug) }));
};

const getProblemBySlug = async (slug) => {
  const question = await CodingQuestion.findOne({ slug }).select('-testCases.expectedOutput -testCases.isHidden');
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }
  // Only expose visible example test cases as raw testCases; examples field already covers display.
  const obj = question.toObject();
  delete obj.testCases;
  return obj;
};

const normalize = (str = '') => str.trim().replace(/\r\n/g, '\n');

const runCode = async ({ slug, language, code, customInput }) => {
  const question = await CodingQuestion.findOne({ slug });
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }

  const stdin = customInput !== undefined && customInput !== null ? customInput : question.examples[0]?.input || '';
  const result = await judge0Service.execute({ language, code, stdin });

  return {
    status: result.forcedStatus || 'Ran',
    stdout: result.stdout,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    time: result.time,
    memory: result.memory,
  };
};

const submitCode = async (userId, { slug, language, code, confidenceScore, contestId }) => {
  const question = await CodingQuestion.findOne({ slug });
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }

  const results = [];
  let overallStatus = 'Accepted';
  let firstFailureOutput = '';

  for (const testCase of question.testCases) {
    const result = await judge0Service.execute({ language, code, stdin: testCase.input });

    if (result.forcedStatus === 'Compilation Error') {
      overallStatus = 'Compilation Error';
      firstFailureOutput = result.compileOutput;
      results.push({ passed: false, isHidden: testCase.isHidden });
      break;
    }
    if (result.forcedStatus === 'Runtime Error') {
      overallStatus = 'Runtime Error';
      firstFailureOutput = result.stderr;
      results.push({ passed: false, isHidden: testCase.isHidden });
      break;
    }

    const passed = normalize(result.stdout) === normalize(testCase.expectedOutput);
    results.push({
      passed,
      isHidden: testCase.isHidden,
      input: testCase.isHidden ? undefined : testCase.input,
      expectedOutput: testCase.isHidden ? undefined : testCase.expectedOutput,
      actualOutput: testCase.isHidden ? undefined : result.stdout,
    });

    if (!passed) {
      overallStatus = 'Wrong Answer';
      firstFailureOutput = result.stdout;
    }
  }

  const passedCount = results.filter((r) => r.passed).length;

  // Points only for a genuinely new solve — resubmitting an already-solved problem doesn't
  // farm more points.
  if (overallStatus === 'Accepted') {
    const alreadySolved = await CodingAttempt.exists({ userId, questionId: question._id, status: 'Accepted' });
    if (!alreadySolved) await awardPoints(userId, POINTS_PER_FIRST_SOLVE);

    // Contest solves earn a separate bonus, once per user per problem per contest — resubmitting
    // an already-solved contest problem doesn't farm more points.
    if (contestId) {
      const alreadySolvedInContest = await CodingAttempt.exists({
        userId,
        questionId: question._id,
        contestId,
        status: 'Accepted',
      });
      if (!alreadySolvedInContest) await awardPoints(userId, POINTS_PER_CONTEST_SOLVE);
    }
  }

  const attempt = await CodingAttempt.create({
    userId,
    questionId: question._id,
    language,
    code,
    mode: 'submit',
    status: overallStatus,
    output: firstFailureOutput,
    passedTestCases: passedCount,
    totalTestCases: question.testCases.length,
    confidenceScore: confidenceScore ?? null,
    contestId: contestId || null,
  });

  return {
    attemptId: attempt._id,
    status: overallStatus,
    passedTestCases: passedCount,
    totalTestCases: question.testCases.length,
    results,
    confidenceScore: attempt.confidenceScore,
  };
};

const getUserHistory = async (userId) => {
  const attempts = await CodingAttempt.find({ userId })
    .populate('questionId', 'title slug difficulty')
    .sort({ createdAt: -1 })
    .limit(50);
  return attempts;
};

const getUserProgress = async (userId) => {
  const [totalProblems, attempts] = await Promise.all([
    CodingQuestion.countDocuments(),
    CodingAttempt.find({ userId, mode: 'submit' }).populate('questionId', 'difficulty'),
  ]);

  const solvedQuestionIds = new Set(
    attempts.filter((a) => a.status === 'Accepted').map((a) => String(a.questionId?._id))
  );

  const solvedDifficulties = attempts
    .filter((a) => a.status === 'Accepted' && solvedQuestionIds.has(String(a.questionId?._id)))
    .reduce((map, a) => {
      map.set(String(a.questionId._id), a.questionId.difficulty);
      return map;
    }, new Map());
  const counts = { Easy: 0, Medium: 0, Hard: 0 };
  solvedDifficulties.forEach((difficulty) => {
    counts[difficulty] = (counts[difficulty] || 0) + 1;
  });

  return {
    totalProblems,
    solvedCount: solvedQuestionIds.size,
    totalAttempts: attempts.length,
    byDifficulty: counts,
    currentStreak: computeStreak(attempts.filter((a) => a.status === 'Accepted').map((a) => a.createdAt)),
  };
};

// Counts consecutive calendar days with at least one accepted submission, walking backward
// from today. A day with no activity breaks the streak — except today itself, since the
// streak should still show as "still alive" before today's attempt happens.
const computeStreak = (acceptedDates) => {
  if (!acceptedDates.length) return 0;
  const dayStrings = new Set(acceptedDates.map((d) => new Date(d).toDateString()));
  let streak = 0;
  const cursor = new Date();
  if (!dayStrings.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dayStrings.has(cursor.toDateString())) return 0;
  }
  while (dayStrings.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

// Ranks users by distinct problems solved — real data from CodingAttempt, no fabricated
// entries. Names only, top 20. Optional `college` scopes the board to entrants sharing that
// exact Profile.college value.
const getLeaderboard = async ({ college } = {}) => {
  const pipeline = [
    { $match: { mode: 'submit', status: 'Accepted' } },
    { $group: { _id: { userId: '$userId', questionId: '$questionId' } } },
    { $group: { _id: '$_id.userId', solvedCount: { $sum: 1 } } },
  ];
  if (college) {
    pipeline.push(
      { $lookup: { from: 'profiles', localField: '_id', foreignField: 'userId', as: 'profile' } },
      { $unwind: '$profile' },
      { $match: { 'profile.college': college } }
    );
  }
  pipeline.push(
    { $sort: { solvedCount: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', name: '$user.name', solvedCount: 1 } }
  );
  const rows = await CodingAttempt.aggregate(pipeline);
  return rows;
};

// ---- Daily Coding Challenge: one deterministically-picked problem/day (like a "problem of
// the day"), separate from the Weekend Contest — with a real streak that requires solving THAT
// SPECIFIC day's problem ON that calendar day, not just any problem. ----
const dateKey = (d) => d.toISOString().slice(0, 10);
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const DAILY_STREAK_LOOKBACK_DAYS = 120;

const getDailyChallenge = async (userId) => {
  const problems = await CodingQuestion.find().select('_id title slug difficulty').sort({ _id: 1 }).lean();
  if (!problems.length) return { problem: null, solvedToday: false, streak: 0 };

  const problemForDate = (dStr) => seededPick(problems, `daily-challenge-${dStr}`, 1)[0];
  const todayStr = dateKey(new Date());
  const todayProblem = problemForDate(todayStr);

  const since = new Date();
  since.setDate(since.getDate() - DAILY_STREAK_LOOKBACK_DAYS);
  const attempts = await CodingAttempt.find({ userId, status: 'Accepted', createdAt: { $gte: since } })
    .select('questionId createdAt')
    .lean();

  const solvedByDay = new Map();
  attempts.forEach((a) => {
    const d = dateKey(new Date(a.createdAt));
    if (!solvedByDay.has(d)) solvedByDay.set(d, new Set());
    solvedByDay.get(d).add(String(a.questionId));
  });

  const solvedToday = Boolean(solvedByDay.get(todayStr)?.has(String(todayProblem._id)));

  let streak = 0;
  const cursor = startOfDay(new Date());
  if (!solvedToday) cursor.setDate(cursor.getDate() - 1); // today not yet solved doesn't break an existing streak
  for (let i = 0; i < DAILY_STREAK_LOOKBACK_DAYS; i += 1) {
    const dStr = dateKey(cursor);
    const dayProblem = problemForDate(dStr);
    const solvedSet = solvedByDay.get(dStr);
    if (!solvedSet?.has(String(dayProblem._id))) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    problem: { title: todayProblem.title, slug: todayProblem.slug, difficulty: todayProblem.difficulty },
    solvedToday,
    streak,
  };
};

const reviewCode = async (userId, { slug, language, code }) => {
  const question = await CodingQuestion.findOne({ slug }).select('statement');
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }
  return aiService.reviewCode({ problemStatement: question.statement, language, code });
};

// Explains a specific failing test case — the client already has the input/expected/actual
// from its last run/submit result, so this just needs the problem statement to give the AI
// enough context, not a re-execution.
const explainFailure = async (userId, { slug, language, code, input, expectedOutput, actualOutput }) => {
  const question = await CodingQuestion.findOne({ slug }).select('statement');
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }
  return aiService.explainFailure({ problemStatement: question.statement, language, code, input, expectedOutput, actualOutput });
};

module.exports = {
  listProblems,
  getProblemBySlug,
  runCode,
  submitCode,
  getUserHistory,
  getUserProgress,
  reviewCode,
  explainFailure,
  getLeaderboard,
  getDailyChallenge,
};
