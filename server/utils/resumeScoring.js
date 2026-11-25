// Five simple presence checks used as a resume-completeness heuristic. Shared between the
// dashboard's progress percentage and the Placement Drive's resume-screening score so the
// two never silently disagree on what "a complete resume" means.
const CHECKS = [
  { key: 'summary', label: 'Add a professional summary', test: (r) => Boolean(r.personalDetails?.summary) },
  { key: 'fullName', label: 'Add your full name', test: (r) => Boolean(r.personalDetails?.fullName) },
  { key: 'education', label: 'Add at least one education entry', test: (r) => r.education?.length > 0 },
  { key: 'skills', label: 'Add at least one skill', test: (r) => r.skills?.length > 0 },
  {
    key: 'projectsOrExperience',
    label: 'Add at least one project or work experience entry',
    test: (r) => r.projects?.length > 0 || r.experience?.length > 0,
  },
];

const resumeCompleteness = (resume) => {
  if (!resume) return 0;
  const passed = CHECKS.filter((c) => c.test(resume)).length;
  return Math.round((passed / CHECKS.length) * 100);
};

const resumeCompletenessFeedback = (resume) => {
  if (!resume) return ['Create a resume in the Resume Builder before running screening.'];
  const missing = CHECKS.filter((c) => !c.test(resume)).map((c) => c.label);
  return missing.length ? missing : ['Resume looks complete — consider tightening wording for impact.'];
};

// Same intent as CHECKS above, but for a raw text extraction of an uploaded PDF resume
// (no structured fields to inspect) — keyword/pattern presence checks instead.
const TEXT_CHECKS = [
  {
    key: 'contact',
    label: 'Add contact details (email or phone number)',
    test: (t) => /[\w.+-]+@[\w-]+\.[\w.-]+/.test(t) || /\d{10}/.test(t),
  },
  {
    key: 'education',
    label: 'Add an education section',
    test: (t) => /education|degree|b\.?\s?e\b|b\.?\s?tech|bca|university|college/i.test(t),
  },
  { key: 'skills', label: 'Add a skills section', test: (t) => /skills|technologies|proficient/i.test(t) },
  {
    key: 'projectsOrExperience',
    label: 'Add at least one project or work experience entry',
    test: (t) => /project|experience|internship/i.test(t),
  },
  { key: 'length', label: 'Add more detail — this looks too short for a full resume', test: (t) => t.trim().length > 300 },
];

const resumeCompletenessFromText = (text) => {
  if (!text?.trim()) return 0;
  const passed = TEXT_CHECKS.filter((c) => c.test(text)).length;
  return Math.round((passed / TEXT_CHECKS.length) * 100);
};

const resumeCompletenessFeedbackFromText = (text) => {
  if (!text?.trim()) return ['Could not read any text from the uploaded file.'];
  const missing = TEXT_CHECKS.filter((c) => !c.test(text)).map((c) => c.label);
  return missing.length ? missing : ['Resume looks complete — consider tightening wording for impact.'];
};

// ---- Job description keyword matching (used by the ATS Checker's "check against a JD" mode) ----
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'are', 'will', 'have', 'has', 'that', 'this', 'from', 'our',
  'their', 'a', 'an', 'of', 'to', 'in', 'on', 'as', 'be', 'is', 'or', 'we', 'it', 'at', 'by', 'job', 'role',
  'team', 'work', 'years', 'year', 'experience', 'skills', 'requirements', 'responsibilities', 'about',
  'looking', 'strong', 'ability', 'including', 'etc', 'must', 'plus', 'preferred', 'who', 'what', 'can',
]);

const extractKeywords = (text) => {
  const words = (text || '').toLowerCase().match(/[a-z][a-z0-9+.#/-]{1,}/g) || [];
  const freq = new Map();
  words.forEach((raw) => {
    const clean = raw.replace(/^[-./]+|[-./]+$/g, '');
    if (clean.length < 3 || STOPWORDS.has(clean)) return;
    freq.set(clean, (freq.get(clean) || 0) + 1);
  });
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
};

// Flattens a structured platform resume into plain text for keyword matching — same fields
// a recruiter's ATS would actually index.
const flattenResumeToText = (resume) => {
  if (!resume) return '';
  const parts = [
    resume.personalDetails?.summary,
    (resume.skills || []).join(' '),
    ...(resume.education || []).map((e) => `${e.degree} ${e.fieldOfStudy}`),
    ...(resume.projects || []).map((p) => `${p.title} ${p.description} ${(p.techStack || []).join(' ')}`),
    ...(resume.experience || []).map((e) => `${e.role} ${e.company} ${e.description}`),
    ...(resume.certifications || []).map((c) => c.name),
  ];
  return parts.filter(Boolean).join(' ');
};

// Simple keyword-overlap heuristic, not a semantic match — real ATS systems mostly work this
// way too (literal keyword presence), so it's a reasonable stand-in without an AI key.
const matchAgainstJobDescription = (resumeText, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription).slice(0, 40);
  if (!jdKeywords.length) return { matchPercent: 0, matchedKeywords: [], missingKeywords: [] };
  const resumeLower = (resumeText || '').toLowerCase();
  const matched = jdKeywords.filter((k) => resumeLower.includes(k));
  const missing = jdKeywords.filter((k) => !resumeLower.includes(k));
  return {
    matchPercent: Math.round((matched.length / jdKeywords.length) * 100),
    matchedKeywords: matched.slice(0, 15),
    missingKeywords: missing.slice(0, 12),
  };
};

module.exports = {
  resumeCompleteness,
  resumeCompletenessFeedback,
  resumeCompletenessFromText,
  resumeCompletenessFeedbackFromText,
  flattenResumeToText,
  matchAgainstJobDescription,
};
