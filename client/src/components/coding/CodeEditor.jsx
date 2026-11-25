import Editor from '@monaco-editor/react';
import { useSelector } from 'react-redux';

const MONACO_LANGUAGE = { c: 'c', cpp: 'cpp', java: 'java', python: 'python', javascript: 'javascript' };

const EditorLoading = () => (
  <div className="flex h-full items-center justify-center gap-3 bg-surface text-sm text-ink-3">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-border border-t-brand-500" />
    Loading editor...
  </div>
);

const CodeEditor = ({ language, value, onChange }) => {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border">
      <Editor
        height="480px"
        language={MONACO_LANGUAGE[language]}
        value={value}
        onChange={(v) => onChange(v ?? '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        loading={<EditorLoading />}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
        }}
      />
    </div>
  );
};

export default CodeEditor;
