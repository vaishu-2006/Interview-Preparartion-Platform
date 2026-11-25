import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
    <p className="text-6xl font-bold text-brand-500">404</p>
    <h1 className="text-2xl font-bold text-ink-1">Page not found</h1>
    <p className="max-w-sm text-ink-2">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary px-6 py-2.5">
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
