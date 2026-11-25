import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import FormInput from '../components/common/FormInput';
import authService from '../services/authService';
import { isPasswordStrong } from '../utils/validators';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong(form.password)) {
      setError('Password must be at least 8 characters with an uppercase letter and a number');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      toast.success('Password reset successfully. Please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="password"
          name="password"
          type="password"
          label="New Password"
          value={form.password}
          onChange={handleChange}
        />
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={error}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
