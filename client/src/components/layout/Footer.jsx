const Footer = () => (
  <footer className="border-t border-surface-border/60 bg-surface">
    <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-ink-3">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p>&copy; {new Date().getFullYear()} PlacementPrep. All rights reserved.</p>
        <p>Built for BE, BCA &amp; UPSC aspirants.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
