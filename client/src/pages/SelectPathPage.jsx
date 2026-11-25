import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import dashboardService from '../services/dashboardService';
import { updateStoredUser } from '../redux/slices/authSlice';

const COURSES = [
  { id: 'BE', title: 'B.E.', desc: 'Branch-wise engineering preparation.' },
  { id: 'BCA', title: 'BCA', desc: 'Stream-wise computer applications preparation.' },
  { id: 'UPSC', title: 'UPSC', desc: 'Civil services study and practice hub.' },
];

const SelectPathPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState('course'); // 'course' | 'branch'
  const [course, setCourse] = useState(null);
  const [branches, setBranches] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dashboardService.getBranchOptions().then((data) => setBranches(data.branches));
  }, []);

  const handleSelectCourse = async (selected) => {
    setSaving(true);
    try {
      await dashboardService.saveCourse(selected);
      setCourse(selected);
      if (selected === 'UPSC') {
        dispatch(updateStoredUser({ hasSelectedPath: true }));
        toast.success('Path saved. Welcome to your dashboard!');
        navigate('/dashboard', { replace: true });
      } else {
        setStep('branch');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectBranch = async (branch) => {
    setSaving(true);
    try {
      await dashboardService.saveBranch(branch);
      dispatch(updateStoredUser({ hasSelectedPath: true }));
      toast.success('Branch saved. Welcome to your dashboard!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  };

  const branchOptions = course ? branches[course] || [] : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-ink-1">
          {step === 'course' ? 'Select Your Preparation Path' : `Select Your ${course} Branch`}
        </h1>
        <p className="mt-2 text-ink-2">
          {step === 'course'
            ? 'Choose the path that matches your goals. You can update this later from your profile.'
            : 'Pick your branch so we can tailor your preparation content.'}
        </p>

        {step === 'course' ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {COURSES.map((c) => (
              <button
                key={c.id}
                disabled={saving}
                onClick={() => handleSelectCourse(c.id)}
                className="card group flex flex-col items-center gap-3 p-8 text-center transition hover:border-brand-500 disabled:opacity-50"
              >
                <span className="text-2xl font-bold text-ink-1 group-hover:text-brand-400">{c.title}</span>
                <span className="text-sm text-ink-2">{c.desc}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {branchOptions.map((branch) => (
                <button
                  key={branch}
                  disabled={saving}
                  onClick={() => handleSelectBranch(branch)}
                  className="card p-5 text-sm font-medium text-ink-1 transition hover:border-brand-500 hover:text-ink-1 disabled:opacity-50"
                >
                  {branch}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('course')}
              className="mt-8 text-sm text-ink-3 hover:text-ink-2"
            >
              &larr; Back to path selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPathPage;
