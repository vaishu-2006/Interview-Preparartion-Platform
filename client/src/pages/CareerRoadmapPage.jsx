import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import careerRoadmapService from '../services/careerRoadmapService';

// Generic, curated guidance — a common path many students follow, not a personalized
// prediction or a guarantee. Every "do this" links back to the actual platform section that
// covers it, so it's actionable rather than just text. Deliberately long-form: each stage is a
// real checklist (points + focus skills + a milestone to self-check against), not a one-liner.
const ROADMAP_BE = [
  {
    year: 'Year 1 · Semester 1–2 — Foundations & Habits',
    tagline: 'Before DSA, before projects — build the habits that make everything else easier.',
    icon: 'graduationCap',
    points: [
      'Pick ONE language (Python, Java, or C++) and get comfortable with it end-to-end — syntax fluency isn\'t the bottleneck later, problem-solving is.',
      'Learn how a program actually runs: memory, stack vs heap, time and space complexity basics — this pays off the moment you touch DSA seriously.',
      'Build a daily habit of solving 1–2 easy coding problems, even 15 minutes counts. Consistency beats marathon weekend sessions.',
      'Get comfortable with Git and GitHub — commit small, commit often, write real commit messages. Every recruiter will look at this later.',
      'Start a rough log of what you\'re learning — you\'ll thank yourself when writing your resume in Year 3.',
      "Don't chase every language or framework you hear about — depth in fundamentals beats breadth this early.",
    ],
    skills: ['Programming fundamentals', 'Time & space complexity', 'Git & GitHub', 'Linux / CLI basics'],
    milestone:
      'By the end of Year 1: you can write a working program from scratch in your chosen language, explain Big-O for basic operations, and have a GitHub profile with real commits on it.',
    links: [{ label: 'Start with Easy problems', to: '/coding' }, { label: 'Subject Prep basics', to: '/subject-prep' }],
  },
  {
    year: 'Year 2 · Semester 3–4 — Core CS + First Real Projects',
    tagline: 'This is where "student who codes" starts turning into "engineer."',
    icon: 'cpu',
    points: [
      'Go deep on core subjects — Data Structures, Operating Systems, DBMS, Computer Networks. These aren\'t just exam subjects, they\'re the bulk of what technical interviews actually test.',
      'Move from Easy to Medium coding problems on arrays, strings, hashing, and recursion — this is where real pattern-recognition starts forming.',
      'Learn SQL properly — write real joins and aggregations, not just SELECT * — almost every technical round includes at least one DB question.',
      'Build your first 1–2 real projects (a CRUD app, a small tool you\'d actually use yourself) and push them to GitHub with a proper README.',
      "Start following 2–3 companies or roles you're genuinely interested in so your prep has a direction, not just \"grind everything.\"",
      'Create a resume draft now, even if it\'s thin — iterating on a document beats writing one from scratch under pressure in Year 3.',
    ],
    skills: ['DSA: arrays, strings, recursion, hashing', 'OS & DBMS fundamentals', 'SQL', 'Git workflows', 'Basic system-design vocabulary'],
    milestone: 'By the end of Year 2: 100+ problems solved, 1–2 real projects on GitHub, core CS subjects covered at an interview-answerable level.',
    links: [{ label: 'Medium coding problems', to: '/coding' }, { label: 'Subject Prep', to: '/subject-prep' }, { label: 'Resume Builder', to: '/resume' }],
  },
  {
    year: 'Year 3 · Semester 5 — DSA Depth & Aptitude Ramp-Up',
    tagline: 'The hardest technical stretch — and the one that separates prepared candidates from the rest.',
    icon: 'chart',
    points: [
      'Go deep on trees, graphs, dynamic programming, and greedy algorithms — this is the core of most product-company interview loops.',
      "Start aptitude practice now, not in Year 4 — quant, logical reasoning, and verbal rounds are often the very first filter, and they reward steady practice over cramming.",
      'Join the Weekend Coding Contest regularly — timed contest pressure is a genuinely different skill from untimed practice, and it\'s the closest thing to a real interview clock.',
      "Start reading other people's code — open-source repos, editorial solutions after you've attempted a problem yourself — pattern exposure accelerates learning a lot.",
      "Take your first 1–2 mock interviews, even if you feel underprepared — the earlier you see your actual gaps, the more time you have to close them.",
      'Begin tracking your weak areas on Performance and revisit them deliberately instead of only practicing what\'s already comfortable.',
    ],
    skills: ['Trees & graphs', 'Dynamic programming', 'Greedy algorithms', 'Quant & logical aptitude', 'Contest-speed problem solving'],
    milestone: 'By the end of Semester 5: comfortable attempting Medium/Hard problems under time pressure, aptitude accuracy trending up on Performance.',
    links: [{ label: 'Weekend Contest', to: '/contest' }, { label: 'Aptitude practice', to: '/practice' }, { label: 'Take a Mock Interview', to: '/mock-interview' }],
  },
  {
    year: 'Year 3 · Semester 6 — Projects, Resume & Early Interviews',
    tagline: 'Turn everything you\'ve built into something a recruiter can actually evaluate.',
    icon: 'laptop',
    points: [
      "Build one project that's genuinely substantial — something with a real backend, a database, and a deployed live link, not just a tutorial clone.",
      'Get your resume ATS-checked and tightened now, months before placement season — a resume that gets rejected by a parser never reaches a human.',
      'Start applying for internships seriously — an internship on your resume before final placements changes how recruiters read everything else on it.',
      'Run a full Placement Drive simulation end-to-end, resume screening through HR round, so the real process has no surprises left in it.',
      'Get comfortable explaining your own projects out loud — "walk me through this" is asked in almost every interview and is rarely practiced enough.',
      'Start company-specific prep for 2–3 target companies — company-tagged problems on the Coding page show what others have actually reported being asked.',
    ],
    skills: ['System design basics', 'Deployment (Render / Vercel / Railway)', 'Behavioral storytelling (STAR method)', 'ATS-optimized resume writing'],
    milestone: 'By the end of Semester 6: ATS-clean resume, one deployed flagship project, at least one internship applied to — ideally landed.',
    links: [{ label: 'ATS Checker', to: '/ats-checker' }, { label: 'Placement Drive', to: '/placement-drive' }, { label: 'Jobs & Internships', to: '/jobs' }],
  },
  {
    year: 'Year 4 · Semester 7 — Interview-Ready Sprint',
    tagline: 'Stop learning new topics. Start making sure what you know is reliable under pressure.',
    icon: 'mic',
    points: [
      "Shift from \"learning new topics\" to \"polishing what you already know\" — this late, breadth loses to reliability under pressure.",
      'Take mock interviews weekly, not once — the feedback compounds, and composure on camera is itself a trainable skill.',
      "Do full timed mock tests under proctored conditions so the real assessment format isn't the first time you've seen those constraints.",
      "Revisit your weakest topic from Performance one more time — don't let a known gap survive into the actual season untouched.",
      'Prepare a tight 60–90 second self-introduction and 4–5 well-rehearsed project and behavioral stories — these get reused across almost every interview.',
      'Refresh your resume one final time with anything new — internship results, contest rank, certifications, badges.',
    ],
    skills: ['Mock interview stamina', 'Timed problem solving', 'HR & behavioral rounds', 'Resume finalization'],
    milestone: 'By the start of placement season: 5+ mock interviews completed, a full mock test attempted at least twice, resume finalized.',
    links: [{ label: 'Mock Interview', to: '/mock-interview' }, { label: 'Mock Tests', to: '/mock-tests' }, { label: 'Performance', to: '/performance' }],
  },
  {
    year: 'Year 4 · Semester 7–8 — Placement Season',
    tagline: 'Execution mode. The prep work is mostly done — now it\'s about consistency under real stakes.',
    icon: 'target',
    points: [
      "Apply broadly through Jobs while going deep on your top 2–3 target companies — breadth protects you, depth wins you the ones you actually want.",
      "Track every application's stage so you always know what's next instead of scrambling the night before a round.",
      "Treat every real interview, even for a company you're unsure about, as practice for the ones you want most.",
      "Keep solving daily even during the season — momentum is easy to lose and hard to rebuild mid-cycle.",
      "Debrief yourself after every round, cleared or not — what tripped you up is the most valuable data you'll get all season.",
      'Lean on your network — Referral Board and Study Groups exist because peers going through the same season see openings and give feedback you won\'t get alone.',
    ],
    skills: ['Interview stamina across multiple companies', 'Negotiation basics', 'Staying consistent under rejection'],
    milestone: 'Through placement season: at least one offer in hand — or a clear, honest read on why not yet. See the next stage for that.',
    links: [{ label: 'Jobs & Applications', to: '/jobs' }, { label: 'Referral Board', to: '/referrals' }, { label: 'Study Groups', to: '/study-groups' }],
  },
  {
    year: 'Post-Offer — Bridge the Gap',
    tagline: 'The easiest uninterrupted stretch of learning you\'ll get for years. Don\'t waste it.',
    icon: 'checkCircle',
    points: [
      "Don't stop learning the moment you get an offer — the gap between placement and joining is a rare, low-pressure window to get genuinely ahead.",
      "Strengthen whatever your new role will actually need — a backend role rewards SQL and system-design depth, a data role rewards stats and ML fundamentals.",
      'Keep your coding streak alive — the muscle atrophies faster than people expect, and you may still have a technical bar to clear during onboarding.',
      "Start building workplace-adjacent skills — technical writing, reading unfamiliar codebases, giving and receiving code review — none of which college teaches directly.",
      'If you have a real gap of a few months, consider a small open-source contribution or a capstone project — it\'s a strong story for your next move too.',
    ],
    skills: ['Onboarding readiness', 'Role-specific system design', 'Professional communication'],
    milestone: 'By joining day: skills matched to your actual role, coding habit still intact, one gap-period project or contribution you can point to.',
    links: [{ label: 'Performance self-check', to: '/performance' }, { label: 'Keep coding', to: '/coding' }],
  },
  {
    year: "If You're Not Placed Yet — Recovery Plan",
    tagline: 'Common, not a verdict on you. Timing depends on a lot more than just preparation.',
    icon: 'repeat',
    points: [
      "This is common, not a verdict on you — placement timing depends on company visits, branch, CGPA cutoffs, and plain luck as much as preparation.",
      "Do an honest audit: pull up Performance and find the actual pattern in the rejections — resume-stage, aptitude-stage, technical-stage, or HR-stage — and fix that specific stage, not everything at once.",
      'Widen the net deliberately — off-campus drives, contract-to-hire roles, smaller product companies, and referrals often move faster than campus cycles.',
      "Keep a visible project shipping in the background — a live GitHub contribution graph is one of the strongest recovery signals a resume can show.",
      "Set a review cadence, for example every 2 weeks, rather than grinding blindly — reassess what's working and drop what isn't.",
      "Talk to seniors or peers who've been through this exact stretch in Study Groups — the emotional weight is real, and you don't have to carry it alone.",
    ],
    skills: ['Root-cause self-review', 'Off-campus & referral applications', 'Sustained momentum'],
    milestone: "Next cycle: a specific, evidence-based fix for your actual weak stage — not a vague \"try harder.\"",
    links: [{ label: 'Performance', to: '/performance' }, { label: 'Referral Board', to: '/referrals' }, { label: 'Study Groups', to: '/study-groups' }],
  },
];

