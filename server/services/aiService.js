const {
  resumeCompleteness,
  resumeCompletenessFeedback,
  resumeCompletenessFromText,
  resumeCompletenessFeedbackFromText,
  flattenResumeToText,
  matchAgainstJobDescription,
} = require('../utils/resumeScoring');

// ---- Multi-provider AI layer ----
// Several OpenAI-compatible (and one non-compatible: Gemini) providers are tried in order;
// the first one with a key configured that responds successfully wins. This is a fallback
// chain, not a load balancer — each request tries providers in priority order until one
// succeeds, falling back to the rule-based mock generators if all configured providers fail.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';

// Some free-tier models (notably via OpenRouter) don't reliably honor response_format and
// wrap JSON in prose or code fences. Try a strict parse first, then recover the first {...}
// block before giving up — keeps the fallback chain from failing on an otherwise-good reply.
const parseJsonLoose = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content?.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Response was not valid JSON');
  }
};

const callOpenAICompatible = async (baseUrl, apiKey, model, systemPrompt, userPrompt, extraHeaders = {}, timeoutMs = 20000) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Request to ${baseUrl} failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return parseJsonLoose(content);
};

const callOpenAI = (systemPrompt, userPrompt) =>
  callOpenAICompatible('https://api.openai.com/v1/chat/completions', OPENAI_API_KEY, OPENAI_MODEL, systemPrompt, userPrompt);

const callGroq = (systemPrompt, userPrompt) =>
  callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', GROQ_API_KEY, GROQ_MODEL, systemPrompt, userPrompt);

const callMistral = (systemPrompt, userPrompt) =>
  callOpenAICompatible('https://api.mistral.ai/v1/chat/completions', MISTRAL_API_KEY, MISTRAL_MODEL, systemPrompt, userPrompt);

// OpenRouter's free-tier models run on shared community capacity and some do chain-of-thought
// reasoning before answering — observed up to ~33s for a realistic prompt, well past the 20s
// used for the other (consistently fast) providers. It's last in the fallback chain anyway, so
// the extra patience only costs time on the rare request that reaches this far.
const callOpenRouter = (systemPrompt, userPrompt) =>
  callOpenAICompatible(
    'https://openrouter.ai/api/v1/chat/completions',
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    systemPrompt,
    userPrompt,
    { 'X-Title': 'Placement Prep Platform' },
    45000
  );

const callGemini = async (systemPrompt, userPrompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
      }),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Gemini request failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseJsonLoose(content);
};

// Priority order: fastest/most reliable free-tier providers first, OpenRouter last among
// live providers since its free models are shared community capacity and rate-limit first.
const PROVIDERS = [
  { name: 'groq', enabled: () => Boolean(GROQ_API_KEY), call: callGroq },
  { name: 'gemini', enabled: () => Boolean(GEMINI_API_KEY), call: callGemini },
  { name: 'mistral', enabled: () => Boolean(MISTRAL_API_KEY), call: callMistral },
  { name: 'openrouter', enabled: () => Boolean(OPENROUTER_API_KEY), call: callOpenRouter },
  { name: 'openai', enabled: () => Boolean(OPENAI_API_KEY), call: callOpenAI },
];

const isLive = () => PROVIDERS.some((p) => p.enabled());

// Tries each configured provider in order, returning the first successful response along
// with which provider produced it (so reports can show "Scored by Groq" etc). Throws only
// if every configured provider fails, at which point the caller falls back to mock output.
const callLiveProvider = async (systemPrompt, userPrompt) => {
  let lastError;
  for (const provider of PROVIDERS) {
    if (!provider.enabled()) continue;
    try {
      const result = await provider.call(systemPrompt, userPrompt);
      return { result, providerUsed: provider.name };
    } catch (err) {
      console.error(`AI provider "${provider.name}" failed, trying next:`, err.message);
      lastError = err;
    }
  }
  throw lastError || new Error('No AI provider is configured');
};

