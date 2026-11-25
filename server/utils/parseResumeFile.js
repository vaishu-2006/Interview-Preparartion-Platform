const fs = require('fs/promises');
const { PDFParse } = require('pdf-parse');

const parseResumePdf = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  try {
    const { text } = await parser.getText();
    return text.trim();
  } finally {
    await parser.destroy();
  }
};

module.exports = { parseResumePdf };