const ROADMAP_BCA = [
  {
    year: 'Year 1 — Programming & Web Foundations',
    tagline: 'BCA moves toward applications fast — start building things early, not just studying theory.',
    icon: 'graduationCap',
    points: [
      'Get solid in one programming language (Python, Java, or C) and, in parallel, learn HTML, CSS, and JavaScript — the two tracks reinforce each other.',
      'Understand the basics of how the web works: client vs server, HTTP requests, what a browser actually does with your HTML/CSS/JS.',
      'Build tiny static pages and small scripts regularly — a personal profile page, a simple calculator, a to-do list — output over passive tutorial-watching.',
      'Get comfortable with Git and GitHub from day one — every project after this should live there.',
      'Start solving 1–2 easy coding problems a few times a week to build logical-thinking muscle alongside the web skills.',
    ],
    skills: ['Programming fundamentals', 'HTML / CSS / JavaScript basics', 'Git & GitHub', 'How the web works'],
    milestone: 'By the end of Year 1: a few small static/JS projects live on GitHub, comfortable writing basic programs and simple web pages from scratch.',
    links: [{ label: 'Start with Easy problems', to: '/coding' }, { label: 'Programming & Web Dev Prep', to: '/subject-prep' }],
  },
  {
    year: 'Year 1–2 — Frontend + Backend Basics',
    tagline: 'From static pages to actual applications.',
    icon: 'globe',
    points: [
      'Learn a frontend framework (React is the most in-demand right now) — components, state, props, and how data flows through an app.',
      'Learn a backend runtime/framework (Node.js + Express is a common, well-supported pairing) and build simple REST APIs.',
      'Understand request/response cycles end-to-end: a button click on the frontend triggering an API call, hitting a server, and returning data.',
      'Start reading documentation directly instead of only following video tutorials — it\'s a skill you\'ll need constantly on the job.',
      "Rebuild one of your Year 1 static projects as a full frontend-plus-backend app — the delta between the two versions is a great growth marker.",
    ],
    skills: ['React fundamentals', 'Node.js & Express', 'REST APIs', 'Reading documentation'],
    milestone: 'By mid Year 2: can build a small full-stack app from scratch — a frontend that talks to a real backend API, even without a database yet.',
    links: [{ label: 'Programming & Web Dev Prep', to: '/subject-prep' }, { label: 'Coding practice', to: '/coding' }],
  },
  {
    year: 'Year 2 — Databases & Full-Stack Projects',
    tagline: 'Persistence is what turns a demo into a real application.',
    icon: 'database',
    points: [
      'Learn SQL thoroughly (MySQL or PostgreSQL) — schema design, joins, aggregations — plus the basics of a NoSQL option like MongoDB and when each fits.',
      'Connect your backend to a real database and build full CRUD flows — create, read, update, delete — the backbone of almost every application.',
      'Build 2–3 complete full-stack projects: something like a blog, a small e-commerce cart, or a booking app — pick ones you\'d actually explain with enthusiasm in an interview.',
      'Deploy at least one project live (Render, Vercel, Railway) — a working link beats a local-only repo every time a recruiter looks at your GitHub.',
      "Start writing real READMEs for every project — what it does, the stack used, and how to run it. This is often the first thing a reviewer actually reads.",
    ],
    skills: ['SQL & relational schema design', 'MongoDB basics', 'Full CRUD applications', 'Deployment'],
    milestone: 'By the end of Year 2: 2–3 deployed full-stack projects with databases behind them, each with a clear README.',
    links: [{ label: 'Resume Builder', to: '/resume' }, { label: 'Subject Prep', to: '/subject-prep' }],
  },
  {
    year: 'Year 2–3 — DSA for Interviews + Aptitude',
    tagline: 'BCA interviews lean more applied than a typical B.E. loop, but DSA fundamentals still show up everywhere.',
    icon: 'chart',
    points: [
      "Cover core DSA — arrays, strings, linked lists, stacks/queues, basic trees, and recursion — you don't need the same graph/DP depth as a core-CS track, but these fundamentals are still asked constantly.",
      'Start aptitude practice consistently — quant, logical reasoning, verbal — these rounds are common in service-based and product-company hiring alike.',
      'Join the Weekend Coding Contest to build speed and comfort with a ticking clock, even at Easy/Medium difficulty.',
      'Start tracking your weak areas on Performance so your practice time goes where it\'s actually needed.',
      "Take your first mock interview around this point — seeing your real gaps early leaves you time to close them before final year.",
    ],
    skills: ['Core DSA (arrays, strings, lists, stacks/queues, trees)', 'Quant & logical aptitude', 'Contest-speed practice'],
    milestone: 'By the end of Year 2 going into Year 3: consistent Easy/Medium solve rate, aptitude accuracy trending up, at least one mock interview done.',
    links: [{ label: 'Coding practice', to: '/coding' }, { label: 'Weekend Contest', to: '/contest' }, { label: 'Aptitude practice', to: '/practice' }],
  },
  {
    year: 'Year 3 — Portfolio, Resume & Internships',
    tagline: 'Your projects ARE your credibility in an applications-focused course — make them count.',
    icon: 'laptop',
    points: [
      'Build one flagship project that goes beyond CRUD — authentication, file uploads, real-time features (chat/notifications), or a third-party API integration.',
      'Get your resume ATS-checked well before placement season — for an applications-focused profile, project descriptions carry even more weight than usual.',
      'Apply for internships actively — a real internship, even a short one, is one of the strongest signals a BCA resume can carry.',
      'Run a full Placement Drive simulation end-to-end so the actual process has no surprises left in it.',
      "Practice explaining your projects' architecture out loud — what talks to what, and why you made the choices you did.",
    ],
    skills: ['Authentication & authorization', 'Third-party API integration', 'ATS-optimized resume writing', 'Project architecture explanation'],
    milestone: 'By the end of Year 3: ATS-clean resume, one standout flagship project, at least one internship applied to — ideally landed.',
    links: [{ label: 'ATS Checker', to: '/ats-checker' }, { label: 'Placement Drive', to: '/placement-drive' }, { label: 'Jobs & Internships', to: '/jobs' }],
  },
  {
    year: 'Final Year — Interview-Ready Sprint',
    tagline: 'Polish, don\'t sprawl. Reliability under pressure beats one more new framework.',
    icon: 'mic',
    points: [
      'Take mock interviews weekly and get comfortable narrating your own code and decisions under questioning.',
      'Do full timed mock tests under proctored conditions so the format itself is familiar before it counts.',
      "Revisit your weakest DSA or aptitude area from Performance one more time before the season starts.",
      'Prepare a tight self-introduction plus 4–5 rehearsed project and behavioral stories you can reuse across interviews.',
      'Refresh your resume with anything new from this final stretch — internship outcomes, certifications, contest results.',
    ],
    skills: ['Mock interview stamina', 'Timed problem solving', 'HR & behavioral rounds'],
    milestone: 'By the start of placement season: 5+ mock interviews completed, a full mock test attempted at least twice, resume finalized.',
    links: [{ label: 'Mock Interview', to: '/mock-interview' }, { label: 'Mock Tests', to: '/mock-tests' }, { label: 'Performance', to: '/performance' }],
  },
  {
    year: 'Placement Season',
    tagline: 'Execution mode — the prep work is largely done.',
    icon: 'target',
    points: [
      'Apply broadly through Jobs while going deep on 2–3 companies you actually want.',
      "Track every application's stage so you're never scrambling to remember what's next.",
      'Keep coding daily even during the season to protect the momentum you built.',
      "Debrief yourself honestly after every round, cleared or not.",
      'Use Referral Board and Study Groups — peers in the same season surface openings and feedback you won\'t get alone.',
    ],
    skills: ['Interview stamina across multiple companies', 'Staying consistent under rejection'],
    milestone: 'Through placement season: at least one offer in hand, or a clear read on which stage to fix next.',
    links: [{ label: 'Jobs & Applications', to: '/jobs' }, { label: 'Referral Board', to: '/referrals' }, { label: 'Study Groups', to: '/study-groups' }],
  },
  {
    year: "If You're Not Placed Yet — Recovery Plan",
    tagline: 'Common, not a verdict on you.',
    icon: 'repeat',
    points: [
      'Audit honestly using Performance — find whether rejections cluster at resume, aptitude, technical, or HR stage, and fix that stage specifically.',
      'Widen the net — off-campus drives, startups, contract roles, and referrals often move faster than a single campus cycle.',
      'Keep shipping a visible project in the background — an active GitHub is one of the strongest recovery signals available.',
      'Set a review cadence, for example every 2 weeks, instead of grinding without direction.',
      "Talk to peers going through the same stretch in Study Groups — you don't have to carry this alone.",
    ],
    skills: ['Root-cause self-review', 'Off-campus & referral applications', 'Sustained momentum'],
    milestone: "Next cycle: a specific, evidence-based fix for your actual weak stage — not a vague \"try harder.\"",
    links: [{ label: 'Performance', to: '/performance' }, { label: 'Referral Board', to: '/referrals' }, { label: 'Study Groups', to: '/study-groups' }],
  },
];