// ---- Mock question bank, used until an OPENAI_API_KEY is configured ----
const QUESTION_BANK = {
  Technical: {
    Easy: [
      'Can you explain the difference between an array and a linked list?',
      'What is the time complexity of binary search, and why?',
      'How would you reverse a string without using a built-in function?',
      'What is the difference between a stack and a queue?',
      'Explain what an API is, in your own words.',
    ],
    Medium: [
      'Walk me through how you would design a rate limiter for an API.',
      'Explain how a hash map works internally and how collisions are handled.',
      'How would you optimize a slow database query on a large table?',
      'What is the difference between SQL and NoSQL databases, and when would you choose one over the other?',
      'How does garbage collection work in the language you are most comfortable with?',
    ],
    Hard: [
      'How would you design a system like a URL shortener at scale?',
      'Explain the CAP theorem and how it influences distributed system design.',
      'Describe how you would debug a memory leak in a production Node.js service.',
      'How would you design a notification system that scales to millions of users?',
      'Walk me through how you would shard a database that has outgrown a single instance.',
    ],
  },
  Behavioral: {
    Easy: [
      'Tell me about a time you worked well in a team.',
      'Describe a situation where you had to learn something new quickly.',
      'How do you prioritize tasks when you have multiple deadlines?',
      'Tell me about a time you helped a struggling teammate.',
      'Describe your ideal working environment.',
    ],
    Medium: [
      'Tell me about a time you disagreed with a teammate. How did you handle it?',
      'Describe a project that failed. What did you learn from it?',
      'How do you handle receiving critical feedback on your work?',
      'Tell me about a time you had to adapt to a significant change at work.',
      'Describe a time you went above and beyond what was expected of you.',
    ],
    Hard: [
      'Tell me about a time you had to make a difficult decision with incomplete information.',
      'Describe a time you had to influence a team without formal authority.',
      'Tell me about a time you took ownership of a significant failure.',
      'Describe a situation where you had to manage conflicting priorities from multiple stakeholders.',
      'Tell me about the most difficult professional relationship you\'ve had to navigate.',
    ],
  },
  HR: {
    Easy: [
      'Tell me a little about yourself.',
      'Why are you interested in this role?',
      'What are your greatest strengths?',
      'What do you know about our company?',
      'What kind of work environment do you thrive in?',
    ],
    Medium: [
      'Where do you see yourself in five years?',
      'Why are you looking to leave your current position?',
      'What is your biggest weakness, and how are you working on it?',
      'How do you handle a heavy workload and tight deadlines?',
      'What motivates you in your work?',
    ],
    Hard: [
      'Why should we hire you over other equally qualified candidates?',
      'How do you handle high-pressure situations with competing stakeholder demands?',
      'What is a professional risk you took that didn\'t pay off, and how did you recover?',
      'How do you approach a situation where you strongly disagree with a leadership decision?',
      'What would your previous manager say is the one thing you need to improve on?',
    ],
  },
};

const buildResumeContext = (resumeSnapshot) => {
  if (!resumeSnapshot) return '';
  const skills = resumeSnapshot.skills?.join(', ');
  const projects = resumeSnapshot.projects?.map((p) => p.title).join(', ');
  return [skills && `Skills: ${skills}`, projects && `Projects: ${projects}`].filter(Boolean).join('. ');
};

const generateQuestionsMock = ({ interviewType, difficulty, count, previousQuestions = [] }) => {
  const byDifficulty = QUESTION_BANK[interviewType] || QUESTION_BANK.Technical;
  // Prefer the requested difficulty, then widen to the rest of the type's bank if more
  // unique questions are needed than that single bucket holds.
  const orderedPool = [
    ...(byDifficulty[difficulty] || []),
    ...Object.entries(byDifficulty)
      .filter(([d]) => d !== difficulty)
      .flatMap(([, qs]) => qs),
  ];
  const uniquePool = [...new Set(orderedPool)];

  const asked = new Set(previousQuestions);
  const unseen = uniquePool.filter((q) => !asked.has(q));
  // Only fall back to previously-asked questions if there truly aren't enough unseen ones.
  const source = unseen.length >= count ? unseen : uniquePool;

  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateQuestions = async ({ jobRole, interviewType, difficulty, resumeSnapshot, count, previousQuestions }) => {
  if (!isLive()) {
    return generateQuestionsMock({ interviewType, difficulty, count, previousQuestions });
  }

  try {
    const resumeContext = buildResumeContext(resumeSnapshot);
    const { result } = await callLiveProvider(
      'You are an experienced technical interviewer. Generate interview questions and respond ONLY with JSON of the shape {"questions": ["...", ...]}.',
      `Generate ${count} unique ${difficulty.toLowerCase()}-difficulty ${interviewType} interview questions for a "${jobRole}" role. ${
        resumeContext ? `Candidate background: ${resumeContext}.` : ''
      } Do not repeat any of these previously-asked questions: ${JSON.stringify(previousQuestions.slice(-20))}.`
    );
    const questions = Array.isArray(result.questions)
      ? result.questions.filter((q) => typeof q === 'string' && q.trim()).slice(0, count)
      : [];
    if (questions.length) {
      return questions;
    }
    throw new Error('AI provider returned no usable questions');
  } catch (err) {
    console.error('Live question generation failed, falling back to mock bank:', err.message);
    return generateQuestionsMock({ interviewType, difficulty, count, previousQuestions });
  }
};

// ---- Feedback generation ----
const scoreFromAnswerLength = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.min(100, Math.round(30 + words * 2.5));
};

