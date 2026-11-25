import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
    <p className="text-6xl font-bold text-brand-500">401</p>
    <h1 className="text-2xl font-bold text-ink-1">You're not authorized to view this page</h1>
    <p className="max-w-sm text-ink-2">Please log in with an account that has access to this resource.</p>
    <Link to="/login" className="btn-primary px-6 py-2.5">
      Go to Login
    </Link>
  </div>
);

export default UnauthorizedPage;
