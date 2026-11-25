import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import subjectService from '../services/subjectService';
import LoadingScreen from '../components/common/LoadingScreen';
import AptitudeQuiz from '../components/aptitude/AptitudeQuiz';
import AptitudeResults from '../components/aptitude/AptitudeResults';
import RulesGate from '../components/proctoring/RulesGate';
import Icon from '../components/icons/Icon';

const SUBJECT_ICONS = {
  'Operating Systems': 'cpu',
  DBMS: 'database',
  'Computer Networks': 'globe',
  'Programming Fundamentals': 'code',
  'Web Development': 'globe',
  SQL: 'database',
};

const SUBJECT_RULES = [
  'This is a timed test — the clock keeps running once you start.',
  'Do not switch tabs or windows during the test.',
  'Do not copy questions or paste answers.',
  'Right-click and developer tools are disabled during the test.',
  '3 warnings auto-submits your test.',
];

const SubjectPrepPage = () => {
  const course = useSelector((state) => state.dashboard.data?.course);
  const [subjects, setSubjects] = useState(null);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('home'); // home | rules | quiz | results
  const [pendingSubject, setPendingSubject] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!course) return;
    Promise.all([subjectService.getSubjects(course), subjectService.getStats(course)]).then(([subjectsData, statsData]) => {
      setSubjects(subjectsData.subjects);
      setStats(statsData.stats);
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const startQuiz = async (subj) => {
    try {
      const data = await subjectService.getQuiz(course, subj, 10);
      if (!data.questions.length) {
        toast.error('No questions available for this subject yet');
        setView('home');
        return;
      }
      setSubject(subj);
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
      const data = await subjectService.submitAttempt({ course, subject, answers, timeTakenSeconds, confidenceScore });
      setResult(data);
      setView('results');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attempt');
    } finally {
      setSubmitting(false);
    }
  };

  if (!subjects || !stats) return <LoadingScreen label="Loading subject prep..." />;

  if (view === 'rules') {
    return <RulesGate title={`${pendingSubject} Quiz`} rules={SUBJECT_RULES} requiresWebcam onStart={() => startQuiz(pendingSubject)} />;
  }

  if (view === 'quiz') {
    return <AptitudeQuiz category={subject} questions={questions} onSubmit={handleSubmit} submitting={submitting} />;
  }

  if (view === 'results' && result) {
    return (
      <AptitudeResults
        result={result}
        categoryLabel={subject}
        onRetry={() => {
          setPendingSubject(subject);
          setView('rules');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  const performanceBySubject = Object.fromEntries(stats.subjectPerformance.map((s) => [s.subject, s]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">{course === 'BCA' ? 'Programming & Web Dev' : 'Subject Prep'}</h1>
        <p className="mt-1 text-ink-3">
          {course === 'BCA'
            ? 'Practice core programming, web development, and SQL concepts.'
            : 'Core CS subjects — Operating Systems, DBMS, and Computer Networks.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {subjects.map((subj) => {
          const perf = performanceBySubject[subj];
          return (
            <button
              key={subj}
              onClick={() => {
                setPendingSubject(subj);
                setView('rules');
              }}
              className="card flex flex-col gap-3 p-6 text-left transition hover:border-brand-500/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
                <Icon name={SUBJECT_ICONS[subj] || 'book'} className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-1">{subj}</h3>
                <p className="mt-1 text-sm text-ink-3">
                  {perf?.attempts ? `${perf.attempts} attempts · avg ${perf.averageScorePercent}%` : 'Not attempted yet'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectPrepPage;
