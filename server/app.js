const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { clientUrl, nodeEnv } = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const selectionRoutes = require('./routes/selectionRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const codingRoutes = require('./routes/codingRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const historyRoutes = require('./routes/historyRoutes');
const placementDriveRoutes = require('./routes/placementDriveRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const upscRoutes = require('./routes/upscRoutes');
const achievementsRoutes = require('./routes/achievementsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const studyPlannerRoutes = require('./routes/studyPlannerRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const contestRoutes = require('./routes/contestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const referralRoutes = require('./routes/referralRoutes');
const studyGroupRoutes = require('./routes/studyGroupRoutes');
const companyTagRoutes = require('./routes/companyTagRoutes');
const careerRoutes = require('./routes/careerRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contestTeamRoutes = require('./routes/contestTeamRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const practiceRoomRoutes = require('./routes/practiceRoomRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const dataExportRoutes = require('./routes/dataExportRoutes');
const pushRoutes = require('./routes/pushRoutes');

const app = express();

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/selection', selectionRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/placement-drive', placementDriveRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/upsc', upscRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/company-tags', companyTagRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contest-teams', contestTeamRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/practice-rooms', practiceRoomRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/account', dataExportRoutes);
app.use('/api/push', pushRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