const average = (nums) => (nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0);

// LLM output is untrusted input, not a guaranteed schema — models occasionally return a
// nested object, a string, or an out-of-range value for what should be a 0-100 number
// (observed live: Groq returning `"behavior": {"confidence": 0, "eyeContact": 0}` instead
// of a number). Coerce defensively before this ever reaches a Mongoose Number field.
const toScore = (value) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
};

const truncate = (text = '', max = 70) => {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
};

// Rule-based fallback, used when no live AI provider is configured/reachable. Every field is
// derived from THIS session's actual turns (which question got skipped, which was weakest,
// how many violations) rather than fixed boilerplate, so two different sessions — or a strong
// vs. weak attempt at the same role — read as genuinely different reports, not a repeated template.
const generateFeedbackMock = ({ turns, metrics, jobRole, interviewType, difficulty, autoSubmitted }) => {
  const answered = turns.filter((t) => !t.skipped && t.answerText?.trim());
  const skipped = turns.filter((t) => t.skipped);
  const unanswered = turns.filter((t) => !t.skipped && !t.answerText?.trim());
  const communication = average(answered.map((t) => scoreFromAnswerLength(t.answerText)));
  const technicalAccuracy = answered.length
    ? Math.min(100, Math.round(40 + (answered.length / turns.length) * 50))
    : 0;

  const confidence = average((metrics?.samples || []).map((s) => s.confidenceScore).filter((n) => n !== undefined));
  const eyeContact = average((metrics?.samples || []).map((s) => s.eyeContactScore).filter((n) => n !== undefined));
  const behavior = average([confidence, eyeContact].filter((n) => n > 0));

  const overallScore = average([technicalAccuracy, communication, confidence, eyeContact, behavior].filter((n) => n > 0));

  const strengths = [];
  const improvements = [];

  // Auto-submitted-with-nothing-answered is a distinct case from a genuinely weak attempt —
  // call it out explicitly instead of feeding it through the same generic scoring copy.
  if (autoSubmitted && answered.length === 0) {
    improvements.push(
      `This attempt was auto-submitted after repeated proctoring warnings before you answered any of the ${turns.length} ` +
        `${interviewType} question${turns.length === 1 ? '' : 's'} — e.g. "${truncate(turns[0]?.questionText)}" was never attempted. ` +
        'Retake the test and stay on the exam tab throughout to get a real technical/communication score.'
    );
  } else {
    const rankedAnswers = [...answered].sort(
      (a, b) => scoreFromAnswerLength(b.answerText) - scoreFromAnswerLength(a.answerText)
    );
    const best = rankedAnswers[0];
    const weakest = rankedAnswers[rankedAnswers.length - 1];

    if (best && scoreFromAnswerLength(best.answerText) >= 60) {
      strengths.push(`Gave a detailed, well-developed answer to "${truncate(best.questionText)}".`);
    }
    if (weakest && best !== weakest && scoreFromAnswerLength(weakest.answerText) < 60) {
      improvements.push(`Your answer to "${truncate(weakest.questionText)}" was thin — expand it with a concrete example or outcome.`);
    } else if (!improvements.length && communication < 60 && answered.length) {
      improvements.push(`Answers like "${truncate(weakest?.questionText || answered[0]?.questionText)}" were brief — aim for 3-4 sentences with a specific example.`);
    }

    if (skipped.length) {
      improvements.push(
        `You skipped ${skipped.length} of ${turns.length} question${turns.length === 1 ? '' : 's'} — e.g. "${truncate(skipped[0].questionText)}". ` +
          'Attempting every question, even partially, scores better than a skip.'
      );
    }
    if (unanswered.length) {
      improvements.push(`"${truncate(unanswered[0].questionText)}" had no recorded answer — make sure to submit before time runs out.`);
    }
    if (answered.length === turns.length) strengths.push(`Answered all ${turns.length} questions without skipping any.`);
    if (!improvements.length) improvements.push('Keep practicing at this difficulty to build on a strong performance.');
  }

  // Confidence/eye-contact come from real, independently-measured webcam metrics, not from
  // answer quality — so they still deserve credit (or a note) even in the auto-submitted/
  // nothing-answered branch above, instead of being skipped along with the answer-based checks.
  if (confidence >= 60) strengths.push('Maintained a confident, steady presence on camera.');
  else if (confidence > 0) improvements.push('Work on projecting more confidence — steady posture and a calm, measured pace help.');
  if (eyeContact >= 60) strengths.push('Good eye contact with the camera throughout.');
  else if (eyeContact > 0) improvements.push('Try to look at the camera more consistently rather than away from it.');
  if (!strengths.length) {
    strengths.push(
      autoSubmitted && answered.length === 0
        ? 'None yet — retake the test and answer at least one question to get real, personalized strengths here.'
        : 'Completed the interview session end-to-end.'
    );
  }

  // Suggestions are built from the weakest scored dimension for THIS session, not a fixed pair —
  // a low-technical session and a low-confidence session get different advice.
  const dimensions = [
    { key: 'technicalAccuracy', label: `${jobRole} technical depth`, value: technicalAccuracy },
    { key: 'communication', label: 'answer structure and clarity', value: communication },
    { key: 'confidence', label: 'on-camera confidence', value: confidence },
    { key: 'eyeContact', label: 'eye contact with the camera', value: eyeContact },
  ].filter((d) => d.value > 0 || (d.key === 'technicalAccuracy' && answered.length === 0));
  dimensions.sort((a, b) => a.value - b.value);
  const weakestDimension = dimensions[0];

  const suggestions = [];
  if (weakestDimension) {
    suggestions.push(
      weakestDimension.key === 'technicalAccuracy'
        ? `Your weakest area this session was ${weakestDimension.label} — revisit ${jobRole} fundamentals and practice explaining them out loud.`
        : `Your weakest area this session was ${weakestDimension.label} (${weakestDimension.value}/100) — focus your next practice round there.`
    );
  }
  suggestions.push(
    `This was a ${difficulty} ${interviewType} round for a ${jobRole} role — do a few more ${difficulty.toLowerCase()}-level ${interviewType.toLowerCase()} practice sessions under timed conditions before the real thing.`
  );
  if (answered.length) {
    suggestions.push('Record yourself answering practice questions to review your pacing and clarity.');
  }

  const questionFeedback = turns.map((t) => ({
    index: t.index,
    questionText: t.questionText,
    answerText: t.answerText,
    score: t.skipped ? 0 : scoreFromAnswerLength(t.answerText),
    feedback: t.skipped
      ? 'This question was skipped.'
      : t.answerText?.trim()
      ? 'Answer recorded. Consider adding more specific, concrete detail for a stronger response.'
      : 'No answer was recorded for this question.',
  }));

  return {
    technicalAccuracy,
    communication,
    confidence,
    eyeContact,
    behavior,
    overallScore,
    strengths,
    improvements,
    suggestions,
    questionFeedback,
    generatedByAI: false,
    aiProvider: 'mock',
  };
};

