const SubjectQuestion = require('../models/SubjectQuestion');
const SubjectAttempt = require('../models/SubjectAttempt');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');

const POINTS_PER_ATTEMPT = 5;

const SUBJECTS_BY_COURSE = {
  BE: ['Operating Systems', 'DBMS', 'Computer Networks'],
  BCA: ['Programming Fundamentals', 'Web Development', 'SQL'],
};

const subjectsForCourse = (course) => {
  const subjects = SUBJECTS_BY_COURSE[course];
  if (!subjects) {
    throw new ApiError(422, 'course must be BE or BCA');
  }
  return subjects;
};

const getQuestionsForQuiz = async (course, subject, limit = 10) => {
  if (!subjectsForCourse(course).includes(subject)) {
    throw new ApiError(422, `subject must be one of: ${subjectsForCourse(course).join(', ')}`);
  }
  return SubjectQuestion.aggregate([
    { $match: { course, subject } },
    { $sample: { size: Number(limit) } },
    { $project: { question: 1, options: 1, subject: 1, difficulty: 1 } },
  ]);
};

const submitAttempt = async (userId, { course, subject, answers, timeTakenSeconds, confidenceScore }) => {
  if (!subjectsForCourse(course).includes(subject)) {
    throw new ApiError(422, `subject must be one of: ${subjectsForCourse(course).join(', ')}`);
  }
  if (!Array.isArray(answers) || !answers.length) {
    throw new ApiError(422, 'At least one answer is required');
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await SubjectQuestion.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let score = 0;
  const gradedAnswers = answers.map(({ questionId, selectedOptionIndex }) => {
    const question = questionMap.get(String(questionId));
    const isCorrect = Boolean(question) && question.correctOptionIndex === selectedOptionIndex;
    if (isCorrect) score += 1;
    return { questionId, selectedOptionIndex, isCorrect };
  });

  const attempt = await SubjectAttempt.create({
    userId,
    course,
    subject,
    answers: gradedAnswers,
    score,
    totalQuestions: answers.length,
    timeTakenSeconds: timeTakenSeconds || 0,
    confidenceScore: confidenceScore ?? null,
  });
  await awardPoints(userId, POINTS_PER_ATTEMPT);

  const review = answers.map(({ questionId, selectedOptionIndex }) => {
    const question = questionMap.get(String(questionId));
    return {
      questionId,
      question: question?.question,
      options: question?.options,
      correctOptionIndex: question?.correctOptionIndex,
      selectedOptionIndex,
      explanation: question?.explanation,
      isCorrect: question?.correctOptionIndex === selectedOptionIndex,
    };
  });

  return { attemptId: attempt._id, score, totalQuestions: answers.length, review, confidenceScore: attempt.confidenceScore };
};

const getStats = async (userId, course) => {
  const subjects = subjectsForCourse(course);
  const attempts = await SubjectAttempt.find({ userId, course });
  const percentFor = (a) => (a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0);

  const subjectPerformance = subjects.map((subject) => {
    const inSubject = attempts.filter((a) => a.subject === subject);
    if (!inSubject.length) return { subject, attempts: 0, averageScorePercent: 0 };
    const avg = Math.round(inSubject.reduce((sum, a) => sum + percentFor(a), 0) / inSubject.length);
    return { subject, attempts: inSubject.length, averageScorePercent: avg };
  });

  return {
    totalTests: attempts.length,
    subjectPerformance,
  };
};

module.exports = { SUBJECTS_BY_COURSE, getQuestionsForQuiz, submitAttempt, getStats };
