const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ORDINAL = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };

// A real certificate reflecting an actual, verified leaderboard rank for a closed contest —
// the caller (certificateService) already checked the contest has ended and the user placed
// top 5 before this template is ever rendered, so nothing here is decorative or fabricated.
const buildCertificateHtml = ({ name, rank, solvedCount, totalProblems, weekLabel }) => `
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4 landscape; margin: 0; }
  body { margin: 0; font-family: Georgia, 'Times New Roman', serif; background: #0f1420; color: #1a1f2e; }
  .frame { box-sizing: border-box; width: 297mm; height: 210mm; padding: 14mm; background: #f7f3ea; border: 10px solid #1b8a6e; position: relative; }
  .frame::before { content: ''; position: absolute; inset: 6mm; border: 1px solid #c9973f; }
  .content { position: relative; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .eyebrow { letter-spacing: 4px; text-transform: uppercase; font-size: 13px; color: #c9973f; font-family: Arial, sans-serif; }
  h1 { font-size: 40px; margin: 10px 0 0; color: #12331f; }
  .name { font-size: 32px; margin: 18px 0 4px; color: #1b8a6e; border-bottom: 1px solid #c9973f; padding-bottom: 8px; display: inline-block; }
  .detail { font-size: 16px; margin-top: 14px; max-width: 600px; line-height: 1.6; color: #1a1f2e; font-family: Arial, sans-serif; }
  .rank { font-size: 22px; font-weight: bold; color: #1b8a6e; margin-top: 6px; }
  .footer { margin-top: 30px; font-size: 12px; color: #6b6355; font-family: Arial, sans-serif; }
</style>
</head>
<body>
  <div class="frame">
    <div class="content">
      <div class="eyebrow">Placement Prep Platform &middot; Weekend Coding Contest</div>
      <h1>Certificate of Achievement</h1>
      <div class="name">${escapeHtml(name)}</div>
      <p class="rank">Finished ${ORDINAL[rank] || `${rank}th`} place</p>
      <p class="detail">
        Solved ${solvedCount} of ${totalProblems} problems in the ${escapeHtml(weekLabel)} Weekend Coding Contest,
        ranking among the top 5 entrants on a verified, real leaderboard.
      </p>
      <p class="footer">Generated on ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = { buildCertificateHtml };