const generateFeedback = async ({ turns, metrics, jobRole, interviewType, difficulty, autoSubmitted }) => {
  if (!isLive()) {
    return generateFeedbackMock({ turns, metrics, jobRole, interviewType, difficulty, autoSubmitted });
  }

  try {
    const confidence = average((metrics?.samples || []).map((s) => s.confidenceScore).filter((n) => n !== undefined));
    const eyeContact = average((metrics?.samples || []).map((s) => s.eyeContactScore).filter((n) => n !== undefined));

    const { result, providerUsed } = await callLiveProvider(
      'You are an expert interview coach. Evaluate the candidate\'s answers for THIS specific session and respond ONLY with JSON of the shape ' +
        '{"technicalAccuracy":0-100,"communication":0-100,"behavior":0-100,"overallScore":0-100,"strengths":[""],"improvements":[""],"suggestions":[""],' +
        '"questionFeedback":[{"index":0,"feedback":"","score":0-100}]}. ' +
        'Ground every strength, improvement and suggestion in the actual questions and answers given below — quote or paraphrase specific ' +
        'questions/answers rather than giving generic advice, so a different session produces visibly different feedback.',
      `Job role: ${jobRole}. Interview type: ${interviewType}. Difficulty: ${difficulty}. ` +
        `Webcam-derived confidence score: ${confidence}/100, eye contact score: ${eyeContact}/100 (use these as-is for those two dimensions). ` +
        (autoSubmitted ? 'This session was auto-submitted early due to repeated proctoring violations — factor that in. ' : '') +
        `Q&A transcript: ${JSON.stringify(turns.map((t) => ({ index: t.index, question: t.questionText, answer: t.answerText, skipped: t.skipped })))}`
    );

    return {
      technicalAccuracy: toScore(result.technicalAccuracy),
      communication: toScore(result.communication),
      confidence,
      eyeContact,
      behavior: toScore(result.behavior),
      overallScore: toScore(result.overallScore),
      strengths: Array.isArray(result.strengths) ? result.strengths.filter((s) => typeof s === 'string') : [],
      improvements: Array.isArray(result.improvements) ? result.improvements.filter((s) => typeof s === 'string') : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions.filter((s) => typeof s === 'string') : [],
      questionFeedback: turns.map((t) => {
        const match = result.questionFeedback?.find((qf) => qf.index === t.index);
        return {
          index: t.index,
          questionText: t.questionText,
          answerText: t.answerText,
          score: toScore(match?.score),
          feedback: typeof match?.feedback === 'string' ? match.feedback : '',
        };
      }),
      generatedByAI: true,
      aiProvider: providerUsed,
    };
  } catch (err) {
    console.error('Live feedback generation failed, falling back to rule-based feedback:', err.message);
    return generateFeedbackMock({ turns, metrics, jobRole, interviewType, difficulty, autoSubmitted });
  }
};

