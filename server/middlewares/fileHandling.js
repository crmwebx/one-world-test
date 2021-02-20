const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     console.log("file details123 ", req.file);
//     var datetimestamp = Date.now();

//     cb(null, file.originalname);
//   },
// });
const fileUpload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    console.log("file", file);
    if (
      ext !== ".pdf" &&
      ext !== ".doc" &&
      ext !== ".docx" &&
      ext !== ".jpg" &&
      ext !== ".xlsx"
    ) {
      return callback(
        new Error("Only Document type pdf/doc/docx/jpg/xlsx allowed")
      );
    }
    callback(null, true);
  },
  limits: {
    //file size limited to 5mb
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = {
  fileUpload,
};
