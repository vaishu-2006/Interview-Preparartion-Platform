import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';
import codingService from '../services/codingService';
import useAuth from '../hooks/useAuth';
import StatCard from '../components/dashboard/StatCard';
import Icon from '../components/icons/Icon';

const COURSES = ['BE', 'BCA', 'UPSC'];

const AdminPanelPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  if (!isAdmin && !isFaculty) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-ink-2">This page is only available to faculty and admin accounts.</p>
      </div>
    );
  }

  return <AdminPanelContent isAdmin={isAdmin} />;
};

const AdminPanelContent = ({ isAdmin }) => {
  const [tab, setTab] = useState(isAdmin ? 'stats' : 'students');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState(null);
  const [courseFilter, setCourseFilter] = useState('');
  const [problems, setProblems] = useState([]);
  const [assignForm, setAssignForm] = useState({ studentId: '', course: '', problemId: '', dueDate: '' });
  const [assigning, setAssigning] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', bonusPoints: '', course: '', startsAt: '', endsAt: '' });
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [events, setEvents] = useState(null);
  const [awardForm, setAwardForm] = useState({ userId: '', amount: '', reason: '' });
  const [awarding, setAwarding] = useState(false);
  const [cohortCourse, setCohortCourse] = useState('BE');
  const [cohort, setCohort] = useState(null);
  const [similaritySlug, setSimilaritySlug] = useState('');
  const [similarityResult, setSimilarityResult] = useState(null);
  const [checkingSimilarity, setCheckingSimilarity] = useState(false);

  useEffect(() => {
    codingService.listProblems().then((data) => setProblems(data.problems));
  }, []);

  useEffect(() => {
    if (tab === 'stats' && isAdmin) adminService.getStats().then((data) => setStats(data.stats));
    if (tab === 'students') adminService.listStudents(courseFilter ? { course: courseFilter } : {}).then((data) => setStudents(data.students));
    if (tab === 'events') adminService.listEvents().then((data) => setEvents(data.events));
  }, [tab, courseFilter, isAdmin]);

  useEffect(() => {
    if (tab !== 'cohort') return;
    setCohort(null);
    adminService.getCohortAnalytics(cohortCourse).then((data) => setCohort(data.analytics));
  }, [tab, cohortCourse]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.problemId || (!assignForm.studentId && !assignForm.course)) {
      toast.error('Pick a problem and either a student or a course to assign to everyone');
      return;
    }
    setAssigning(true);
    try {
      await adminService.assignProblem({
        problemId: assignForm.problemId,
        studentId: assignForm.studentId || undefined,
        course: assignForm.course || undefined,
        dueDate: assignForm.dueDate || undefined,
      });
      toast.success('Problem assigned');
      setAssignForm({ studentId: '', course: '', problemId: '', dueDate: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign problem');
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.startsAt || !eventForm.endsAt) {
      toast.error('Title, start and end date are required');
      return;
    }
    setCreatingEvent(true);
    try {
      await adminService.createEvent({ ...eventForm, bonusPoints: Number(eventForm.bonusPoints) || 0, course: eventForm.course || undefined });
      toast.success('Event created');
      setEventForm({ title: '', description: '', bonusPoints: '', course: '', startsAt: '', endsAt: '' });
      adminService.listEvents().then((data) => setEvents(data.events));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleAward = async (e) => {
    e.preventDefault();
    if (!awardForm.userId || !awardForm.amount) {
      toast.error('Pick a student and an amount');
      return;
    }
    setAwarding(true);
    try {
      await adminService.awardPoints({ ...awardForm, amount: Number(awardForm.amount) });
      toast.success('Points awarded');
      setAwardForm({ userId: '', amount: '', reason: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to award points');
    } finally {
      setAwarding(false);
    }
  };

  const handleCheckSimilarity = async () => {
    if (!similaritySlug) return;
    setCheckingSimilarity(true);
    setSimilarityResult(null);
    try {
      const data = await adminService.checkCodeSimilarity(similaritySlug);
      setSimilarityResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check similarity');
    } finally {
      setCheckingSimilarity(false);
    }
  };

  const tabs = [
    ...(isAdmin ? [{ id: 'stats', label: 'Platform Stats' }] : []),
    { id: 'students', label: 'Students' },
    { id: 'assign', label: 'Assign Problem' },
    { id: 'events', label: 'Events' },
    { id: 'cohort', label: 'Cohort Analytics' },
    { id: 'similarity', label: 'Code Similarity' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">{isAdmin ? 'Admin Panel' : 'Faculty Panel'}</h1>
        <p className="mt-1 text-ink-3">Real student progress, problem assignments, and platform events — no fabricated data.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tab === t.id ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' && isAdmin && (
        stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Students" value={stats.totalUsers} icon="user" />
              <StatCard label="Total Attempts (all modules)" value={stats.totalAttempts} icon="repeat" />
              <StatCard label="Interviews Completed" value={stats.interviewsCompleted} icon="mic" />
              <StatCard label="Coding Attempts" value={stats.codingAttempts} icon="code" />
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-ink-1">Students by Course</h3>
              <div className="mt-3 space-y-2">
                {Object.entries(stats.courseBreakdown).map(([course, count]) => (
                  <div key={course} className="flex items-center justify-between text-sm">
                    <span className="text-ink-2">{course}</span>
                    <span className="stat-figure text-ink-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-3">Loading...</p>
        )
      )}

      {tab === 'students' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCourseFilter('')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${!courseFilter ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
            >
              All
            </button>
            {COURSES.map((c) => (
              <button
                key={c}
                onClick={() => setCourseFilter(c)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${courseFilter === c ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="card overflow-hidden">
            {!students ? (
              <p className="p-6 text-sm text-ink-3">Loading...</p>
            ) : !students.length ? (
              <p className="p-6 text-sm text-ink-3">No students found.</p>
            ) : (
              <div className="divide-y divide-surface-border">
                {students.map((s) => (
                  <div key={s.userId} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm">
                    <div>
                      <p className="font-medium text-ink-1">{s.name} <span className="text-ink-3">&middot; {s.email}</span></p>
                      <p className="text-xs text-ink-3">{s.course || 'No course'} {s.branch ? `· ${s.branch}` : ''} {s.college ? `· ${s.college}` : ''}</p>
                    </div>
                    <span className="stat-figure text-ink-2">{s.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-1">Award Bonus Points</h3>
            <form onSubmit={handleAward} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <select className="input-field sm:col-span-2" value={awardForm.userId} onChange={(e) => setAwardForm((f) => ({ ...f, userId: e.target.value }))}>
                <option value="">Select student...</option>
                {students?.map((s) => <option key={s.userId} value={s.userId}>{s.name}</option>)}
              </select>
              <input className="input-field" type="number" min="1" placeholder="Points" value={awardForm.amount} onChange={(e) => setAwardForm((f) => ({ ...f, amount: e.target.value }))} />
              <button type="submit" disabled={awarding} className="btn-primary">{awarding ? 'Awarding...' : 'Award'}</button>
              <input className="input-field sm:col-span-4" placeholder="Reason (shown to the student)" value={awardForm.reason} onChange={(e) => setAwardForm((f) => ({ ...f, reason: e.target.value }))} />
            </form>
          </div>
        </div>
      )}

      {tab === 'assign' && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink-1">Assign a Coding Problem</h3>
          <form onSubmit={handleAssign} className="mt-4 space-y-3">
            <select className="input-field" value={assignForm.problemId} onChange={(e) => setAssignForm((f) => ({ ...f, problemId: e.target.value }))}>
              <option value="">Select a problem...</option>
              {problems.map((p) => <option key={p._id} value={p._id}>{p.title} ({p.difficulty})</option>)}
            </select>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select className="input-field" value={assignForm.studentId} onChange={(e) => setAssignForm((f) => ({ ...f, studentId: e.target.value, course: '' }))}>
                <option value="">Assign to everyone in a course instead...</option>
                {students?.map((s) => <option key={s.userId} value={s.userId}>{s.name}</option>)}
              </select>
              <select className="input-field" disabled={Boolean(assignForm.studentId)} value={assignForm.course} onChange={(e) => setAssignForm((f) => ({ ...f, course: e.target.value }))}>
                <option value="">— or pick a course —</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="date" className="input-field" value={assignForm.dueDate} onChange={(e) => setAssignForm((f) => ({ ...f, dueDate: e.target.value }))} />
            <button type="submit" disabled={assigning} className="btn-primary">{assigning ? 'Assigning...' : 'Assign'}</button>
          </form>
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-1">Create a Platform Event</h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <input className="input-field" placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))} />
              <textarea className="input-field min-h-[70px]" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input className="input-field" type="number" min="0" placeholder="Bonus points" value={eventForm.bonusPoints} onChange={(e) => setEventForm((f) => ({ ...f, bonusPoints: e.target.value }))} />
                <select className="input-field" value={eventForm.course} onChange={(e) => setEventForm((f) => ({ ...f, course: e.target.value }))}>
                  <option value="">All courses</option>
                  {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label-text">Starts</label>
                  <input type="datetime-local" className="input-field" value={eventForm.startsAt} onChange={(e) => setEventForm((f) => ({ ...f, startsAt: e.target.value }))} />
                </div>
                <div>
                  <label className="label-text">Ends</label>
                  <input type="datetime-local" className="input-field" value={eventForm.endsAt} onChange={(e) => setEventForm((f) => ({ ...f, endsAt: e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={creatingEvent} className="btn-primary">{creatingEvent ? 'Creating...' : 'Create Event'}</button>
            </form>
          </div>

          <div className="card overflow-hidden">
            {!events ? (
              <p className="p-6 text-sm text-ink-3">Loading...</p>
            ) : !events.length ? (
              <p className="p-6 text-sm text-ink-3">No events yet.</p>
            ) : (
              <div className="divide-y divide-surface-border">
                {events.map((ev) => (
                  <div key={ev._id} className="flex items-center justify-between gap-3 px-6 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="trophy" className="h-4 w-4 text-gold" />
                      <div>
                        <p className="text-ink-1">{ev.title} {ev.course ? `(${ev.course})` : ''}</p>
                        <p className="text-xs text-ink-3">
                          {new Date(ev.startsAt).toLocaleDateString()} &ndash; {new Date(ev.endsAt).toLocaleDateString()}
                          {ev.bonusPoints ? ` · up to ${ev.bonusPoints} pts` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'cohort' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {COURSES.map((c) => (
              <button
                key={c}
                onClick={() => setCohortCourse(c)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${cohortCourse === c ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {!cohort ? (
            <p className="text-sm text-ink-3">Loading...</p>
          ) : !cohort.studentCount ? (
            <p className="text-sm text-ink-3">No students in {cohortCourse} yet.</p>
          ) : (
            <div className="space-y-4">
              <StatCard label={`${cohortCourse} Students`} value={cohort.studentCount} icon="user" />

              {cohortCourse === 'UPSC' ? (
                <>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold text-ink-1">Weakest GS Category (Platform-Wide)</h3>
                    {cohort.weakestGsCategory ? (
                      <p className="mt-2 text-sm text-ink-2">
                        <span className="font-medium text-danger">{cohort.weakestGsCategory.category}</span> — {cohort.weakestGsCategory.accuracy}% accuracy across {cohort.weakestGsCategory.attempts} answered questions
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-ink-3">Not enough attempts yet.</p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      {cohort.gsCategoryBreakdown.map((c) => (
                        <div key={c.category} className="flex items-center justify-between text-xs">
                          <span className="text-ink-2">{c.category}</span>
                          <span className="stat-figure text-ink-3">{c.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold text-ink-1">Average Score by Stage</h3>
                    <div className="mt-3 space-y-1.5">
                      {Object.entries(cohort.stageBreakdown).map(([stage, s]) => (
                        <div key={stage} className="flex items-center justify-between text-sm">
                          <span className="text-ink-2">{stage}</span>
                          <span className="stat-figure text-ink-1">{s.avgScorePercent}% ({s.attempts} attempts)</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-3 text-sm">
                      <span className="text-ink-2">Answer Writing (avg score)</span>
                      <span className="stat-figure text-ink-1">
                        {cohort.answerWriting.avgScore !== null ? `${cohort.answerWriting.avgScore}% (${cohort.answerWriting.count} attempts)` : 'No attempts yet'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold text-ink-1">Weakest Aptitude Category (Platform-Wide)</h3>
                    {cohort.weakestAptitudeCategory ? (
                      <p className="mt-2 text-sm text-ink-2">
                        <span className="font-medium text-danger">{cohort.weakestAptitudeCategory.category}</span> — {cohort.weakestAptitudeCategory.accuracy}% accuracy across {cohort.weakestAptitudeCategory.attempts} answered questions
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-ink-3">Not enough attempts yet.</p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      {cohort.aptitudeByCategory.map((c) => (
                        <div key={c.category} className="flex items-center justify-between text-xs">
                          <span className="text-ink-2">{c.category}</span>
                          <span className="stat-figure text-ink-3">{c.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold text-ink-1">Coding Topic Coverage</h3>
                    <p className="mt-1 text-xs text-ink-3">
                      % of {cohortCourse} students who've solved at least one problem in that topic — lowest coverage first.
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {cohort.topicCoverage.map((t) => (
                        <div key={t.topic} className="flex items-center justify-between text-xs">
                          <span className="text-ink-2">{t.topic}</span>
                          <span className="stat-figure text-ink-3">{t.coveragePercent}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-surface-border pt-3 text-sm">
                      <span className="text-ink-2">Avg problems solved per student: </span>
                      <span className="stat-figure text-ink-1">{cohort.avgProblemsSolved}</span>
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold text-ink-1">Placement Drive Funnel</h3>
                    <div className="mt-3 space-y-1.5">
                      {Object.keys(cohort.driveFunnel).length ? (
                        Object.entries(cohort.driveFunnel).map(([stage, count]) => (
                          <div key={stage} className="flex items-center justify-between text-sm">
                            <span className="text-ink-2">{stage.replace(/_/g, ' ')}</span>
                            <span className="stat-figure text-ink-1">{count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-ink-3">No drives started yet.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'similarity' && (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-1">Code Similarity Check</h3>
            <p className="mt-1 text-xs text-ink-3">
              Heuristic text-similarity between students' latest submissions on a problem — a starting point for manual
              review, not proof of copying. Renamed variables or reordered code can still dodge it.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <select className="input-field flex-1" value={similaritySlug} onChange={(e) => setSimilaritySlug(e.target.value)}>
                <option value="">Select a problem...</option>
                {problems.map((p) => <option key={p._id} value={p.slug}>{p.title} ({p.difficulty})</option>)}
              </select>
              <button onClick={handleCheckSimilarity} disabled={checkingSimilarity || !similaritySlug} className="btn-primary shrink-0">
                {checkingSimilarity ? 'Checking...' : 'Check'}
              </button>
            </div>
          </div>

          {similarityResult && (
            <div className="card overflow-hidden">
              <div className="border-b border-surface-border px-6 py-3 text-sm text-ink-2">
                {similarityResult.problemTitle} &middot; {similarityResult.submissionCount} student submission{similarityResult.submissionCount === 1 ? '' : 's'}
              </div>
              {!similarityResult.pairs.length ? (
                <p className="p-6 text-sm text-ink-3">No pairs found above the similarity threshold.</p>
              ) : (
                <div className="divide-y divide-surface-border">
                  {similarityResult.pairs.map((pair, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 px-6 py-3 text-sm">
                      <span className="text-ink-1">{pair.userAName} <span className="text-ink-3">&harr;</span> {pair.userBName} <span className="text-ink-3">({pair.language})</span></span>
                      <span className={`stat-figure font-semibold ${pair.similarity >= 80 ? 'text-danger' : 'text-gold'}`}>{pair.similarity}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