const ROADMAP_UPSC = [
  {
    year: 'Foundation Phase (roughly 12–18 months out)',
    tagline: 'The base every later stage builds on — rushed foundations show up as gaps in Mains, not just Prelims.',
    icon: 'book',
    points: [
      'Build the NCERT-level base across History, Polity, Geography, and Economy before layering on advanced, exam-specific material.',
      'Start a daily current affairs habit early — it compounds far better than cramming it in the final months.',
      'Read one standard reference book per subject fully rather than many partially — depth on a settled source beats breadth across scattered ones.',
      'Start a habit of note-making from day one, even if rough — you will not have time to re-read full books during the revision phase.',
      "Get a rough sense of the Prelims and Mains syllabus early, so your reading has a direction instead of feeling directionless.",
      "Don't attempt the Optional subject choice casually — it carries real weight through Mains; give it a genuine, informed decision.",
    ],
    skills: ['NCERT-level base (History, Polity, Geography, Economy)', 'Daily current-affairs habit', 'Structured note-making'],
    milestone: 'By the end of the Foundation phase: one full read-through of your core subjects, a working note-making system, and a chosen Optional subject.',
    links: [{ label: 'Study Materials', to: '/study-materials' }, { label: 'Daily Current Affairs Quiz', to: '/upsc/mock-tests' }],
  },
  {
    year: 'Prelims Preparation — Static + Current Affairs',
    tagline: 'Breadth matters here — Prelims rewards wide, reliable recall over deep specialization.',
    icon: 'newspaper',
    points: [
      'Layer current affairs on top of your static-subject base — most Prelims questions blend the two rather than testing either in isolation.',
      'Take Prelims mock tests regularly to build exam temperament, not just knowledge — timing and elimination technique matter as much as facts.',
      "Review every incorrect answer's explanation carefully — the review is often worth more than the test itself.",
      'Track your weakest GS category on Performance and deliberately target it instead of re-practicing what\'s already strong.',
      'Practice elimination-based guessing on questions you\'re unsure about — Prelims has negative marking, so a disciplined approach to uncertain questions matters.',
      'Keep revisiting earlier topics on a rolling basis so nothing from months ago has faded by exam day.',
    ],
    skills: ['Static + current-affairs integration', 'Elimination technique', 'Timed accuracy under negative marking'],
    milestone: 'A few months out: consistent, steady scores across full-length Prelims mocks, with your weakest category visibly improving.',
    links: [{ label: 'Prelims Mock Tests', to: '/upsc/mock-tests' }, { label: 'Performance', to: '/performance' }],
  },
  {
    year: 'Prelims — Final Revision & Test Series (last 2–3 months)',
    tagline: 'Stop adding new material. Start tightening recall and exam-day execution.',
    icon: 'flask',
    points: [
      'Shift fully from "learning new topics" to "revising what you already know" — new material this close to the exam rarely pays off.',
      'Take full-length timed mocks under conditions as close to the real exam as possible, including the proctored format on this platform.',
      'Build a condensed personal revision set — your own notes, not someone else\'s — for the final week before the exam.',
      "Keep the daily current affairs habit going right up to the exam — it's the one area that keeps changing until exam day.",
      'Get comfortable with your own pacing — know roughly how long you can spend per question before it starts eating into your buffer.',
    ],
    skills: ['Rapid revision technique', 'Exam-day pacing', 'Full-length mock stamina'],
    milestone: 'Exam-ready: multiple full-length mocks completed at a consistent, passing-range score under real time pressure.',
    links: [{ label: 'Prelims Mock Tests', to: '/upsc/mock-tests' }, { label: 'Current Affairs', to: '/upsc/current-affairs' }],
  },
  {
    year: 'Mains Preparation — GS Papers + Optional',
    tagline: 'A different exam entirely — depth, structure, and written expression now matter as much as knowledge.',
    icon: 'pen',
    points: [
      "Once Prelims is cleared on this platform's practice bar, start the harder Mains-tier question set and shift focus toward the four GS papers plus your Optional.",
      "Practice structured answer writing regularly — content matters, but structure is what an examiner can actually assess quickly under time pressure.",
      "Build a habit of linking current affairs to static topics in your answers — Mains rewards synthesis, not just recall.",
      'Use the AI Doubt Solver to clear conceptual gaps as they come up rather than letting them quietly pile up.',
      'Give your Optional subject dedicated, ring-fenced time — it\'s easy to let GS prep crowd it out, and that\'s a common, costly mistake.',
      'Start building a small stock of examples, data points, and quotable facts you can flexibly deploy across multiple answers.',
    ],
    skills: ['Structured GS answer writing', 'Optional-subject depth', 'Current-affairs-to-static synthesis'],
    milestone: 'Mid-Mains-prep: comfortable producing a structured, on-time answer for any GS topic you\'ve covered, plus steady Optional-subject progress.',
    links: [{ label: 'Mains Mock Tests', to: '/upsc/mock-tests' }, { label: 'Answer Writing', to: '/upsc/answer-writing' }, { label: 'AI Doubt Solver', to: '/upsc/doubt-solver' }],
  },
  {
    year: 'Mains — Answer Writing Intensive (last 2 months)',
    tagline: 'Volume and feedback, not new syllabus. Write daily, review honestly.',
    icon: 'layers',
    points: [
      'Write full-length answers daily, not just outlines — the physical act of writing under time pressure is its own trainable skill.',
      "Get feedback on structure, clarity, and content from Answer Writing regularly, and actually act on the recurring notes rather than repeating the same pattern.",
      "Time yourself strictly per answer — running out of time on the real paper is one of the most common, avoidable failure modes.",
      'Revise your Optional subject notes on a tight rotation so it stays sharp alongside GS practice.',
      "Practice answer writing across the full range of question types you're likely to face — factual, analytical, opinion-based — not just your favorites.",
    ],
    skills: ['Timed full-length answer writing', 'Structured self-review', 'Optional-subject retention'],
    milestone: "Exam-ready for Mains: a full mock answer paper completed within the actual time limit, with structure and pacing under control.",
    links: [{ label: 'Answer Writing', to: '/upsc/answer-writing' }, { label: 'Mains Mock Tests', to: '/upsc/mock-tests' }],
  },
  {
    year: 'Interview / Personality Test Preparation',
    tagline: 'A different challenge again — composure and clear articulation matter more than raw knowledge here.',
    icon: 'mic',
    points: [
      'Re-read your own DAF (application form) closely — panel questions are drawn heavily from what you\'ve written about yourself.',
      'Practice articulating your opinions on current affairs and your Optional subject clearly and concisely, not just accurately.',
      "Use this platform's Mock Interview module to build general composure, clear articulation, and think-on-your-feet answering under a webcam — note that it won't replicate a UPSC board's exact panel format, but the pressure-response practice still transfers well.",
      "Practice staying calm and honest when you genuinely don't know an answer — panels often value composure and honesty over a confident guess.",
      'Discuss likely questions and practice answers with peers in Study Groups — hearing how others think through the same question sharpens your own answers.',
      'Stay updated on current affairs right up to the interview date — panels frequently probe recent events.',
    ],
    skills: ['Clear articulation under pressure', 'DAF-based self-review', 'Composure & honesty in unfamiliar questions'],
    milestone: 'Interview-ready: comfortable discussing your DAF, your Optional, and current affairs out loud, under mild pressure, without notes.',
    links: [{ label: 'Mock Interview', to: '/mock-interview' }, { label: 'Study Groups', to: '/study-groups' }, { label: 'Current Affairs', to: '/upsc/current-affairs' }],
  },
  {
    year: 'Ongoing Throughout — Stay Organized',
    tagline: 'A multi-year preparation lives or dies on organization, not just effort.',
    icon: 'calendar',
    points: [
      "Keep a running study planner instead of relying on memory for what's left to cover across static subjects, current affairs, and your Optional.",
      "Bookmark the resources you actually use regularly so you're not re-searching for them every time.",
      'Review your own progress on a fixed cadence — weekly or monthly — rather than only reacting after a bad mock score.',
      'Protect your routine during low-motivation stretches — a smaller, consistent daily effort beats sporadic, unsustainable bursts.',
    ],
    skills: ['Long-horizon planning', 'Resource organization', 'Consistency over intensity'],
    milestone: 'A living study planner that stays current, and a resource library you actually revisit instead of losing track of.',
    links: [{ label: 'Study Planner', to: '/upsc/study-planner' }],
  },
  {
    year: 'If Not Selected This Attempt — Recovery Plan',
    tagline: 'A multi-attempt exam by design. Most successful candidates did not clear it on their first try.',
    icon: 'repeat',
    points: [
      "This is common, not a verdict on you — UPSC is a multi-attempt exam by design, and most successful candidates did not clear it the first time.",
      "Do an honest audit: was it a Prelims cutoff miss, a Mains-stage weakness, or an interview-stage gap? Each has a genuinely different fix.",
      "If you cleared Prelims but not Mains, focus your next cycle heavily on structured answer-writing volume — that's the highest-leverage fix at that stage.",
      "If you reached the interview but weren't selected, work specifically on articulation and composure — the knowledge bar was already cleared.",
      'Reassess your Optional subject choice if it consistently underperforms relative to your GS scores — it\'s a legitimate, one-time strategic pivot, not a sign of failure.',
      'Talk to peers who\'ve been through a repeat attempt in Study Groups — the psychological weight of this exam is real, and shared context helps.',
    ],
    skills: ['Stage-specific root-cause review', 'Answer-writing intensification', 'Sustained multi-year motivation'],
    milestone: 'Next cycle: a specific, evidence-based fix for the exact stage that held you back — not a vague "study harder."',
    links: [{ label: 'Performance', to: '/performance' }, { label: 'Study Planner', to: '/upsc/study-planner' }, { label: 'Study Groups', to: '/study-groups' }],
  },
];