// ---- Resume screening ----
// Accepts either a structured platform `resume` document, or raw `resumeText` extracted from
// an uploaded PDF — exactly one is expected. Uploaded text has no structured fields to inspect,
// so it uses a separate text-pattern heuristic instead of the field-presence one.
const scoreResume = async ({ resume, resumeText, jobDescription }) => {
  const heuristicScore = resumeText ? resumeCompletenessFromText(resumeText) : resumeCompleteness(resume);
  const heuristicFeedback = resumeText ? resumeCompletenessFeedbackFromText(resumeText) : resumeCompletenessFeedback(resume);
  const flatResumeText = resumeText || flattenResumeToText(resume);
  const jdMatch = jobDescription?.trim() ? matchAgainstJobDescription(flatResumeText, jobDescription) : null;

  if (!isLive()) {
    if (!jdMatch) {
      return { score: heuristicScore, feedback: heuristicFeedback, generatedByAI: false, aiProvider: 'mock' };
    }
    const blendedScore = toScore(0.5 * heuristicScore + 0.5 * jdMatch.matchPercent);
    const jdFeedback = jdMatch.missingKeywords.length
      ? [`Missing from your resume but present in the job description: ${jdMatch.missingKeywords.join(', ')}.`]
      : ['Your resume already covers the key terms from this job description.'];
    return {
      score: blendedScore,
      feedback: [...jdFeedback, ...heuristicFeedback],
      jdMatchPercent: jdMatch.matchPercent,
      missingKeywords: jdMatch.missingKeywords,
      generatedByAI: false,
      aiProvider: 'mock',
    };
  }

  try {
    let userContent;
    if (resumeText) {
      userContent = `Resume text extracted from an uploaded PDF:\n${resumeText.slice(0, 6000)}`;
    } else {
      const summary = resume?.personalDetails?.summary || '';
      const skills = resume?.skills || [];
      const projects = (resume?.projects || []).map((p) => ({ title: p.title, description: p.description }));
      const experience = (resume?.experience || []).map((e) => ({ role: e.role, company: e.company, description: e.description }));
      userContent =
        `Summary: ${summary || '(none provided)'}. Skills: ${skills.join(', ') || '(none provided)'}. ` +
        `Projects: ${JSON.stringify(projects)}. Experience: ${JSON.stringify(experience)}.`;
    }

    const systemPrompt = jobDescription?.trim()
      ? 'You are an experienced technical recruiter screening a resume against a specific job description. Judge how well ' +
        'the resume matches the JD\'s requirements, and what a candidate should add or rephrase to better match it — not just ' +
        'whether sections are present. Respond ONLY with JSON of the shape {"score":0-100,"feedback":["...", "..."],' +
        '"missingSkills":["...", "..."]} with 2-5 concrete, JD-specific feedback strings and up to 8 missing skills/keywords.'
      : 'You are an experienced technical recruiter screening a resume for a placement drive. Judge clarity, specificity, and ' +
        'how compelling it would be to a real recruiter — not just whether sections are present. Respond ONLY with JSON of ' +
        'the shape {"score":0-100,"feedback":["...", "..."]} with 2-4 concrete, actionable feedback strings.';

    const { result, providerUsed } = await callLiveProvider(
      systemPrompt,
      jobDescription?.trim() ? `${userContent}\n\nJob description to match against:\n${jobDescription.slice(0, 4000)}` : userContent
    );

    const aiScore = toScore(result.score);
    const blended = jdMatch
      ? toScore(0.4 * aiScore + 0.3 * heuristicScore + 0.3 * jdMatch.matchPercent)
      : toScore(0.5 * aiScore + 0.5 * heuristicScore);
    const feedback = Array.isArray(result.feedback) ? result.feedback.filter((f) => typeof f === 'string' && f.trim()) : [];
    const missingSkills = Array.isArray(result.missingSkills) ? result.missingSkills.filter((s) => typeof s === 'string' && s.trim()) : [];

    return {
      score: blended,
      feedback: feedback.length ? feedback : heuristicFeedback,
      ...(jdMatch && { jdMatchPercent: jdMatch.matchPercent, missingKeywords: missingSkills.length ? missingSkills : jdMatch.missingKeywords }),
      generatedByAI: true,
      aiProvider: providerUsed,
    };
  } catch (err) {
    console.error('Live resume screening failed, falling back to heuristic:', err.message);
    if (!jdMatch) {
      return { score: heuristicScore, feedback: heuristicFeedback, generatedByAI: false, aiProvider: 'mock' };
    }
    const blendedScore = toScore(0.5 * heuristicScore + 0.5 * jdMatch.matchPercent);
    return {
      score: blendedScore,
      feedback: heuristicFeedback,
      jdMatchPercent: jdMatch.matchPercent,
      missingKeywords: jdMatch.missingKeywords,
      generatedByAI: false,
      aiProvider: 'mock',
    };
  }
};

