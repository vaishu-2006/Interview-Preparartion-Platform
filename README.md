# Placement Prep Platform

AI-Powered Unified Placement Preparation Platform — a complete, production-quality build across all three planned phases: authentication & dashboard (Part 1), preparation modules (Part 2), and AI-powered mock interviews (Part 3).

## Stack
React (Vite) + Redux Toolkit + Tailwind CSS + Monaco Editor + Recharts + MediaPipe Tasks Vision · Node.js/Express · MongoDB (Mongoose) · JWT auth · Puppeteer (PDF export) · Judge0 (code execution) · Groq / Gemini / Mistral / OpenRouter / OpenAI (optional, for AI-generated interview questions/feedback — tries each in a fallback chain, any or none can be configured) · Docker

## Quick start (Docker — recommended)
```
cp .env.example .env   # set JWT_SECRET; AI provider keys are optional (see below)
docker compose up -d
docker compose exec server npm run seed   # populates coding + aptitude question banks
```
App: `http://localhost:8080` · API: `http://localhost:5000/api/health`

## Manual setup (without Docker)

### Prerequisites
- Node.js 18+
- A MongoDB instance — local (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- Internet access at runtime for: GitHub repo import, Judge0 code execution, Monaco's editor assets, and MediaPipe's face-tracking model (loaded from a CDN in-browser)

### Server
```
cd server
npm install
cp .env.example .env   # edit MONGO_URI / JWT_SECRET; AI provider keys optional
npm run seed            # populates coding + aptitude question banks (idempotent)
npm run dev
```
Runs on `http://localhost:5000`.

### Client
```
cd client
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5173`.

## AI Mock Interview: mock mode vs. live providers
The interview module works fully without any API key — `server/services/aiService.js` falls back to a rule-based question bank and heuristic scoring (clearly labeled `generatedByAI: false`, `aiProvider: "mock"` in reports) whenever no provider key is set.

To go live, add any combination of these to `server/.env` (or the root `.env` for Docker) — no code changes needed either way:

| Env var | Provider | Get a key at |
|---|---|---|
| `GROQ_API_KEY` | Groq | console.groq.com |
| `GEMINI_API_KEY` | Google Gemini | aistudio.google.com/apikey |
| `MISTRAL_API_KEY` | Mistral AI | console.mistral.ai |
| `OPENROUTER_API_KEY` | OpenRouter | openrouter.ai/settings/keys |
| `OPENAI_API_KEY` | OpenAI | platform.openai.com |

All are optional and independent — set one, some, or all. At request time, `aiService.js` tries them **in the order above** and uses the first one that responds successfully; if one fails (bad key, timeout, rate limit) it automatically falls through to the next, and to the mock generators only if every configured provider fails. The report's `aiProvider` field records which one actually answered (shown on the report page as "Scored by Groq", etc.), so it's always clear whether a given interview was AI-scored and by what.

Groq/Gemini/Mistral are placed first since they're fast and reliably available on their free tiers; OpenRouter is last among live providers because its free-tier models run on shared community capacity and can be slow or rate-limited (it gets a longer 45s timeout accordingly, vs. 20s for the others, since it's already the last resort before mock).

## What's implemented

**Part 1 — Foundation**
Register/Login/Logout, JWT auth, protected routes, persistent session, forgot/reset password, change password, delete account, landing page, first-time course (BE/BCA/UPSC) + branch selection, dashboard shell, Profile, Settings, 404/Unauthorized/loading states.

**Part 2 — Preparation Modules**
- **Resume Builder**: personal details, education, skills, experience, projects, certifications, achievements, languages, declaration — add/edit/delete/reorder items and reorder whole sections, 3 switchable templates, live preview, PDF export (Puppeteer). LinkedIn/Portfolio render as labeled links ("LinkedIn"/"Portfolio", protocol auto-added if omitted) rather than raw URLs, in both the live preview and the exported PDF.
- **GitHub import**: fetch a user's public repos and import selected ones into the resume's Projects section. If a repo has no GitHub "description" set (common for personal repos), the description is pulled from the repo's README instead — badges/headers/images stripped, first real paragraph used.
- **Aptitude Practice**: 4 categories (Numerical, Logical, Verbal, Non-Verbal), **30 seeded questions each (120 total)**, timed quiz, graded results with explanations, stats dashboard
- **Coding Platform**: **30 seeded DSA problems (13 Easy / 11 Medium / 6 Hard)** across 5 languages (C, C++, Java, Python, JavaScript) — arrays, strings, hashing, two pointers, sorting, searching, stacks, DP (LCS, coin change, LIS, trapping rain water), spanning fundamentals through interview-hard — Monaco editor, Run (custom input) and Submit (full test-suite grading via Judge0) with Accepted/Wrong Answer/Runtime Error/Compilation Error statuses
- **Study Materials**: a curated hub of free external resources (DSA, Core CS subjects, Web Dev, Aptitude, Interview Prep, UPSC), organized by category with direct links
- **History**: unified activity feed across all modules
- **Performance**: charts for coding progress, aptitude score trend, interview attempts by status, and overall activity (Recharts)

