const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(10, (err, name) => {
      const fname = name.toString("hex") + path.extname(file.originalname);
      cb(null, fname);
    });
  },
});

const upload = multer({ storage: storage });

module.export = upload;
