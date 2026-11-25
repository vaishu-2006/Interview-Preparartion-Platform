import StatCard from '../dashboard/StatCard';

const AptitudeStatsPanel = ({ stats }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Total Tests" value={stats.totalTests} icon="notes" />
      <StatCard label="Highest Score" value={`${stats.highestScorePercent}%`} icon="trophy" />
      <StatCard label="Average Score" value={`${stats.averageScorePercent}%`} icon="chart" />
    </div>

    {stats.recentAttempts.length > 0 && (
      <div className="card p-6">
        <h3 className="mb-3 text-sm font-semibold text-ink-1">Recent Attempts</h3>
        <ul className="space-y-2">
          {stats.recentAttempts.map((a) => (
            <li key={a.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-2">{a.category}</span>
              <span className="stat-figure text-ink-3">{a.score}/{a.totalQuestions}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default AptitudeStatsPanel;