**Part 3 — AI Mock Interview**
- **Configuration**: job role, interview type (Technical/Behavioral/HR), difficulty, resume source (platform resume or PDF upload), duration
- **Question generation**: resume-aware, avoids repeating a candidate's previous questions across sessions; OpenAI-backed when a key is configured, rule-based question bank otherwise
- **Live interview**: countdown timer, live webcam feed, mic status, per-question progress, Next/Skip/End controls, continuous autosave of every answer
- **Answer input**: voice (Web Speech API, Chrome/Edge only) with an editable live transcript, or text — always available as a fallback
- **Facial analysis**: MediaPipe Face Mesh (client-side, in-browser) drives heuristic confidence, eye-contact, head-stability, smile, and expression (Confident/Neutral/Confused/Nervous) scoring, sampled continuously and saved to the session
- **Completion & report**: AI (or rule-based) feedback — technical accuracy, communication, confidence, eye contact, behavior, overall score, strengths, improvements, suggestions, and question-by-question feedback; reports are revisitable from History/Performance
- **Dashboard & History**: interview completion now feeds into the overall preparation-progress score and the unified history/performance views, with direct links from history entries to their full report
- **Error handling**: camera/mic permission denial actually pauses the interview (timer stops, controls disable) until access is granted; speech-recognition failures fall back to text input; MediaPipe init and OpenAI calls are timeout-protected and fall back gracefully instead of hanging or crashing

