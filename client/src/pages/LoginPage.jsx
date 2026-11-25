import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import FormInput from '../components/common/FormInput';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((state) => state.auth.status);

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Logged in successfully');
      const redirectTo = result.payload.user.hasSelectedPath ? '/dashboard' : '/select-path';
      navigate(location.state?.from?.pathname || redirectTo, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your preparation.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-surface-border bg-surface-light accent-brand-600"
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className="font-medium text-brand-400 hover:text-brand-300">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