// ---- AI code review ----
const reviewCodeMock = (code) => {
  const tips = [];
  const nonEmptyLines = code.split('\n').filter((l) => l.trim()).length;
  if (nonEmptyLines > 60) tips.push('This solution is fairly long — look for ways to break it into smaller helper functions.');
  if (!/\/\/|#|\/\*/.test(code)) tips.push('Consider adding a few comments explaining the approach.');
  tips.push('Double-check edge cases: empty input, a single element, and the largest allowed input size.');
  return tips;
};

const reviewCode = async ({ problemStatement, language, code }) => {
  if (!isLive()) {
    return { feedback: reviewCodeMock(code), generatedByAI: false, aiProvider: 'mock' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are a senior software engineer doing a code review for a candidate practicing for interviews. Review their ' +
        'submission for correctness risk, edge cases, efficiency, and readability — be specific, not just encouraging. ' +
        'Respond ONLY with JSON of the shape {"feedback":["...", "..."]} with 2-4 concrete review comments.',
      `Problem: ${problemStatement}\n\nLanguage: ${language}\n\nCode:\n${code.slice(0, 4000)}`
    );
    const feedback = Array.isArray(result.feedback) ? result.feedback.filter((f) => typeof f === 'string' && f.trim()) : [];
    return { feedback: feedback.length ? feedback : reviewCodeMock(code), generatedByAI: true, aiProvider: providerUsed };
  } catch (err) {
    console.error('Live code review failed, falling back to heuristic:', err.message);
    return { feedback: reviewCodeMock(code), generatedByAI: false, aiProvider: 'mock' };
  }
};

// ---- UPSC answer-writing feedback ----
const scoreAnswerWritingMock = (answerText) => {
  const words = answerText.trim().split(/\s+/).filter(Boolean).length;
  const feedback = [];
  if (words < 100) feedback.push('This answer is quite short for a Mains-style response — aim for more depth and structure.');
  if (!/\n/.test(answerText)) feedback.push('Consider structuring your answer with clear paragraphs (intro, body, conclusion).');
  feedback.push('Support your points with specific examples, data, or committee/report references where relevant.');
  const score = Math.max(20, Math.min(70, Math.round(words / 3)));
  return { score, feedback };
};

const scoreAnswerWriting = async ({ prompt, answerText }) => {
  if (!isLive()) {
    const { score, feedback } = scoreAnswerWritingMock(answerText);
    return { score, feedback, generatedByAI: false, aiProvider: 'mock' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are a UPSC Mains answer-writing evaluator. Judge structure, relevance to the question, use of examples/data, ' +
        'and conclusion quality. Respond ONLY with JSON of the shape {"score":0-100,"feedback":["...", "..."]} with 2-4 ' +
        'concrete, actionable feedback strings.',
      `Question: ${prompt}\n\nAnswer:\n${answerText.slice(0, 4000)}`
    );
    const feedback = Array.isArray(result.feedback) ? result.feedback.filter((f) => typeof f === 'string' && f.trim()) : [];
    const mock = scoreAnswerWritingMock(answerText);
    return {
      score: toScore(result.score ?? mock.score),
      feedback: feedback.length ? feedback : mock.feedback,
      generatedByAI: true,
      aiProvider: providerUsed,
    };
  } catch (err) {
    console.error('Live answer-writing scoring failed, falling back to heuristic:', err.message);
    const { score, feedback } = scoreAnswerWritingMock(answerText);
    return { score, feedback, generatedByAI: false, aiProvider: 'mock' };
  }
};

// ---- On-demand AI practice questions (fresh, not persisted to the curated banks) ----
// No non-AI fallback here beyond an honest "needs a key" message — algorithmically generating
// plausible-looking-but-unverified MCQs without an LLM would risk serving wrong answers framed
// as fact, which is worse than just saying the feature needs a configured provider.
const generatePracticeMcqs = async ({ topic, course, count = 5 }) => {
  if (!isLive()) {
    return { questions: [], generatedByAI: false, message: 'AI-generated practice questions need a configured AI provider key on this deployment.' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are an expert exam-question setter. Generate fresh multiple-choice practice questions on the given topic, ' +
        'factually correct and unambiguous. Respond ONLY with JSON of the shape ' +
        '{"questions":[{"question":"","options":["",""],"correctOptionIndex":0,"explanation":""}]}.',
      `Topic: ${topic}. Context: practice questions for a ${course || 'placement/exam'} candidate. Generate ${count} questions, ` +
        'each with exactly 4 options and a brief explanation of the correct answer.'
    );
    const questions = Array.isArray(result.questions)
      ? result.questions
          .filter((q) => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2)
          .slice(0, count)
          .map((q) => ({
            question: q.question,
            options: q.options,
            correctOptionIndex: Number.isInteger(q.correctOptionIndex) ? q.correctOptionIndex : 0,
            explanation: typeof q.explanation === 'string' ? q.explanation : '',
          }))
      : [];
    if (!questions.length) throw new Error('AI provider returned no usable questions');
    return { questions, generatedByAI: true, aiProvider: providerUsed };
  } catch (err) {
    console.error('AI practice-question generation failed:', err.message);
    return { questions: [], generatedByAI: false, message: 'Could not generate practice questions right now — try again in a moment.' };
  }
};

// ---- "Explain my mistake" for a failing coding submission ----
const explainFailureMock = () =>
  "Your output doesn't match the expected result for this input. Common causes: an off-by-one error in a loop bound, " +
  'not handling an edge case (empty input, a single element, duplicates), or a variable not being reset between runs. ' +
  'Trace through your code by hand with this exact input to spot where it diverges.';

const explainFailure = async ({ problemStatement, language, code, input, expectedOutput, actualOutput }) => {
  if (!isLive()) {
    return { explanation: explainFailureMock(), generatedByAI: false, aiProvider: 'mock' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are a patient programming tutor. The student\'s code produced the wrong output for one test case. Explain, in ' +
        'plain language, why their approach likely produces this specific wrong output for this specific input — do not ' +
        'just restate the diff. Respond ONLY with JSON of the shape {"explanation":"..."} (3-6 sentences).',
      `Problem: ${problemStatement}\n\nLanguage: ${language}\n\nCode:\n${code.slice(0, 4000)}\n\n` +
        `Failing input: ${input}\nExpected output: ${expectedOutput}\nActual output: ${actualOutput}`
    );
    const explanation = typeof result.explanation === 'string' && result.explanation.trim() ? result.explanation : explainFailureMock();
    return { explanation, generatedByAI: true, aiProvider: providerUsed };
  } catch (err) {
    console.error('Live explain-failure generation failed, falling back to heuristic:', err.message);
    return { explanation: explainFailureMock(), generatedByAI: false, aiProvider: 'mock' };
  }
};

// ---- Role-specific career roadmap (searched by the student, not one of the curated course
// roadmaps) ----
// No non-AI fallback beyond an honest "needs a key" message, same reasoning as the practice-MCQ
// generator above: a fake-but-plausible roadmap for an arbitrary searched role would be worse
// than admitting the feature needs a configured provider.
const generateRoleRoadmap = async ({ role, course }) => {
  if (!isLive()) {
    return { stages: [], generatedByAI: false, message: 'Role-specific roadmap generation needs a configured AI provider key on this deployment.' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are an experienced career mentor who builds detailed, practical, stage-by-stage roadmaps for students preparing ' +
        'for a specific job role. Respond ONLY with JSON of the shape {"stages":[{"title":"","tagline":"","points":["", ...],' +
        '"skills":["", ...],"milestone":""}]}. Produce 5-7 stages in a sensible progression from where a typical student starts ' +
        'today to being genuinely competitive for the role. Each stage needs a short title, a one-sentence tagline, 4-6 concrete ' +
        'actionable points (not vague advice), 3-6 focus-skill keywords, and one milestone sentence describing what "done" looks ' +
        'like for that stage. Be specific to the target role, not generic career advice.',
      `Target role: "${role}". Student context: currently pursuing a ${course || 'placement-prep'} course. Build a realistic, ` +
        'detailed roadmap covering the skills to learn, projects to build, and interview prep relevant specifically to this role.'
    );
    const stages = Array.isArray(result.stages)
      ? result.stages
          .filter((s) => s && typeof s.title === 'string' && Array.isArray(s.points) && s.points.length)
          .slice(0, 8)
          .map((s) => ({
            title: s.title,
            tagline: typeof s.tagline === 'string' ? s.tagline : '',
            points: s.points.filter((p) => typeof p === 'string').slice(0, 8),
            skills: Array.isArray(s.skills) ? s.skills.filter((sk) => typeof sk === 'string').slice(0, 8) : [],
            milestone: typeof s.milestone === 'string' ? s.milestone : '',
          }))
      : [];
    if (!stages.length) throw new Error('AI provider returned no usable roadmap stages');
    return { stages, generatedByAI: true, aiProvider: providerUsed };
  } catch (err) {
    console.error('AI role-roadmap generation failed:', err.message);
    return { stages: [], generatedByAI: false, message: 'Could not generate a roadmap for that role right now — try again in a moment.' };
  }
};

// ---- AI doubt solver ----
const solveDoubtMock = () =>
  'AI doubt-solving needs a configured AI provider key on this deployment. Once one is set, ask away and you\'ll get a real explanation here.';

const solveDoubt = async ({ question }) => {
  if (!isLive()) {
    return { answer: solveDoubtMock(), generatedByAI: false, aiProvider: 'mock' };
  }
  try {
    const { result, providerUsed } = await callLiveProvider(
      'You are a patient tutor helping a student preparing for UPSC civil services or engineering placements. Answer the ' +
        'question clearly and concisely, in plain language. Respond ONLY with JSON of the shape {"answer": "..."}.',
      question
    );
    const answer = typeof result.answer === 'string' && result.answer.trim() ? result.answer : solveDoubtMock();
    return { answer, generatedByAI: true, aiProvider: providerUsed };
  } catch (err) {
    console.error('Live doubt-solving failed, falling back to mock:', err.message);
    return { answer: solveDoubtMock(), generatedByAI: false, aiProvider: 'mock' };
  }
};

module.exports = {
  isLive,
  generateQuestions,
  generateFeedback,
  scoreResume,
  reviewCode,
  scoreAnswerWriting,
  solveDoubt,
  generatePracticeMcqs,
  explainFailure,
  generateRoleRoadmap,
};
