import { useState } from 'react';
import toast from 'react-hot-toast';
import resumeService from '../../services/resumeService';
import FormInput from '../common/FormInput';

const GithubImportModal = ({ onClose, onImported }) => {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchRepos = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setRepos([]);
    try {
      const data = await resumeService.getGithubRepos(username.trim());
      setRepos(data.repos);
      if (!data.repos.length) toast('No public repositories found', { icon: 'ℹ️' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (repo) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[repo.name]) delete next[repo.name];
      else next[repo.name] = repo;
      return next;
    });
  };

  const handleImport = async () => {
    const chosen = Object.values(selected);
    if (!chosen.length) return;
    setImporting(true);
    try {
      await resumeService.importGithubRepos(chosen);
      toast.success(`Imported ${chosen.length} repositor${chosen.length > 1 ? 'ies' : 'y'} into Projects`);
      onImported();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="card max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-1">Import from GitHub</h2>
          <button onClick={onClose} className="text-ink-3 hover:text-ink-1" aria-label="Close">✕</button>
        </div>

        <form onSubmit={fetchRepos} className="flex gap-2">
          <FormInput
            className="flex-1"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary px-4">
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>

        {repos.length > 0 && (
          <>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {repos.map((repo) => (
                <label
                  key={repo.name}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border bg-surface p-3 hover:border-brand-500/40"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand-600"
                    checked={Boolean(selected[repo.name])}
                    onChange={() => toggleSelect(repo)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink-1">{repo.name}</span>
                      <span className="text-xs text-ink-3">⭐ {repo.stars} · 🍴 {repo.forks}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-2">{repo.description || 'No description'}</p>
                    {repo.language && <span className="mt-1 inline-block text-xs text-brand-400">{repo.language}</span>}
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleImport}
              disabled={!Object.keys(selected).length || importing}
              className="btn-primary mt-4 w-full"
            >
              {importing ? 'Importing...' : `Import ${Object.keys(selected).length || ''} Selected`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GithubImportModal;
