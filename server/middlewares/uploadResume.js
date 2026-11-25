const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new ApiError(422, 'Only PDF files are accepted for resume upload'));
  }
  cb(null, true);
};

const uploadResume = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = uploadResume;
