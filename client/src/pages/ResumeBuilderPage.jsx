import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import resumeService from '../services/resumeService';
import LoadingScreen from '../components/common/LoadingScreen';
import FormInput from '../components/common/FormInput';
import ListSection from '../components/resume/ListSection';
import SectionOrderControl from '../components/resume/SectionOrderControl';
import ResumePreview from '../components/resume/ResumePreview';
import GithubImportModal from '../components/resume/GithubImportModal';

const TEMPLATES = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
];

const ResumeBuilderPage = () => {
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  const load = () => resumeService.getResume().then((data) => setResume(data.resume));

  useEffect(() => {
    load();
  }, []);

  const updateField = (key, value) => setResume((prev) => ({ ...prev, [key]: value }));
  const updatePersonal = (key, value) =>
    setResume((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await resumeService.updateResume(resume);
      setResume(data.resume);
      toast.success('Resume saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await resumeService.exportPdf();
    } catch (err) {
      toast.error('Failed to export PDF. Save your resume first.');
    } finally {
      setExporting(false);
    }
  };

  if (!resume) return <LoadingScreen label="Loading your resume..." />;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-1">Resume Builder</h1>
            <p className="mt-1 text-sm text-ink-3">Build your resume, then export it as a polished PDF.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowGithubModal(true)} className="btn-secondary text-sm">
              Import from GitHub
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-secondary text-sm">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleExportPdf} disabled={exporting} className="btn-primary text-sm">
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-3 text-lg font-semibold text-ink-1">Template</h2>
          <div className="flex gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => updateField('template', t.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  resume.template === t.id
                    ? 'border-brand-500 bg-brand-600/10 text-brand-400'
                    : 'border-surface-border text-ink-2 hover:border-brand-500/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink-1">Personal Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput id="fullName" label="Full Name" value={resume.personalDetails.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
            <FormInput id="personalEmail" label="Email" value={resume.personalDetails.email} onChange={(e) => updatePersonal('email', e.target.value)} />
            <FormInput id="phone" label="Phone" value={resume.personalDetails.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
            <FormInput id="location" label="Location" value={resume.personalDetails.location} onChange={(e) => updatePersonal('location', e.target.value)} />
            <FormInput id="linkedin" label="LinkedIn" value={resume.personalDetails.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
            <FormInput id="portfolio" label="Portfolio" value={resume.personalDetails.portfolio} onChange={(e) => updatePersonal('portfolio', e.target.value)} />
          </div>
          <div>
            <label className="label-text" htmlFor="summary">Professional Summary</label>
            <textarea
              id="summary"
              className="input-field min-h-[90px] resize-y"
              value={resume.personalDetails.summary}
              onChange={(e) => updatePersonal('summary', e.target.value)}
            />
          </div>
        </div>

        <div className="card p-6">
          <FormInput
            id="skills"
            label="Skills (comma separated)"
            value={resume.skills.join(', ')}
            onChange={(e) => updateField('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <ListSection
          title="Education"
          icon="graduationCap"
          items={resume.education}
          onChange={(v) => updateField('education', v)}
          renderSummary={(i) => i.institution && `${i.institution} — ${i.degree}`}
          fields={[
            { key: 'institution', label: 'Institution' },
            { key: 'degree', label: 'Degree' },
            { key: 'fieldOfStudy', label: 'Field of Study' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'grade', label: 'Grade' },
          ]}
        />

        <ListSection
          title="Experience"
          icon="briefcase"
          items={resume.experience}
          onChange={(v) => updateField('experience', v)}
          renderSummary={(i) => i.company && `${i.role} — ${i.company}`}
          fields={[
            { key: 'company', label: 'Company' },
            { key: 'role', label: 'Role' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
        />

        <ListSection
          title="Projects"
          icon="code"
          items={resume.projects}
          onChange={(v) => updateField('projects', v)}
          renderSummary={(i) => i.title}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'techStack', label: 'Tech Stack', type: 'tags' },
            { key: 'link', label: 'Live Link' },
            { key: 'githubUrl', label: 'GitHub URL' },
          ]}
        />

        <ListSection
          title="Certifications"
          icon="document"
          items={resume.certifications}
          onChange={(v) => updateField('certifications', v)}
          renderSummary={(i) => i.name}
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'issuer', label: 'Issuer' },
            { key: 'date', label: 'Date' },
            { key: 'link', label: 'Link' },
          ]}
        />

        <ListSection
          title="Achievements"
          icon="trophy"
          items={resume.achievements}
          onChange={(v) => updateField('achievements', v)}
          renderSummary={(i) => i.title}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'date', label: 'Date' },
          ]}
        />

        <ListSection
          title="Languages"
          icon="globe"
          items={resume.languages}
          onChange={(v) => updateField('languages', v)}
          renderSummary={(i) => i.name}
          fields={[
            { key: 'name', label: 'Language' },
            { key: 'proficiency', label: 'Proficiency', type: 'select', options: ['Basic', 'Intermediate', 'Fluent', 'Native'] },
          ]}
        />

        <SectionOrderControl order={resume.sectionOrder} onChange={(v) => updateField('sectionOrder', v)} />

        <div className="card space-y-3 p-6">
          <h2 className="text-lg font-semibold text-ink-1">Declaration</h2>
          <label className="sr-only" htmlFor="declarationText">Declaration Text</label>
          <textarea
            id="declarationText"
            className="input-field min-h-[70px] resize-y"
            value={resume.declaration.text}
            onChange={(e) => updateField('declaration', { ...resume.declaration, text: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput id="declarationPlace" label="Place" value={resume.declaration.place} onChange={(e) => updateField('declaration', { ...resume.declaration, place: e.target.value })} />
            <FormInput id="declarationDate" label="Date" value={resume.declaration.date} onChange={(e) => updateField('declaration', { ...resume.declaration, date: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-sm font-medium text-ink-2">Live Preview</p>
        <ResumePreview resume={resume} />
      </div>

      {showGithubModal && (
        <GithubImportModal
          onClose={() => setShowGithubModal(false)}
          onImported={() => {
            setShowGithubModal(false);
            load();
          }}
        />
      )}
    </div>
  );
};

export default ResumeBuilderPage;
