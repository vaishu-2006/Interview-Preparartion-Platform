const puppeteer = require('puppeteer');

const renderPdfFromHtml = async (html) => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBytes = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', bottom: '0' } });
    // page.pdf() resolves a Uint8Array, not a Node Buffer — res.send() only sends raw
    // binary for a real Buffer, otherwise it silently falls back to JSON-serializing it.
    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
};

module.exports = { renderPdfFromHtml };