**Docker**: `Dockerfile` for client (multi-stage Vite build → nginx, proxies `/api` and `/uploads` to the server container) and server (Debian-based, includes the shared libraries Puppeteer's bundled Chromium needs), plus a root `docker-compose.yml` wiring client + server + MongoDB together with a named volume for persistence.

**Proctoring / anti-cheat** (final module, built after the 3-phase plan; scoped to the Mock Interview only — it's the one flow with an existing camera requirement)
Live interview sessions are monitored for five violation types: switching tabs/windows (Page Visibility API), copy, paste, right-click/context-menu, and devtools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U) — each shown as a live "warnings" counter in the interview header with a toast per incident. Each violation also captures a downsized snapshot of the current webcam frame as evidence. After 3 violations the interview auto-submits and the candidate is routed straight to their report, which includes a "Proctoring Activity" section listing every violation with its captured frame. This sits alongside the existing camera-required pause (interview already halts if webcam access is denied/revoked). Persisted per session as `InterviewSession.violations[]` (type/questionIndex/screenshot/timestamp) / `violationCount` / `autoSubmitted`.

**Placement Drive** (a fourth module, built on top of the 3-phase plan)
A gated, 6-stage simulated placement pipeline — Resume Screening → Online Assessment → Technical Interview → HR Interview → Final Evaluation → Result (Selected / On Hold / Rejected) — matching a reference "B.E/BCA Interview Process" diagram. It's an orchestration layer, not a rebuild: every stage reuses the existing engines rather than duplicating logic.
- **Resume Screening**: scores the candidate's saved resume (0–100) via `aiService`'s live-provider chain when configured, blended 50/50 with a 5-point completeness heuristic; falls back to the heuristic alone otherwise. Concrete feedback strings, not a fabricated "recruiter" persona. `>=40` advances; below that, the stage holds with a link back to the Resume Builder and is freely re-runnable.
- **Online Assessment**: 2 aptitude categories (10 real questions, through the existing quiz UI/grading) + 1 randomly-assigned Easy coding problem (through the existing Monaco editor/Judge0 grading), combined `0.6*aptitude% + 0.4*coding%`, `>=40` to advance. A fresh set is assigned on every retry.
- **Technical & HR Interview**: each stage starts a real interview session server-side (`interviewType` forced to Technical/HR) and hands off straight into the existing live interview experience — same webcam, voice, proctoring, and AI feedback as the standalone Mock Interview. Completing the interview automatically syncs the score back into the drive and returns to it (the standalone Mock Interview flow is completely unaffected — this is a single optional `?driveId=` query param).
- **Final Evaluation & Result**: weighted composite (`15% resume + 20% assessment + 35% technical + 30% HR`), verdict via thresholds (`>=75` Selected, `50–74` On Hold, `<50` Rejected) — weights and thresholds are named constants, explicitly tunable placeholders, not a researched hiring model.
- **Known, deliberate v1 gaps**: no BE/BCA-specific question pools (the existing course-agnostic banks are reused; course is a UI label only), no dedicated "Technical MCQs" bank (approximated with the coding stage), assessment timer is client-side only, no retry cooldown (indefinitely retryable, by design, for a self-serve tool).

## Verified
- `npm run build` succeeds in `client/` (Monaco, Recharts, and MediaPipe's vision bundle are all code-split into on-demand chunks — Part 3's live interview page and Part 2's coding editor and performance charts only load their heavy dependencies when actually visited)
- All server files pass `node --check`
- **Part 1**: 28/28 scripted API checks against a real MongoDB + full browser UI flow, zero console errors, both themes verified visually
- **Part 2**: 23/23 scripted API checks (resume CRUD, GitHub import, PDF export verified by magic bytes, aptitude grading, coding run/submit against Judge0 with all four status outcomes, interview config, history, dashboard progress) + full browser UI flow across every page, zero console errors
- **Part 3**: 16/16 scripted API checks (question generation with no within-session or cross-session duplicates, answer/skip turns, metrics recording, report generation, history/dashboard integration) run in mock-AI mode (no OpenAI key) + full browser UI flow through an entire live interview — camera/mic granted via Chromium's fake-device flags, MediaPipe genuinely initializing, report page rendering correctly, zero console errors. **Correction (found later, see bug #5 below):** the "no face" result this pass reported was actually a false negative from a stream-attachment race, not real face-tracking against the synthetic feed — fixed during the proctoring work; re-verified afterward with genuine frames flowing.
- **Docker**: both images built and the full stack (`mongo` + `server` + `client`) actually run together — verified with a live health check, a live register→resume-update→**PDF export** round trip against the containerized Puppeteer (the highest-risk part of the Docker setup), and the nginx `/api` proxy
- **Proctoring**: 32/32 scripted API checks across two passes (invalid violation type rejection, violation counting for all 5 violation types, auto-submit trigger at exactly 3 violations, session completion marking `autoSubmitted: true`, violations rejected once a session is no longer in-progress, violation counts don't leak across sessions, screenshot evidence round-trips intact through the report endpoint) + two full browser UI flows — copy/paste and right-click/devtools-shortcut blocking verified with real DOM events, tab-switch verified by exercising the same `visibilitychange` code path a real tab switch triggers (headless Chromium under CDP can't simulate genuine OS-level tab focus — a documented limitation of the Page Visibility API in headless testing, not of the app), confirming the warning counter increments 1/3 → 2/3 → 3/3, the interview auto-submits and redirects to the report, and the report's "Proctoring Activity" section renders each violation with its captured webcam frame, zero console errors
- **Live AI providers**: each of Groq, Gemini, Mistral, and OpenRouter verified with real API calls (not mocked) — a standalone test of `aiService.js`'s fallback chain forced each provider to be the one that responds (by withholding the keys ahead of it in priority order) and confirmed correct results from all 4, plus the final mock fallback when none are configured. Then a full end-to-end interview — register → config → **live question generation** → answer all 5 → **live feedback generation** → report — run against the real Groq API end-to-end, confirming genuinely AI-generated (non-canned) questions, a populated report with `generatedByAI: true` and `aiProvider: "groq"`, and a matching result on re-fetch
- **Expanded content banks**: all 30 coding problems' starter code and test cases verified against real Judge0 executions before being committed (reference Python solutions run for every new problem; the trickiest input-parsing patterns additionally compile-checked across Java/C++/C); all 120 aptitude questions checked by independent computation (a standalone Python script re-derived every numeric/logical answer and confirmed all 72 spot-checked cases match) with a final pass confirming zero exact-duplicate question text
- **Placement Drive**: 36/36 scripted API checks covering the full lifecycle — idempotent drive creation, resume-screening fail→pass paths, the 409 stage-gate on every out-of-order call, a 100%-scored assessment (real aptitude answers verified against the DB, a real accepted coding submission), both interview stages reusing the live interview engine end-to-end, the final weighted-score formula validated against the documented weights, and history/dashboard integration — plus two full Playwright passes: one full click-through (registration → resume pre-seed → drive start → auto-passing resume screening → assessment UI including a real failure+retry cycle) and one targeted pass proving the drive↔live-interview handoff specifically (real webcam/proctoring session launched with the correct `driveId`, completing it correctly routes back into the drive instead of the standalone report, and the drive stage advances)

### Real bugs caught and fixed during this verification process (not just written and assumed correct)
1. Puppeteer's `page.pdf()` resolves a `Uint8Array`, not a Node `Buffer` — Express silently JSON-serialized it instead of sending raw PDF bytes until wrapped in `Buffer.from()`.
2. Several Resume Builder form fields were missing `id`/`htmlFor` label association (accessibility bug).
3. The mock interview-question generator could pick the same question twice within one session when a difficulty bucket was smaller than the questions-per-session count — fixed the selection algorithm and expanded the question bank.
4. MediaPipe face-tracking initialization had no timeout — a slow/blocked CDN would leave the UI stuck on "Starting facial analysis..." forever instead of falling back gracefully.
5. **(Found while building proctoring's screenshot capture, but pre-existing since Part 3.)** The webcam-start effect in `LiveInterviewPage` ran on mount with an empty dependency array — but on mount, the interview session hasn't loaded yet, so the component renders `<LoadingScreen>` (no `<video>` element at all) and `videoRef.current` is `null` at that exact instant. Since the effect captured that `null` value in its closure, the camera stream was assigned nowhere once the session *did* load and the real `<video>` element appeared — MediaPipe was consistently running against a video element with no stream ever attached (`readyState: 0` indefinitely), meaning **every "No face detected" result throughout Part 3's verification was a false negative from a dead video feed, not a real face-tracking readout.** Fixed by re-keying the effect on `session` so it only fires once the real DOM (including `<video ref={videoRef}>`) exists. Re-verified: the fake test camera now attaches within 500ms (`readyState: 4`, real 640×480 frames), and confidence/eye-contact scoring is running against genuine frames for the first time. A second, smaller bug in the same effect — its metrics callback captured `currentIndex` from the initial render only, so every confidence sample was permanently tagged `questionIndex: 0` regardless of which question was actually active — was fixed in the same pass by reading from a ref instead.
6. **(Found the moment live AI providers were actually connected — never triggered by mock mode, since it only handles real LLM output.)** `generateFeedback` passed the LLM's JSON response straight into a Mongoose save without validating field types. Groq's `llama-3.3-70b` occasionally returned `"behavior": {"confidence": 0, "eyeContact": 0}` — a nested object instead of a number, apparently confused by the same prompt separately mentioning webcam-derived confidence/eye-contact scores — which crashed `completeSession` with a Mongoose `CastError` and left the session stuck (never marked completed, no report). Fixed by coercing every AI-returned score through a `toScore()` helper (clamps to a valid 0–100 number, defaults to 0 for anything else) and filtering non-string entries out of `strengths`/`improvements`/`suggestions`/question feedback text before they reach the database. This is a general lesson for this codebase: **LLM output is untrusted input and needs the same boundary validation as any external API response, not just a "trust the schema I asked for" try/catch.**
7. **(Found by the scripted Placement Drive test, before any UI ever touched it.)** `PlacementDrive`'s `currentStage` enum uses snake_case (`technical_interview`) but the corresponding embedded subdocument fields are camelCase (`technicalInterview`/`hrInterview`) — both `placementDriveService.js` and the client's `InterviewStage.jsx` originally did `drive[stage]` expecting that to resolve to the subdocument, silently reading `undefined` instead and crashing on the next property access. Fixed with an explicit `STAGE_FIELD` lookup map on both sides rather than relying on the two naming schemes coincidentally lining up.

## Known infrastructure notes
- **Code execution**: the Piston public API (originally planned) went whitelist-only in Feb 2026. The coding platform uses Judge0's free public CE demo instance (`ce.judge0.com`) instead — no API key required, but it's a shared community instance with no uptime guarantee. Point `JUDGE0_BASE_URL` at a self-hosted or paid instance for production use.
- **Speech-to-text**: the Web Speech API only works in Chromium-based browsers (Chrome/Edge) — Firefox/Safari users can still type their answers.
- **Confidence/eye-contact/expression scoring** is a heuristic built from MediaPipe's landmark and blendshape output (head stability, smile frequency, gaze deviation, brow/frown tension), not a clinically validated measurement.

## Proctoring status
Anti-cheat/proctoring (tab-switch detection, copy/paste blocking, violation counter with auto-submit, webcam-required enforcement) was shown in the original planning diagram, intentionally deferred out of Parts 1–3, and has now been built as the final module — see "Proctoring / anti-cheat" above.