// Rotated across AI-generated stages, which come back without a curated icon of their own.
const SEARCH_STAGE_ICONS = ['graduationCap', 'cpu', 'chart', 'laptop', 'mic', 'target', 'checkCircle', 'repeat'];

const RoadmapStageCard = ({ icon, heading, tagline, points, skills, milestone, links }) => (
  <div className="card p-6">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
        <Icon name={icon} className="h-5 w-5 text-brand-500" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink-1">{heading}</h2>
        {tagline && <p className="mt-0.5 text-sm text-ink-3">{tagline}</p>}
      </div>
    </div>

    <ul className="mt-4 space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
          {p}
        </li>
      ))}
    </ul>

    {skills?.length > 0 && (
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Focus areas</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full border border-surface-border bg-surface px-2.5 py-1 text-xs text-ink-2">
              {s}
            </span>
          ))}
        </div>
      </div>
    )}

    {milestone && (
      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-gold/30 bg-gold/5 px-3.5 py-3">
        <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs text-ink-2">
          <span className="font-semibold text-ink-1">Milestone: </span>
          {milestone}
        </p>
      </div>
    )}

    {links?.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="btn-secondary px-3 py-1.5 text-xs">
            {l.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

const CareerRoadmapPage = () => {
  const course = useSelector((state) => state.dashboard.data?.course);
  const roadmap = course === 'BCA' ? ROADMAP_BCA : course === 'UPSC' ? ROADMAP_UPSC : ROADMAP_BE;

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(null); // { status: 'loading'|'ready'|'empty', role, stages, message }

  const runSearch = async (e) => {
    e.preventDefault();
    const role = query.trim();
    if (!role) return;
    setSearch({ status: 'loading', role });
    try {
      const data = await careerRoadmapService.searchRoadmap(role);
      if (data.stages?.length) {
        setSearch({ status: 'ready', role: data.role || role, stages: data.stages });
      } else {
        setSearch({ status: 'empty', role, message: data.message || 'Could not generate a roadmap for that role right now.' });
      }
    } catch (err) {
      setSearch({ status: 'empty', role, message: err.response?.data?.message || 'Failed to generate a roadmap for that role.' });
      toast.error('Failed to generate a roadmap for that role');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearch(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Career Roadmap</h1>
        <p className="mt-1 text-ink-3">
          A common path many {course || 'students'} follow — general guidance, not a personalized prediction or a guarantee.
          It's deliberately detailed: {roadmap.length} stages, each with what to focus on, the skills to build, and a
          milestone to self-check against. Use it as a working checklist and adapt the pace to your own situation.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-ink-1">Looking for a specific role?</h2>
        <p className="mt-1 text-xs text-ink-3">
          Search a role — e.g. "Backend Developer", "Data Analyst", "DevOps Engineer" — and get an AI-generated,
          stage-by-stage roadmap built specifically for it, on top of the general path below.
        </p>
        <form onSubmit={runSearch} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a role, e.g. Backend Developer"
            className="input-field flex-1"
          />
          <button type="submit" disabled={search?.status === 'loading' || !query.trim()} className="btn-primary shrink-0 px-5 text-sm">
            {search?.status === 'loading' ? 'Generating...' : 'Get Roadmap'}
          </button>
        </form>
      </div>

      {search && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink-1">
              Roadmap for "{search.role}"
            </h2>
            <button onClick={clearSearch} className="btn-secondary px-3 py-1.5 text-xs">
              Clear search
            </button>
          </div>

          {search.status === 'loading' && (
            <div className="card p-6 text-sm text-ink-3">Generating a role-specific roadmap — this can take a few seconds...</div>
          )}

          {search.status === 'empty' && (
            <div className="card flex items-start gap-2.5 p-6 text-sm text-ink-3">
              <Icon name="warning" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {search.message}
            </div>
          )}

          {search.status === 'ready' && (
            <>
              <p className="text-xs text-ink-3">
                AI-generated for this specific search — general guidance, not a personalized prediction or a guarantee.
              </p>
              {search.stages.map((stage, i) => (
                <RoadmapStageCard
                  key={i}
                  icon={SEARCH_STAGE_ICONS[i % SEARCH_STAGE_ICONS.length]}
                  heading={stage.title}
                  tagline={stage.tagline}
                  points={stage.points}
                  skills={stage.skills}
                  milestone={stage.milestone}
                />
              ))}
            </>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">
          General {course || ''} Path
        </h2>
        <div className="space-y-4">
          {roadmap.map((stage) => (
            <RoadmapStageCard
              key={stage.year}
              icon={stage.icon}
              heading={stage.year}
              tagline={stage.tagline}
              points={stage.points}
              skills={stage.skills}
              milestone={stage.milestone}
              links={stage.links}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
