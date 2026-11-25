import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import historyService from '../services/historyService';
import LoadingScreen from '../components/common/LoadingScreen';
import ChartCard from '../components/performance/ChartCard';
import AiPracticeModal from '../components/common/AiPracticeModal';
import Icon from '../components/icons/Icon';

const ACCENT = '#2f9e82';
const GOLD = '#c9973f';
const DANGER = '#e06666';

const axisProps = { stroke: 'rgb(var(--text-3))', fontSize: 11 };
const tooltipStyle = { background: 'rgb(var(--surface-2))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 };

const STATUS_COLORS = { Accepted: ACCENT, 'Wrong Answer': DANGER, 'Runtime Error': DANGER, 'Compilation Error': DANGER, pending: GOLD, completed: ACCENT };

const PerformancePage = () => {
  const [overview, setOverview] = useState(null);
  const [entries, setEntries] = useState([]);
  const [practiceTopic, setPracticeTopic] = useState(null);

  useEffect(() => {
    historyService.getPerformance().then((data) => setOverview(data.overview));
    historyService.getHistory().then((data) => setEntries(data.entries));
  }, []);

  if (!overview) return <LoadingScreen label="Loading performance data..." />;

  const isUpsc = overview.course === 'UPSC';
  const interviewData = isUpsc ? [] : Object.entries(overview.interviewByStatus).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Performance</h1>
        <p className="mt-1 text-ink-3">
          {isUpsc ? 'Your progress across mock tests and answer writing practice.' : 'Your progress across coding, aptitude, and interviews.'}
        </p>
      </div>

      {overview.weakAreas?.length > 0 && (
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-1">
            <Icon name="trendingUp" className="h-4 w-4 text-brand-500" />
            What to Work On Next
          </h2>
          <ul className="mt-3 space-y-2">
            {overview.weakAreas.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                {s}
              </li>
            ))}
          </ul>
          {overview.weakTopic && (
            <button onClick={() => setPracticeTopic(overview.weakTopic)} className="btn-secondary mt-4 text-sm">
              Generate AI Practice Questions — {overview.weakTopic}
            </button>
          )}
        </div>
      )}

      {practiceTopic && <AiPracticeModal topic={practiceTopic} onClose={() => setPracticeTopic(null)} />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isUpsc ? (
          <>
            <ChartCard title="Mock Test Progress (score %)" empty={!overview.upscProgress.length}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview.upscProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="date" tick={axisProps} hide={overview.upscProgress.length > 8} />
                  <YAxis domain={[0, 100]} tick={axisProps} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="scorePercent" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Answer Writing Score Progress" empty={!overview.answerWritingProgress.length}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview.answerWritingProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="date" tick={axisProps} hide={overview.answerWritingProgress.length > 8} />
                  <YAxis domain={[0, 100]} tick={axisProps} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="score" stroke={ACCENT} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        ) : (
          <>
            <ChartCard title="Coding Progress (problems solved)" empty={!overview.codingProgress.length}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview.codingProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="date" tick={axisProps} hide={overview.codingProgress.length > 8} />
                  <YAxis allowDecimals={false} tick={axisProps} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="solvedCount" stroke={ACCENT} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Aptitude Progress (score %)" empty={!overview.aptitudeProgress.length}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview.aptitudeProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="date" tick={axisProps} hide={overview.aptitudeProgress.length > 8} />
                  <YAxis domain={[0, 100]} tick={axisProps} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="scorePercent" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Interview Attempts by Status" empty={interviewData.every((d) => d.count === 0)}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="status" tick={axisProps} />
                  <YAxis allowDecimals={false} tick={axisProps} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {interviewData.map((d) => (
                      <Cell key={d.status} fill={STATUS_COLORS[d.status] || ACCENT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        <ChartCard title="Overall Activity (last 14 days)" empty={!overview.overallActivity.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview.overallActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="date" tick={axisProps} hide />
              <YAxis allowDecimals={false} tick={axisProps} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card overflow-hidden">
        <h2 className="p-6 pb-0 text-lg font-semibold text-ink-1">History</h2>
        {entries.length === 0 ? (
          <p className="p-6 text-sm text-ink-3">No activity yet. Start practicing to build your history.</p>
        ) : (
          <div className="mt-4 divide-y divide-surface-border">
            {entries.map((e, idx) => {
              const Wrapper = e.sessionId ? Link : 'div';
              const wrapperProps = e.sessionId
                ? { to: `/mock-interview/report/${e.sessionId}`, className: 'flex items-center justify-between px-6 py-3 text-sm transition hover:bg-surface-card' }
                : { className: 'flex items-center justify-between px-6 py-3 text-sm' };
              return (
                <Wrapper key={idx} {...wrapperProps}>
                  <div>
                    <span className="rounded bg-surface px-2 py-0.5 text-[11px] text-ink-3">{e.type}</span>
                    <span className="ml-2 text-ink-1">{e.label}</span>
                    {e.detail && <span className="ml-2 text-ink-3">· {e.detail}</span>}
                    {e.sessionId && <span className="ml-2 text-brand-400">View report &rarr;</span>}
                  </div>
                  <div className="flex items-center gap-3 text-ink-3">
                    <span>{e.status}</span>
                    <span>{new Date(e.date).toLocaleDateString()}</span>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
