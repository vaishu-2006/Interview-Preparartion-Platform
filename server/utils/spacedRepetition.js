// Standard SM-2 spaced-repetition scheduling — the algorithm behind Anki/SuperMemo. A real,
// deterministic scheduling function, not an AI-generated study plan: given a card's current
// state and a review quality score, it returns exactly when the card is due next.
const MIN_EASE_FACTOR = 1.3;

// quality: 1 (Again), 3 (Hard), 4 (Good), 5 (Easy) — a simplified 4-button mapping of SM-2's
// original 0-5 scale, matching how Anki itself presents grading to users.
const applySm2 = ({ easeFactor, interval, repetitions }, quality) => {
  let nextInterval;
  let nextRepetitions;

  if (quality < 3) {
    nextRepetitions = 0;
    nextInterval = 1;
  } else {
    if (repetitions === 0) nextInterval = 1;
    else if (repetitions === 1) nextInterval = 6;
    else nextInterval = Math.round(interval * easeFactor);
    nextRepetitions = repetitions + 1;
  }

  let nextEase = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  nextEase = Math.max(MIN_EASE_FACTOR, Math.round(nextEase * 100) / 100);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + nextInterval);
  dueDate.setHours(0, 0, 0, 0);

  return { easeFactor: nextEase, interval: nextInterval, repetitions: nextRepetitions, dueDate };
};

module.exports = { applySm2 };
