const crypto = require('crypto');

// Deterministic pick: the same seed always yields the same subset in the same order, so a
// "pick N items for this date/week" call returns identical results for every user without
// persisting a random seed anywhere.
const seededPick = (items, seed, count) => {
  const hash = crypto.createHash('sha256').update(seed).digest();
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = hash[i % hash.length] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
};

module.exports = seededPick;
