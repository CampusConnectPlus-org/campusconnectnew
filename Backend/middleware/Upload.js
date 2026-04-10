const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes("alumni")) {
      cb(null, "alumniimage/");
    }
     else if (req.originalUrl.includes("events")) {

      cb(null, "uploads/events/");

    }else {
      cb(null, "uploads/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//     if (req.originalUrl.includes("alumni")) {
//       cb(null, "alumniimage/");
//     } else {
//       cb(null, "uploads/");
//     }

//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });