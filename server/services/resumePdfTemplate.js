const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const sectionTitles = {
  education: 'Education',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

const renderSection = (key, resume) => {
  const items = resume[key] || [];
  if (!items.length) return '';

  if (key === 'skills' || key === 'languages') {
    const chips = key === 'skills' ? items : items.map((l) => `${l.name} (${l.proficiency})`);
    return `<section class="section"><h2>${sectionTitles[key]}</h2><div class="chips">${chips
      .map((c) => `<span class="chip">${escapeHtml(c)}</span>`)
      .join('')}</div></section>`;
  }

  const rows = items
    .map((item) => {
      if (key === 'education') {
        return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.institution)}</strong><span>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</span></div><div class="entry-sub">${escapeHtml(item.degree)}${item.fieldOfStudy ? ', ' + escapeHtml(item.fieldOfStudy) : ''}${item.grade ? ' &middot; ' + escapeHtml(item.grade) : ''}</div></div>`;
      }
      if (key === 'experience') {
        return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.role)} &middot; ${escapeHtml(item.company)}</strong><span>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</span></div><div class="entry-desc">${escapeHtml(item.description)}</div></div>`;
      }
      if (key === 'projects') {
        return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.title)}</strong>${item.link ? `<a href="${escapeHtml(item.link)}">${escapeHtml(item.link)}</a>` : ''}</div><div class="entry-desc">${escapeHtml(item.description)}</div>${item.techStack?.length ? `<div class="chips">${item.techStack.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join('')}</div>` : ''}</div>`;
      }
      if (key === 'certifications') {
        return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.date)}</span></div><div class="entry-sub">${escapeHtml(item.issuer)}</div></div>`;
      }
      if (key === 'achievements') {
        return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.date)}</span></div><div class="entry-desc">${escapeHtml(item.description)}</div></div>`;
      }
      return '';
    })
    .join('');

  return `<section class="section"><h2>${sectionTitles[key]}</h2>${rows}</section>`;
};

const buildResumeHtml = (resume) => {
  const pd = resume.personalDetails || {};
  const accent = resume.template === 'classic' ? '#1a2b4c' : resume.template === 'minimal' ? '#111' : '#1b8a6e';
  const contactParts = [pd.email, pd.phone, pd.location].filter(Boolean).map(escapeHtml);
  const linkParts = [
    pd.linkedin && `<a href="${escapeHtml(normalizeUrl(pd.linkedin))}" target="_blank">LinkedIn</a>`,
    pd.portfolio && `<a href="${escapeHtml(normalizeUrl(pd.portfolio))}" target="_blank">Portfolio</a>`,
  ].filter(Boolean);
  const contactLine = [...contactParts, ...linkParts].join(' &middot; ');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px 48px; font-size: 11px; line-height: 1.5; }
  h1 { font-size: 24px; margin: 0 0 4px; color: ${accent}; }
  .contact { color: #555; margin-bottom: 18px; font-size: 10.5px; }
  .summary { margin-bottom: 18px; color: #333; }
  .section { margin-bottom: 16px; page-break-inside: avoid; }
  .section h2 { font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.06em; color: ${accent}; border-bottom: 1.5px solid ${accent}; padding-bottom: 3px; margin: 0 0 8px; }
  .entry { margin-bottom: 10px; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-head span { color: #666; font-size: 10px; white-space: nowrap; }
  .entry-sub { color: #555; font-size: 10.5px; margin-top: 1px; }
  .entry-desc { color: #333; margin-top: 3px; white-space: pre-line; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .chip { background: #f0f0f0; border-radius: 4px; padding: 2px 8px; font-size: 10px; color: #333; }
  a { color: ${accent}; text-decoration: none; font-size: 10px; }
</style>
</head>
<body>
  <h1>${escapeHtml(pd.fullName || 'Your Name')}</h1>
  <div class="contact">${contactLine}</div>
  ${pd.summary ? `<div class="summary">${escapeHtml(pd.summary)}</div>` : ''}
  ${(resume.sectionOrder || []).map((key) => renderSection(key, resume)).join('')}
</body>
</html>`;
};

module.exports = { buildResumeHtml };
