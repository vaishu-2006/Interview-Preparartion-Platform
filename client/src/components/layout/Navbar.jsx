import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
];

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-surface/80 backdrop-blur-md">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <Link to="/" className="text-lg font-bold tracking-tight text-ink-1">
        Placement<span className="text-brand-500">Prep</span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="text-sm text-ink-2 transition hover:text-ink-1">
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium text-ink-2 transition hover:text-ink-1">
          Login
        </Link>
        <Link to="/register" className="btn-primary px-4 py-2 text-sm">
          Register
        </Link>
      </div>
    </nav>
  </header>
);

export default Navbar;
