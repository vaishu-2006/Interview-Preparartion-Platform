import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import jobApplicationService from '../services/jobApplicationService';
import Icon from '../components/icons/Icon';

const ROLES_BY_COURSE = {
  BE: ['Software Engineer', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Engineer', 'ML Engineer', 'QA Engineer', 'Cloud Engineer', 'Systems Engineer'],
  BCA: ['Software Developer', 'Web Developer', 'Backend Developer', 'Database Administrator', 'QA Tester', 'IT Support Engineer', 'Application Developer', 'Junior Programmer'],
};
const DEFAULT_ROLES = ROLES_BY_COURSE.BE;

// Constructed public search-result URLs, not scraped or fabricated listings — same reasoning
// as declining to scrape LeetCode/HackerRank problem content earlier in this project.
const buildApplyLinks = (role) => {
  const q = encodeURIComponent(role);
  const slug = role.toLowerCase().trim().replace(/\s+/g, '-');
  return [
    { label: 'LinkedIn', href: `https://www.linkedin.com/jobs/search/?keywords=${q}` },
    { label: 'Indeed', href: `https://www.indeed.com/jobs?q=${q}` },
    { label: 'Naukri', href: `https://www.naukri.com/${slug}-jobs` },
  ];
};

// Real salary-research sites, not fabricated numbers — this app has no verified compensation
// data source, so linking to where real (crowd-sourced or reported) numbers actually live is
// the honest version of "salary insights".
const buildSalaryLinks = (role) => {
  const q = encodeURIComponent(role);
  return [
    { label: 'Levels.fyi', href: `https://www.levels.fyi/t/software-engineer?search=${q}` },
    { label: 'AmbitionBox', href: `https://www.ambitionbox.com/profile/${role.toLowerCase().trim().replace(/\s+/g, '-')}-salary` },
    { label: 'Glassdoor', href: `https://www.glassdoor.co.in/Salaries/index.htm?keyword=${q}` },
  ];
};

const buildInternshipLinks = (role) => {
  const q = encodeURIComponent(role);
  return [
    { label: 'Internshala', href: `https://internshala.com/internships/keywords-${role.toLowerCase().trim().replace(/\s+/g, '-')}` },
    { label: 'LinkedIn Internships', href: `https://www.linkedin.com/jobs/search/?keywords=${q}%20intern` },
  ];
};

const STATUS_STYLES = {
  saved: 'text-ink-2 bg-surface',
  applied: 'text-brand-500 bg-brand-600/10',
  interviewing: 'text-gold bg-gold/10',
  offer: 'text-brand-500 bg-brand-600/15',
  rejected: 'text-danger bg-danger/10',
};
const STATUSES = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];

const JobsPage = () => {
  const course = useSelector((state) => state.dashboard.data?.course);
  const roles = ROLES_BY_COURSE[course] || DEFAULT_ROLES;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ company: '', role: '', link: '' });
  const [adding, setAdding] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchedTitle, setSearchedTitle] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTitle.trim()) return;
    setSearchedTitle(searchTitle.trim());
  };

  const loadApplications = () =>
    jobApplicationService
      .list()
      .then((data) => setApplications(data.applications))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadApplications();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      toast.error('Company and role are required');
      return;
    }
    setAdding(true);
    try {
      await jobApplicationService.create(form);
      setForm({ company: '', role: '', link: '' });
      loadApplications();
      toast.success('Application logged');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add application');
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      await jobApplicationService.update(id, { status });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      loadApplications();
    }
  };

  const handleDelete = async (id) => {
    try {
      await jobApplicationService.remove(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove application');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Jobs</h1>
        <p className="mt-1 text-ink-3">
          Popular roles for {course || 'your course'}, with direct search links to apply, real salary-research sites (not numbers we
          claim ourselves), and internship search links — plus a tracker for the applications you send out.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Search Any Job Title</h2>
        <div className="card p-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <input
              className="input-field flex-1"
              placeholder="e.g. Site Reliability Engineer, UI/UX Designer, Data Analyst..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <button type="submit" className="btn-primary px-5">
              Search
            </button>
          </form>
          {searchedTitle && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-surface-border pt-5">
              <span className="text-sm text-ink-2">Apply for &ldquo;{searchedTitle}&rdquo;:</span>
              {buildApplyLinks(searchedTitle).map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                  Apply on {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Popular Roles</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
                  <Icon name="briefcase" className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="font-semibold text-ink-1">{role}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {buildApplyLinks(role).map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                    Apply on {l.label}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-surface-border pt-3 text-xs">
                <span className="text-ink-3">Salary insights:</span>
                {buildSalaryLinks(role).map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                <span className="text-ink-3">Internships:</span>
                {buildInternshipLinks(role).map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">My Applications</h2>
        <div className="card p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              className="input-field sm:col-span-1"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
            <input
              className="input-field sm:col-span-1"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
            <input
              className="input-field sm:col-span-1"
              placeholder="Link (optional)"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            />
            <button type="submit" disabled={adding} className="btn-primary sm:col-span-1">
              {adding ? 'Adding...' : 'Add Application'}
            </button>
          </form>
        </div>

        <div className="mt-4 space-y-2">
          {loading && <p className="text-sm text-ink-3">Loading...</p>}
          {!loading && !applications.length && (
            <p className="text-sm text-ink-3">No applications logged yet — add one above to start tracking.</p>
          )}
          {applications.map((app) => (
            <div key={app._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-ink-1">
                  {app.role} <span className="text-ink-3">&middot; {app.company}</span>
                </p>
                {app.link && (
                  <a href={app.link} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:underline">
                    {app.link}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className={`rounded-full border-none px-3 py-1 text-xs font-medium capitalize outline-none ${STATUS_STYLES[app.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleDelete(app._id)} className="text-ink-3 hover:text-danger" aria-label="Remove application">
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
