import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import aptitudeService from '../services/aptitudeService';
import LoadingScreen from '../components/common/LoadingScreen';
import CategoryCard from '../components/aptitude/CategoryCard';
import AptitudeQuiz from '../components/aptitude/AptitudeQuiz';
import AptitudeResults from '../components/aptitude/AptitudeResults';
import AptitudeStatsPanel from '../components/aptitude/AptitudeStatsPanel';
import RulesGate from '../components/proctoring/RulesGate';

const CATEGORIES = ['Numerical', 'Logical', 'Verbal', 'Non-Verbal'];
const APTITUDE_RULES = [
  'This is a timed test — the clock keeps running once you start.',
  'Do not switch tabs or windows during the test.',
  'Do not copy questions or paste answers.',
  'Right-click and developer tools are disabled during the test.',
  '3 warnings auto-submits your test.',
];

const AptitudePage = () => {
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'rules' | 'quiz' | 'results'
  const [pendingCategory, setPendingCategory] = useState(null);
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadStats = () => aptitudeService.getStats().then((data) => setStats(data.stats));

  useEffect(() => {
    loadStats();
  }, []);

  const startQuiz = async (cat) => {
    try {
      const data = await aptitudeService.getQuiz(cat, 10);
      if (!data.questions.length) {
        toast.error('No questions available for this category yet');
        return;
      }
      setCategory(cat);
      setQuestions(data.questions);
      setView('quiz');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load quiz');
      setView('home');
    }
  };

  const handleSubmit = async (answers, timeTakenSeconds, confidenceScore) => {
    setSubmitting(true);
    try {
      const data = await aptitudeService.submitAttempt({ category, answers, timeTakenSeconds, confidenceScore });
      setResult(data);
      setView('results');
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attempt');
    } finally {
      setSubmitting(false);
    }
  };

  if (!stats) return <LoadingScreen label="Loading aptitude practice..." />;

  if (view === 'rules') {
    return (
      <RulesGate
        title={`${pendingCategory} Aptitude Test`}
        rules={APTITUDE_RULES}
        requiresWebcam
        onStart={() => startQuiz(pendingCategory)}
      />
    );
  }

  if (view === 'quiz') {
    return <AptitudeQuiz category={category} questions={questions} onSubmit={handleSubmit} submitting={submitting} />;
  }

  if (view === 'results' && result) {
    return (
      <AptitudeResults
        result={result}
        categoryLabel={category}
        onRetry={() => {
          setPendingCategory(category);
          setView('rules');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  const performanceByCategory = Object.fromEntries(stats.categoryPerformance.map((c) => [c.category, c]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Aptitude Practice</h1>
        <p className="mt-1 text-ink-3">Sharpen your numerical, logical, verbal and non-verbal reasoning.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            performance={performanceByCategory[cat]}
            onClick={() => {
              setPendingCategory(cat);
              setView('rules');
            }}
          />
        ))}
      </div>

      <AptitudeStatsPanel stats={stats} />
    </div>
  );
};

export default AptitudePage;
