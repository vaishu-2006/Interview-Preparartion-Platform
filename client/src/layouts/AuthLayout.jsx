import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
    <div className="w-full max-w-md">
      <Link to="/" className="mb-8 block text-center text-xl font-bold text-ink-1">
        Placement<span className="text-brand-500">Prep</span>
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-ink-1">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
