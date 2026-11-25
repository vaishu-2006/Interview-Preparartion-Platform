import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { fetchDashboard } from '../redux/slices/dashboardSlice';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.dashboard);
  const course = data?.course;

  useEffect(() => {
    if (status === 'idle') dispatch(fetchDashboard());
  }, [status, dispatch]);

  // Drives the per-course accent theme (blue/green/purple) defined in styles/index.css —
  // every component already routes color through the --accent CSS var, so this one
  // attribute is the only thing that needs to change.
  useEffect(() => {
    document.documentElement.dataset.course = course || '';
    return () => {
      delete document.documentElement.dataset.course;
    };
  }, [course]);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
