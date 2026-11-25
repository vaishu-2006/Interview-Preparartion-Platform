import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import flashcardService from '../services/flashcardService';
import StatCard from '../components/dashboard/StatCard';
import Icon from '../components/icons/Icon';

const GRADE_BUTTONS = [
  { quality: 1, label: 'Again', className: 'border-danger/40 text-danger hover:bg-danger/10' },
  { quality: 3, label: 'Hard', className: 'border-gold/40 text-gold hover:bg-gold/10' },
  { quality: 4, label: 'Good', className: 'border-brand-500/40 text-brand-400 hover:bg-brand-600/10' },
  { quality: 5, label: 'Easy', className: 'border-brand-500 text-brand-400 hover:bg-brand-600/10' },
];

const ReviewMode = ({ onFinishedReviewing }) => {
  const [queue, setQueue] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    flashcardService.getDueCards().then((data) => setQueue(data.cards));
  }, []);

  const current = queue?.[0];

  const handleGrade = async (quality) => {
    if (!current) return;
    setGrading(true);
    try {
      await flashcardService.reviewCard(current._id, quality);
      setQueue((q) => q.slice(1));
      setRevealed(false);
      onFinishedReviewing();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save review');
    } finally {
      setGrading(false);
    }
  };

  if (queue === null) return <p className="text-sm text-ink-3">Loading due cards...</p>;

  if (!queue.length) {
    return (
      <div className="card p-10 text-center">
        <Icon name="checkCircle" className="mx-auto h-8 w-8 text-brand-500" />
        <p className="mt-3 font-medium text-ink-1">All caught up!</p>
        <p className="mt-1 text-sm text-ink-3">No cards due for review right now — check back later or add new ones.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <p className="text-center text-xs text-ink-3">{queue.length} card{queue.length === 1 ? '' : 's'} left in this session</p>
      <div className="card min-h-[220px] p-8 text-center">
        {current.category && <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-brand-400">{current.category}</p>}
        <p className="text-lg font-medium text-ink-1">{current.front}</p>
        {revealed && (
          <div className="mt-5 border-t border-surface-border pt-5">
            <p className="text-ink-2">{current.back}</p>
          </div>
        )}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="btn-primary w-full">Show Answer</button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_BUTTONS.map((g) => (
            <button
              key={g.quality}
              onClick={() => handleGrade(g.quality)}
              disabled={grading}
              className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition disabled:opacity-50 ${g.className}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ManageMode = ({ onCardsChanged }) => {
  const [cards, setCards] = useState(null);
  const [form, setForm] = useState({ front: '', back: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const refresh = () => flashcardService.listCards().then((data) => setCards(data.cards));

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.front.trim() || !form.back.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await flashcardService.updateCard(editingId, form);
        toast.success('Card updated');
      } else {
        await flashcardService.createCard(form);
        toast.success('Card added');
      }
      setForm({ front: '', back: '', category: '' });
      setEditingId(null);
      await refresh();
      onCardsChanged();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save card');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (card) => {
    setEditingId(card._id);
    setForm({ front: card.front, back: card.back, category: card.category });
  };

  const handleDelete = async (id) => {
    try {
      await flashcardService.deleteCard(id);
      await refresh();
      onCardsChanged();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete card');
    }
  };

  const categories = [...new Set((cards || []).map((c) => c.category).filter(Boolean))];
  const filtered = categoryFilter ? (cards || []).filter((c) => c.category === categoryFilter) : cards;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card space-y-3 p-6">
        <h3 className="text-sm font-semibold text-ink-1">{editingId ? 'Edit Card' : 'Add a Flashcard'}</h3>
        <input
          className="input-field"
          placeholder="Front (question / prompt)"
          value={form.front}
          onChange={(e) => setForm((f) => ({ ...f, front: e.target.value }))}
        />
        <textarea
          className="input-field min-h-[70px]"
          placeholder="Back (answer)"
          value={form.back}
          onChange={(e) => setForm((f) => ({ ...f, back: e.target.value }))}
        />
        <input
          className="input-field"
          placeholder="Category (optional — e.g. Polity, DBMS, Current Affairs)"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <div className="flex gap-2">
          <button type="submit" disabled={saving || !form.front.trim() || !form.back.trim()} className="btn-primary">
            {saving ? 'Saving...' : editingId ? 'Update Card' : 'Add Card'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ front: '', back: '', category: '' });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${!categoryFilter ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${categoryFilter === c ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="card overflow-hidden">
        {!filtered ? (
          <p className="p-6 text-sm text-ink-3">Loading...</p>
        ) : !filtered.length ? (
          <p className="p-6 text-sm text-ink-3">No flashcards yet — add your first one above.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {filtered.map((card) => (
              <div key={card._id} className="flex items-start justify-between gap-3 px-6 py-4">
                <div>
                  {card.category && <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-400">{card.category}</span>}
                  <p className="mt-0.5 text-sm font-medium text-ink-1">{card.front}</p>
                  <p className="mt-1 text-sm text-ink-3">{card.back}</p>
                  <p className="mt-1.5 text-[11px] text-ink-3">
                    Due {new Date(card.dueDate).toLocaleDateString()} &middot; reviewed {card.repetitions} time{card.repetitions === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => handleEdit(card)} className="text-xs font-medium text-brand-400 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(card._id)} className="text-xs font-medium text-danger hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FlashcardsPage = () => {
  const [tab, setTab] = useState('review');
  const [stats, setStats] = useState(null);

  const refreshStats = () => flashcardService.getStats().then((data) => setStats(data.stats));

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Flashcards</h1>
        <p className="mt-1 text-ink-3">
          Real spaced repetition (the SM-2 algorithm behind Anki) — cards you write yourself, scheduled to resurface right
          before you'd forget them.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Cards" value={stats.total} icon="layers" />
          <StatCard label="Due Now" value={stats.due} icon="calendar" />
          <StatCard label="Reviewed Today" value={stats.reviewedToday} icon="checkCircle" />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setTab('review')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === 'review' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'}`}
        >
          Review
        </button>
        <button
          onClick={() => setTab('manage')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === 'manage' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'}`}
        >
          My Cards
        </button>
      </div>

      {tab === 'review' ? <ReviewMode onFinishedReviewing={refreshStats} /> : <ManageMode onCardsChanged={refreshStats} />}
    </div>
  );
};

export default FlashcardsPage;
