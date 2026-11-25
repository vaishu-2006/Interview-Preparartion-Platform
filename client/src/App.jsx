import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './redux/slices/authSlice';

import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SelectPathPage from './pages/SelectPathPage';
import DashboardHomePage from './pages/DashboardHomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import AtsCheckerPage from './pages/AtsCheckerPage';
import JobsPage from './pages/JobsPage';
import SubjectPrepPage from './pages/SubjectPrepPage';
import PreviousPapersPage from './pages/upsc/PreviousPapersPage';
import CurrentAffairsPage from './pages/upsc/CurrentAffairsPage';
import DoubtSolverPage from './pages/upsc/DoubtSolverPage';
import UpscMockTestsPage from './pages/upsc/UpscMockTestsPage';
import AnswerWritingPage from './pages/upsc/AnswerWritingPage';
import AptitudePage from './pages/AptitudePage';
import CodingListPage from './pages/CodingListPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import PlacementDriveLandingPage from './pages/PlacementDriveLandingPage';
import InterviewConfigPage from './pages/InterviewConfigPage';
import InterviewReportPage from './pages/InterviewReportPage';
import WeekendContestPage from './pages/WeekendContestPage';
import StudyPlannerPage from './pages/upsc/StudyPlannerPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import ReferralBoardPage from './pages/ReferralBoardPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import StudyGroupDetailPage from './pages/StudyGroupDetailPage';
import AdminPanelPage from './pages/AdminPanelPage';
import PortfolioPage from './pages/PortfolioPage';
import FlashcardsPage from './pages/FlashcardsPage';

// Code-split heavy, rarely-loaded-together pages: Monaco editor, recharts, and MediaPipe's vision WASM/model.
const CodingProblemPage = lazy(() => import('./pages/CodingProblemPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const LiveInterviewPage = lazy(() => import('./pages/LiveInterviewPage'));
const PlacementDrivePage = lazy(() => import('./pages/PlacementDrivePage')); // pulls in the Monaco editor via OnlineAssessmentStage
const MockTestsPage = lazy(() => import('./pages/MockTestsPage')); // pulls in the Monaco editor for the coding mock test
const PracticeRoomsPage = lazy(() => import('./pages/PracticeRoomsPage')); // pulls in socket.io-client
const PracticeRoomCallPage = lazy(() => import('./pages/PracticeRoomCallPage')); // pulls in socket.io-client

function App() {
  const dispatch = useDispatch();
  const [checkingSession, setCheckingSession] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingSession(false);
      return;
    }
    dispatch(fetchCurrentUser()).finally(() => setCheckingSession(false));
  }, [dispatch]);

  if (checkingSession) {
    return <LoadingScreen label="Restoring your session..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/p/:slug" element={<PortfolioPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/select-path" element={<SelectPathPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resume" element={<ResumeBuilderPage />} />
          <Route path="/ats-checker" element={<AtsCheckerPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/subject-prep" element={<SubjectPrepPage />} />
          <Route path="/upsc/previous-papers" element={<PreviousPapersPage />} />
          <Route path="/upsc/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/upsc/mock-tests" element={<UpscMockTestsPage />} />
          <Route path="/upsc/answer-writing" element={<AnswerWritingPage />} />
          <Route path="/upsc/doubt-solver" element={<DoubtSolverPage />} />
          <Route path="/upsc/study-planner" element={<StudyPlannerPage />} />
          <Route path="/contest" element={<WeekendContestPage />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="/referrals" element={<ReferralBoardPage />} />
          <Route path="/study-groups" element={<StudyGroupsPage />} />
          <Route path="/study-groups/:groupId" element={<StudyGroupDetailPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route
            path="/practice-rooms"
            element={
              <Suspense fallback={<LoadingScreen label="Loading practice rooms..." />}>
                <PracticeRoomsPage />
              </Suspense>
            }
          />
          <Route
            path="/practice-rooms/:roomId"
            element={
              <Suspense fallback={<LoadingScreen label="Loading room..." />}>
                <PracticeRoomCallPage />
              </Suspense>
            }
          />
          <Route path="/practice" element={<AptitudePage />} />
          <Route path="/coding" element={<CodingListPage />} />
          <Route
            path="/coding/:slug"
            element={
              <Suspense fallback={<LoadingScreen label="Loading editor..." />}>
                <CodingProblemPage />
              </Suspense>
            }
          />
          <Route path="/study-materials" element={<StudyMaterialsPage />} />
          <Route
            path="/mock-tests"
            element={
              <Suspense fallback={<LoadingScreen label="Loading mock tests..." />}>
                <MockTestsPage />
              </Suspense>
            }
          />
          <Route path="/placement-drive" element={<PlacementDriveLandingPage />} />
          <Route
            path="/placement-drive/:driveId"
            element={
              <Suspense fallback={<LoadingScreen label="Loading your drive..." />}>
                <PlacementDrivePage />
              </Suspense>
            }
          />
          <Route path="/mock-interview" element={<InterviewConfigPage />} />
          <Route
            path="/mock-interview/session/:sessionId"
            element={
              <Suspense fallback={<LoadingScreen label="Loading interview session..." />}>
                <LiveInterviewPage />
              </Suspense>
            }
          />
          <Route path="/mock-interview/report/:sessionId" element={<InterviewReportPage />} />
          <Route
            path="/performance"
            element={
              <Suspense fallback={<LoadingScreen label="Loading performance data..." />}>
                <PerformancePage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
