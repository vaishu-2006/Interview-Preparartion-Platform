const ApiError = require('../utils/ApiError');

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com';

// Language IDs pinned to stable versions available on the public Judge0 CE demo instance.
const LANGUAGE_IDS = {
  c: 103, // C (GCC 14.1.0)
  cpp: 105, // C++ (GCC 14.1.0)
  java: 62, // Java (OpenJDK 13.0.1)
  javascript: 102, // JavaScript (Node.js 22.08.0)
  python: 109, // Python (3.13.2)
};

const STATUS = {
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  COMPILATION_ERROR: 6,
};

const execute = async ({ language, code, stdin }) => {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new ApiError(422, `Unsupported language: ${language}`);
  }

  const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
      cpu_time_limit: 5,
    }),
  });

  if (!response.ok) {
    throw new ApiError(502, 'Code execution service is currently unavailable. Please try again shortly.');
  }

  const result = await response.json();

  let status;
  if (result.status?.id === STATUS.COMPILATION_ERROR) {
    status = 'Compilation Error';
  } else if (result.stderr || (result.status?.id && result.status.id > STATUS.WRONG_ANSWER && result.status.id !== STATUS.ACCEPTED)) {
    status = 'Runtime Error';
  } else {
    status = null; // caller decides Accepted vs Wrong Answer by comparing stdout
  }

  return {
    stdout: (result.stdout || '').replace(/\n$/, ''),
    stderr: result.stderr || '',
    compileOutput: result.compile_output || '',
    time: result.time,
    memory: result.memory,
    forcedStatus: status,
    statusDescription: result.status?.description,
  };
};

module.exports = { execute, LANGUAGE_IDS };
