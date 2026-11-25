import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import FormInput from '../components/common/FormInput';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';
import { isValidEmail, passwordChecks } from '../utils/validators';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const checks = passwordChecks(form.password);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address';
    if (!checks.minLength || !checks.hasUppercase || !checks.hasNumber) {
      nextErrors.password = 'Password does not meet the requirements below';
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreed) nextErrors.terms = 'You must accept the Terms and Conditions';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;

    const result = await dispatch(
      registerUser({ name: form.name, email: form.email, password: form.password })
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully');
      navigate('/select-path', { replace: true });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your placement preparation journey today.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="name"
          name="name"
          label="Full Name"
          placeholder="Jane Doe"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
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
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <ul className="-mt-2 space-y-1 text-xs">
          <li className={checks.minLength ? 'text-green-400' : 'text-ink-3'}>&#8226; At least 8 characters</li>
          <li className={checks.hasUppercase ? 'text-green-400' : 'text-ink-3'}>&#8226; One uppercase letter</li>
          <li className={checks.hasNumber ? 'text-green-400' : 'text-ink-3'}>&#8226; One number</li>
        </ul>
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-surface-border bg-surface-light accent-brand-600"
          />
          I agree to the Terms and Conditions
        </label>
        {errors.terms && <p className="-mt-2 text-sm text-danger">{errors.terms}</p>}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
          {status === 'loading' ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
