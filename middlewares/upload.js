const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = nanoid();
    const filename = `${uniquePreffix}_${file.originalname}`;
    if (file.originalname.split(".").pop() === "exe") {
      cb(new Error("File extension not allow"));
    }
    cb(null, filename);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};
const fileFilter = (req, file, cb) => {
  if (file.originalname.split(".").pop() === "exe") {
    cb(new Error("File extension not allow"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = { upload };
