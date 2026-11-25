const mongoose = require('mongoose');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Dashboard = require('../models/Dashboard');
const Resume = require('../models/Resume');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const CodingAttempt = require('../models/CodingAttempt');
const SubjectAttempt = require('../models/SubjectAttempt');
const UpscAttempt = require('../models/UpscAttempt');
const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');
const InterviewSession = require('../models/InterviewSession');
const InterviewConfiguration = require('../models/InterviewConfiguration');
const InterviewTurn = require('../models/InterviewTurn');
const InterviewMetrics = require('../models/InterviewMetrics');
const InterviewReport = require('../models/InterviewReport');
const PlacementDrive = require('../models/PlacementDrive');
const JobApplication = require('../models/JobApplication');
const Bookmark = require('../models/Bookmark');
const StudyTask = require('../models/StudyTask');
const Discussion = require('../models/Discussion');
const ReferralPost = require('../models/ReferralPost');
const StudyGroupMessage = require('../models/StudyGroupMessage');
const CompanyTag = require('../models/CompanyTag');
const ProblemRating = require('../models/ProblemRating');
const PracticeRoom = require('../models/PracticeRoom');
const ContestTeam = require('../models/ContestTeam');
const Notification = require('../models/Notification');
const Flashcard = require('../models/Flashcard');

// Every collection that stores something tied to this user, keyed by the field it's stored
// under — a straightforward `userId`-scoped find for the vast majority of the schema. Kept as
// a flat declarative list so adding a new personal-data collection later is a one-line change,
// not a design decision. Real records only, nothing summarized or invented.
const USER_SCOPED_COLLECTIONS = [
  { key: 'profile', model: Profile, field: 'userId', many: false },
  { key: 'dashboard', model: Dashboard, field: 'userId', many: false },
  { key: 'resume', model: Resume, field: 'userId', many: false },
  { key: 'aptitudeAttempts', model: AptitudeAttempt, field: 'userId', many: true },
  { key: 'codingAttempts', model: CodingAttempt, field: 'userId', many: true },
  { key: 'subjectAttempts', model: SubjectAttempt, field: 'userId', many: true },
  { key: 'upscAttempts', model: UpscAttempt, field: 'userId', many: true },
  { key: 'answerWritingAttempts', model: AnswerWritingAttempt, field: 'userId', many: true },
  { key: 'interviewSessions', model: InterviewSession, field: 'userId', many: true },
  { key: 'interviewConfigurations', model: InterviewConfiguration, field: 'userId', many: true },
  { key: 'interviewTurns', model: InterviewTurn, field: 'userId', many: true },
  { key: 'interviewMetrics', model: InterviewMetrics, field: 'userId', many: true },
  { key: 'interviewReports', model: InterviewReport, field: 'userId', many: true },
  { key: 'placementDrives', model: PlacementDrive, field: 'userId', many: true },
  { key: 'jobApplications', model: JobApplication, field: 'userId', many: true },
  { key: 'bookmarks', model: Bookmark, field: 'userId', many: true },
  { key: 'studyTasks', model: StudyTask, field: 'userId', many: true },
  { key: 'discussionPosts', model: Discussion, field: 'userId', many: true },
  { key: 'referralPosts', model: ReferralPost, field: 'userId', many: true },
  { key: 'studyGroupMessages', model: StudyGroupMessage, field: 'userId', many: true },
  { key: 'companyTagsReported', model: CompanyTag, field: 'userId', many: true },
  { key: 'problemRatings', model: ProblemRating, field: 'userId', many: true },
  { key: 'notifications', model: Notification, field: 'userId', many: true },
  { key: 'flashcards', model: Flashcard, field: 'userId', many: true },
];

const buildExport = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  // `password` already has `select: false` on the schema, so it's excluded by default anyway —
  // this is just explicit about intent.
  const user = await User.findById(objectId).select('-password').lean();

  const collectionResults = await Promise.all(
    USER_SCOPED_COLLECTIONS.map(async ({ key, model, field, many }) => {
      const query = model.find({ [field]: objectId }).lean();
      const result = many ? await query : await query.then((rows) => rows[0] || null);
      return [key, result];
    })
  );

  // Rooms hosted or joined, and contest teams belonged to — not a plain `userId` field, so
  // handled separately.
  const [practiceRoomsHosted, practiceRoomsJoined, contestTeams] = await Promise.all([
    PracticeRoom.find({ hostId: objectId }).lean(),
    PracticeRoom.find({ joinedById: objectId }).lean(),
    ContestTeam.find({ members: objectId }).select('name inviteCode createdAt').lean(),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    account: user,
    ...Object.fromEntries(collectionResults),
    practiceRoomsHosted,
    practiceRoomsJoined,
    contestTeams,
  };

  return data;
};

module.exports = { buildExport };
