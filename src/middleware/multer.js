const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const upload_path =
  path.dirname(require.main.filename) + "/client/public/uploads/";
checkExtension = (file) => {
  var res = "";
  if (file.mimetype === "image/jpeg") res = ".jpg";
  if (file.mimetype === "image/png") res = ".png";
  return res;
};
const storage = multer.diskStorage({
  destination: path.resolve(upload_path),
  filename: function (req, file, cb) {
    cb(
      null,
      crypto
        .createHash("sha1")
        .update(Math.random().toString() + new Date().valueOf().toString())
        .digest("hex") + checkExtension(file)
    );
  },
});
// avatar change
exports.avatar = multer({
  storage,
  limits: { fileSize: 10485760, files: 1 }, // limit 10mb
}).fields([{ name: "avatar", maxCount: 1 }]);
// id upload
exports.verify = multer({
  storage,
  limits: { fileSize: 10485760, files: 2 }, // limit 10mb
}).fields([
  { name: "front", maxCount: 1 },
  { name: "back", maxCount: 1 },
]);

/* 
    todo:
-fix error handling 
*/
