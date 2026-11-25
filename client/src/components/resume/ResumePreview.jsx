const TEMPLATE_STYLES = {
  modern: { accent: '#1b8a6e', font: 'font-sans' },
  classic: { accent: '#1a2b4c', font: 'font-serif' },
  minimal: { accent: '#111111', font: 'font-sans' },
};

const SECTION_TITLES = {
  education: 'Education',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

const Chip = ({ children }) => (
  <span className="rounded bg-black/5 px-2 py-0.5 text-[10px] text-neutral-700">{children}</span>
);

const renderItems = (key, items) => {
  if (!items?.length) return null;

  if (key === 'skills') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((s, i) => <Chip key={i}>{s}</Chip>)}
      </div>
    );
  }
  if (key === 'languages') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((l, i) => <Chip key={i}>{l.name} ({l.proficiency})</Chip>)}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i}>
          {key === 'education' && (
            <>
              <div className="flex items-baseline justify-between">
                <strong className="text-[13px] text-neutral-900">{item.institution}</strong>
                <span className="text-[10px] text-neutral-500">{item.startDate} - {item.endDate}</span>
              </div>
              <p className="text-[11px] text-neutral-600">{item.degree}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}{item.grade ? ` · ${item.grade}` : ''}</p>
            </>
          )}
          {key === 'experience' && (
            <>
              <div className="flex items-baseline justify-between">
                <strong className="text-[13px] text-neutral-900">{item.role} · {item.company}</strong>
                <span className="text-[10px] text-neutral-500">{item.startDate} - {item.endDate}</span>
              </div>
              <p className="whitespace-pre-line text-[11px] text-neutral-600">{item.description}</p>
            </>
          )}
          {key === 'projects' && (
            <>
              <strong className="text-[13px] text-neutral-900">{item.title}</strong>
              <p className="whitespace-pre-line text-[11px] text-neutral-600">{item.description}</p>
              {item.techStack?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">{item.techStack.map((t, ti) => <Chip key={ti}>{t}</Chip>)}</div>
              )}
            </>
          )}
          {key === 'certifications' && (
            <div className="flex items-baseline justify-between">
              <strong className="text-[13px] text-neutral-900">{item.name}</strong>
              <span className="text-[10px] text-neutral-500">{item.date}</span>
            </div>
          )}
          {key === 'achievements' && (
            <>
              <div className="flex items-baseline justify-between">
                <strong className="text-[13px] text-neutral-900">{item.title}</strong>
                <span className="text-[10px] text-neutral-500">{item.date}</span>
              </div>
              <p className="text-[11px] text-neutral-600">{item.description}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const ResumePreview = ({ resume }) => {
  const style = TEMPLATE_STYLES[resume.template] || TEMPLATE_STYLES.modern;
  const pd = resume.personalDetails || {};
  const contactParts = [pd.email, pd.phone, pd.location].filter(Boolean);
  const links = [
    pd.linkedin && { label: 'LinkedIn', href: normalizeUrl(pd.linkedin) },
    pd.portfolio && { label: 'Portfolio', href: normalizeUrl(pd.portfolio) },
  ].filter(Boolean);

  return (
    <div className={`aspect-[1/1.414] w-full overflow-y-auto rounded-lg bg-white p-8 text-neutral-900 shadow-2xl ${style.font}`}>
      <h1 className="text-2xl font-bold" style={{ color: style.accent }}>{pd.fullName || 'Your Name'}</h1>
      <p className="mt-1 text-[10px] text-neutral-500">
        {contactParts.join(' · ')}
        {links.map((link, i) => (
          <span key={link.label}>
            {(contactParts.length > 0 || i > 0) ? ' · ' : ''}
            <a href={link.href} target="_blank" rel="noreferrer" className="underline" style={{ color: style.accent }}>
              {link.label}
            </a>
          </span>
        ))}
      </p>
      {pd.summary && <p className="mt-3 text-[11px] text-neutral-700">{pd.summary}</p>}

      {(resume.sectionOrder || []).map((key) => {
        const content = renderItems(key, resume[key]);
        if (!content) return null;
        return (
          <section key={key} className="mt-4">
            <h2
              className="mb-2 border-b pb-1 text-[11px] font-bold uppercase tracking-wide"
              style={{ color: style.accent, borderColor: style.accent }}
            >
              {SECTION_TITLES[key]}
            </h2>
            {content}
          </section>
        );
      })}
    </div>
  );
};

export default ResumePreview;
