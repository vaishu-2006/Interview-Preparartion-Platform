const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const listBlock = (title, items) => {
  if (!items?.length) return '';
  return `<h3>${escapeHtml(title)}</h3><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
};

const scoreBar = (label, value) =>
  `<div class="score-row"><span>${escapeHtml(label)}</span><div class="bar"><div class="bar-fill" style="width:${Math.max(
    0,
    Math.min(100, value || 0)
  )}%"></div></div><span class="score-value">${value ?? 0}%</span></div>`;

const baseStyles = `
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #17202a; margin: 0; padding: 40px; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 28px 0 10px; border-bottom: 1px solid #dfe3e8; padding-bottom: 6px; }
  h3 { font-size: 13px; margin: 16px 0 6px; color: #3d3d3d; }
  .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
  .stat-grid { display: flex; gap: 16px; margin: 16px 0; }
  .stat-card { flex: 1; border: 1px solid #dfe3e8; border-radius: 10px; padding: 14px; text-align: center; }
  .stat-value { font-size: 26px; font-weight: 700; color: #1b8a6e; }
  .stat-label { font-size: 11px; color: #6b7280; margin-top: 4px; }
  ul { margin: 4px 0; padding-left: 18px; font-size: 13px; line-height: 1.6; }
  .score-row { display: flex; align-items: center; gap: 10px; font-size: 12px; margin: 6px 0; }
  .score-row span:first-child { width: 140px; flex-shrink: 0; color: #3d3d3d; }
  .score-value { width: 40px; text-align: right; flex-shrink: 0; }
  .bar { flex: 1; height: 7px; border-radius: 4px; background: #eef0f2; overflow: hidden; }
  .bar-fill { height: 100%; background: #1b8a6e; }
  .verdict { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-top: 4px; }
  .verdict.Selected { background: #e3f6ee; color: #1b8a6e; }
  .verdict.OnHold { background: #fdf3e0; color: #a87a2a; }
  .verdict.Rejected { background: #fbe9e9; color: #c43e3e; }
  .footer { margin-top: 32px; font-size: 10px; color: #9aa1a9; }
`;

const buildInterviewReportHtml = (report) => `
<html><head><meta charset="utf-8" /><style>${baseStyles}</style></head><body>
  <h1>${escapeHtml(report.jobRole)} &middot; ${escapeHtml(report.interviewType)} Interview Report</h1>
  <p class="subtitle">Difficulty: ${escapeHtml(report.difficulty)} &middot; Generated ${new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-value">${report.overallScore}%</div><div class="stat-label">Overall Score</div></div>
    <div class="stat-card"><div class="stat-value">${report.confidence}%</div><div class="stat-label">Confidence</div></div>
    <div class="stat-card"><div class="stat-value">${report.eyeContact}%</div><div class="stat-label">Eye Contact</div></div>
  </div>

  <h2>Score Breakdown</h2>
  ${scoreBar('Technical Accuracy', report.technicalAccuracy)}
  ${scoreBar('Communication', report.communication)}
  ${scoreBar('Confidence', report.confidence)}
  ${scoreBar('Eye Contact', report.eyeContact)}
  ${scoreBar('Behavior', report.behavior)}

  <h2>Feedback</h2>
  ${listBlock('Strengths', report.strengths)}
  ${listBlock('Areas to Improve', report.improvements)}
  ${listBlock('Suggestions for Next Time', report.suggestions)}

  <div class="footer">Generated ${report.generatedByAI ? `by AI (${escapeHtml(report.aiProvider)})` : 'using rule-based scoring — no AI key configured'}.</div>
</body></html>`;

const buildDriveReportHtml = (drive, technicalReport, hrReport) => {
  const confidenceEntries = [technicalReport, hrReport].filter(Boolean);
  const avgConfidence = confidenceEntries.length
    ? Math.round(confidenceEntries.reduce((s, r) => s + (r.confidence || 0), 0) / confidenceEntries.length)
    : null;

  return `
<html><head><meta charset="utf-8" /><style>${baseStyles}</style></head><body>
  <h1>${escapeHtml(drive.jobRole)} &middot; Placement Drive Report</h1>
  <p class="subtitle">${escapeHtml(drive.course)}${drive.branch ? ' &middot; ' + escapeHtml(drive.branch) : ''} &middot; Generated ${new Date().toLocaleDateString()}</p>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-value">${drive.finalEvaluation?.overallScore ?? 0}%</div>
      <div class="stat-label">Overall Score</div>
      ${drive.finalEvaluation?.verdict ? `<div class="verdict ${drive.finalEvaluation.verdict}">${drive.finalEvaluation.verdict}</div>` : ''}
    </div>
    ${
      avgConfidence !== null
        ? `<div class="stat-card"><div class="stat-value">${avgConfidence}%</div><div class="stat-label">Avg. Interview Confidence</div></div>`
        : ''
    }
  </div>

  <h2>Stage Scores</h2>
  ${scoreBar('Resume Screening', drive.resumeScreening?.score)}
  ${scoreBar('Online Assessment', drive.onlineAssessment?.score)}
  ${scoreBar('Technical Interview', drive.technicalInterview?.overallScore)}
  ${scoreBar('HR Interview', drive.hrInterview?.overallScore)}

  ${
    drive.resumeScreening?.feedback?.length
      ? `<h2>Resume Feedback</h2>${listBlock('', drive.resumeScreening.feedback)}`
      : ''
  }

  ${
    technicalReport
      ? `<h2>Technical Interview — What to Improve Next</h2>
         <p class="subtitle">Confidence: ${technicalReport.confidence}% &middot; Eye Contact: ${technicalReport.eyeContact}%</p>
         ${listBlock('Improvements', technicalReport.improvements)}
         ${listBlock('Suggestions', technicalReport.suggestions)}`
      : ''
  }

  ${
    hrReport
      ? `<h2>HR Interview — What to Improve Next</h2>
         <p class="subtitle">Confidence: ${hrReport.confidence}% &middot; Eye Contact: ${hrReport.eyeContact}%</p>
         ${listBlock('Improvements', hrReport.improvements)}
         ${listBlock('Suggestions', hrReport.suggestions)}`
      : ''
  }

  <div class="footer">This report reflects the full gated Placement Drive pipeline: Resume Screening, Online Assessment, Technical Interview, HR Interview, and Final Evaluation.</div>
</body></html>`;
};

module.exports = { buildInterviewReportHtml, buildDriveReportHtml };
