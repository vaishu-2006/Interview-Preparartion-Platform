import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const features = [
  { title: 'Resume Builder', desc: 'Craft an ATS-friendly resume with live preview and PDF export.' },
  { title: 'Coding Platform', desc: 'Practice DSA problems with an in-browser multi-language editor.' },
  { title: 'AI Mock Interview', desc: 'Simulate real interviews with AI-generated, resume-aware questions.' },
  { title: 'Aptitude Practice', desc: 'Sharpen numerical, logical and verbal reasoning with timed tests.' },
  { title: 'Performance Analytics', desc: 'Track your progress across every module in one dashboard.' },
  { title: 'GitHub Import', desc: 'Pull your public repositories straight into your resume projects.' },
];

const paths = [
  { name: 'B.E.', desc: 'Branch-wise preparation for Computer Science, ECE, EEE, Mechanical, Civil and more.' },
  { name: 'BCA', desc: 'Stream-wise prep covering programming, web development, DBMS and aptitude.' },
  { name: 'UPSC', desc: 'A dedicated study and practice hub for prelims, mains and interview prep.' },
];

const stats = [
  { value: '3', label: 'Preparation Paths' },
  { value: '1000+', label: 'Coding Problems (planned)' },
  { value: '4', label: 'Aptitude Categories' },
  { value: '24/7', label: 'Practice Access' },
];

const HomePage = () => (
  <div className="min-h-screen bg-bg">
    <Navbar />

    <section id="home" className="relative overflow-hidden px-6 pb-28 pt-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Built for B.E. &middot; BCA &middot; UPSC
        </span>

        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-[1.1] text-ink-1 sm:text-6xl">
          Prepare once.
          <br />
          Get placed <span className="text-brand-500">anywhere.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
          Resume building, coding practice, aptitude tests, and AI-powered mock interviews &mdash;
          unified in one platform built around your path.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register" className="btn-primary px-7 py-3 text-base">Get Started Free</Link>
          <a href="#features" className="btn-secondary px-7 py-3 text-base">Explore Features</a>
        </div>
      </div>
    </section>

    <section className="border-y border-surface-border bg-surface-card/40 px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="stat-figure text-3xl font-bold text-gold sm:text-4xl">{stat.value}</p>
            <p className="mt-1.5 text-sm text-ink-3">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-ink-1">Everything you need in one place</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink-2">
          No more juggling five different apps for placement prep.
        </p>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6 transition hover:border-brand-500/50">
              <h3 className="text-lg font-semibold text-ink-1">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="about" className="border-t border-surface-border/60 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-ink-1">Choose your preparation path</h2>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {paths.map((path) => (
            <div key={path.name} className="card p-8 text-center">
              <h3 className="text-2xl font-bold text-brand-400">{path.name}</h3>
              <p className="mt-3 text-sm text-ink-2">{path.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="px-6 py-24">
      <div className="card mx-auto max-w-4xl px-8 py-14 text-center">
        <h2 className="text-3xl font-bold text-ink-1">Ready to start preparing?</h2>
        <p className="mt-3 text-ink-2">Create your free account and pick your path in under a minute.</p>
        <Link to="/register" className="btn-primary mt-8 inline-flex px-8 py-3">Create Free Account</Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default HomePage;
