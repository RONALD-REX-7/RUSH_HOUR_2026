const multer = require('multer');
const { MAX_FILE_SIZE } = require('../config/constants');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only JPEG, PNG, JPG, WEBP are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

module.exports = upload;
