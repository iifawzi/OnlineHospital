const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');
const mime = require("mime");
const limits = { fileSize: 1024 * 1024 * 20, files: 1 }; // 1MB, 1 File
const mimeTypes = ["image/png", "image/jpeg", "image/jpg"];
const { handleError, ErrorHandler } = require("../middleware/error");
const dir = "./uploadedImages";
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "./uploadedImages/");
  },
  filename: function (req, file, cb) {
    console.log("--STORAGE--");
    console.log(file);
    console.log("--STORAGE--");
    crypto.pseudoRandomBytes(6, function (err, raw) {
      cb(
        null,
        raw.toString("hex") + Date.now() + "." + mime.getExtension(file.mimetype)
      );
    });
  },
});

const fileFilter = (req, file, cb) => {
  console.log("--FILEFILTER--");
  console.log(file);
  const ext = path.extname(file.originalname);
  console.log(ext);
  console.log(file.originalname);
  console.log("--FILEFILTER--");
  if (
    mimeTypes.includes(
      file.mimetype || ext == ".png" || ext == ".jpeg" || ext == ".jpg"
    )
  ) {
    return cb(null,true);
  }
  cb(new ErrorHandler(403, "Only (JPEG, PNG, JPG) are allowed"));
};


module.exports = (
  fileFilterParam = fileFilter,
  limitsParam = limits,
  storageParam = storage
) => multer({
    fileFilter:fileFilterParam,
    storage: storageParam,
    limits:limitsParam
});
