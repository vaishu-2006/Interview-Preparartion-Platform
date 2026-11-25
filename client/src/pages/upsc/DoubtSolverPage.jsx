import { useState } from 'react';
import toast from 'react-hot-toast';
import upscService from '../../services/upscService';
import Icon from '../../components/icons/Icon';

const DoubtSolverPage = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setAsking(true);
    try {
      const data = await upscService.askDoubt(q);
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer, generatedByAI: data.generatedByAI }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get an answer');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-ink-1">AI Doubt Solver</h1>
        <p className="mt-1 text-ink-3">Ask anything — current affairs, static GK, or exam strategy.</p>
      </div>

      <div className="card flex-1 space-y-4 overflow-y-auto p-6">
        {!messages.length && (
          <div className="flex h-full flex-col items-center justify-center text-center text-ink-3">
            <Icon name="helpCircle" className="h-8 w-8" />
            <p className="mt-2 text-sm">Ask your first question below.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-surface text-ink-2'
              }`}
            >
              {m.text}
              {m.role === 'assistant' && !m.generatedByAI && (
                <p className="mt-1 text-[11px] opacity-70">(no AI key configured — generic response)</p>
              )}
            </div>
          </div>
        ))}
        {asking && <p className="text-sm text-ink-3">Thinking...</p>}
      </div>

      <form onSubmit={handleAsk} className="mt-4 flex gap-2">
        <input
          className="input-field"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" disabled={asking || !question.trim()} className="btn-primary shrink-0">
          Ask
        </button>
      </form>
    </div>
  );
};

export default DoubtSolverPage;
