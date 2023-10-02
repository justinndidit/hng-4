const multer = require("multer");
const path = require("path");
// const crypto = require("crypto");
// const { GridFsStorage } = require("multer-gridfs-storage");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "upload"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file Type, only video files are supported"));
  }
};

const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  // limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  upload,
};
