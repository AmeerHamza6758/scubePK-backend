const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.resolve(__dirname, "../../public/assets");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(file, uploadPath, "This is file multer");
    const uniquePath = Date.now() + "-" + file.originalname;
    cb(null, uniquePath);
  },
});
const upload = multer({
  storage: storage,
  
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!acceptedFileTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, PNG and JPG are allowed."),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
