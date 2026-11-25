import { useState } from 'react';
import FormInput from '../common/FormInput';
import Icon from '../icons/Icon';

const emptyFromFields = (fields) =>
  fields.reduce((acc, f) => ({ ...acc, [f.key]: f.type === 'tags' ? [] : '' }), {});

const ListSection = ({ title, icon, items, onChange, fields, renderSummary }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const addItem = () => {
    const next = [...items, emptyFromFields(fields)];
    onChange(next);
    setOpenIndex(next.length - 1);
  };

  const updateItem = (index, key, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(target);
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-1">
          <Icon name={icon} className="h-5 w-5 text-brand-500" /> {title}
        </h2>
        <button type="button" onClick={addItem} className="btn-secondary px-3 py-1.5 text-sm">
          + Add
        </button>
      </div>

      {items.length === 0 && <p className="text-sm text-ink-3">Nothing added yet.</p>}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-surface-border bg-surface">
            <div
              className="flex cursor-pointer items-center justify-between px-4 py-3"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-sm font-medium text-ink-1">
                {renderSummary(item) || `${title} #${index + 1}`}
              </span>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => moveItem(index, -1)} className="rounded p-1.5 text-ink-3 hover:text-ink-1" aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveItem(index, 1)} className="rounded p-1.5 text-ink-3 hover:text-ink-1" aria-label="Move down">↓</button>
                <button type="button" onClick={() => removeItem(index)} className="rounded p-1.5 text-danger hover:brightness-90" aria-label="Delete">✕</button>
              </div>
            </div>

            {openIndex === index && (
              <div className="grid grid-cols-1 gap-3 border-t border-surface-border p-4 sm:grid-cols-2">
                {fields.map((field) => {
                  const fieldId = `${title}-${index}-${field.key}`.replace(/\s+/g, '-');
                  return (
                  <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    {field.type === 'textarea' ? (
                      <>
                        <label className="label-text" htmlFor={fieldId}>{field.label}</label>
                        <textarea
                          id={fieldId}
                          className="input-field min-h-[80px] resize-y"
                          value={item[field.key] || ''}
                          onChange={(e) => updateItem(index, field.key, e.target.value)}
                        />
                      </>
                    ) : field.type === 'select' ? (
                      <>
                        <label className="label-text" htmlFor={fieldId}>{field.label}</label>
                        <select
                          id={fieldId}
                          className="input-field"
                          value={item[field.key] || field.options[0]}
                          onChange={(e) => updateItem(index, field.key, e.target.value)}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </>
                    ) : field.type === 'tags' ? (
                      <FormInput
                        id={fieldId}
                        label={`${field.label} (comma separated)`}
                        value={Array.isArray(item[field.key]) ? item[field.key].join(', ') : ''}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                        }
                      />
                    ) : (
                      <FormInput
                        id={fieldId}
                        label={field.label}
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                      />
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSection;
