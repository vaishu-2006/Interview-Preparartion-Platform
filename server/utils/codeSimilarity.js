// Heuristic code-similarity check — normalized token-shingle Jaccard similarity between two
// submissions. This is a classroom-scale "these two look suspiciously alike" signal, not a
// forensic plagiarism-detection tool: it doesn't understand semantics, and renaming variables
// or reordering unrelated statements can dodge it. Flag it to the admin as a starting point for
// manual review, never as a verdict.
const normalize = (code = '') =>
  code
    .replace(/\/\/.*$/gm, '') // c/cpp/java/js line comments
    .replace(/#.*$/gm, '') // python/# comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const shingles = (text, n = 5) => {
  const tokens = text.split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i <= tokens.length - n; i += 1) {
    set.add(tokens.slice(i, i + n).join(' '));
  }
  if (!set.size && tokens.length) set.add(tokens.join(' '));
  return set;
};

const jaccardSimilarity = (codeA, codeB) => {
  const a = shingles(normalize(codeA));
  const b = shingles(normalize(codeB));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach((s) => {
    if (b.has(s)) intersection += 1;
  });
  const union = a.size + b.size - intersection;
  return union ? Math.round((intersection / union) * 100) : 0;
};

module.exports = { jaccardSimilarity };
