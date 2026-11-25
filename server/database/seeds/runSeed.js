require('dotenv').config();
const connectDB = require('../connection');
const CodingQuestion = require('../../models/CodingQuestion');
const AptitudeQuestion = require('../../models/AptitudeQuestion');
const SubjectQuestion = require('../../models/SubjectQuestion');
const UpscQuestion = require('../../models/UpscQuestion');
const codingQuestions = require('./codingQuestions');
const aptitudeQuestions = require('./aptitudeQuestions');
const subjectQuestions = require('./subjectQuestions');
const upscQuestions = require('./upscQuestions');

async function seedIfEmpty(Model, data, label) {
  const count = await Model.countDocuments();
  if (count === 0) {
    await Model.insertMany(data);
    console.log(`Seeded ${data.length} ${label}`);
  } else {
    console.log(`${label} already seeded (${count} present), skipping`);
  }
}

async function run() {
  await connectDB();

  await seedIfEmpty(CodingQuestion, codingQuestions, 'coding questions');
  await seedIfEmpty(AptitudeQuestion, aptitudeQuestions, 'aptitude questions');
  await seedIfEmpty(SubjectQuestion, subjectQuestions, 'subject questions');
  await seedIfEmpty(UpscQuestion, upscQuestions, 'UPSC questions');

  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
