const Category = require("../models/project_category");
const Project = require("../models/project");
const { bucket } = require("../middleware/multer");
const crypto = require("crypto");
const hash = () => {
  return crypto
    .createHash("sha1")
    .update(Math.random().toString() + new Date().valueOf().toString())
    .digest("hex");
};
exports.category = (req, res) => {
  Category.find().then((result) => {
    var promises = result.map((category) => {
      return Project.find({ category: category._id }).then((result) => {
        return { category, count: result.length };
      });
    });
    Promise.all(promises).then((result) => res.json({ result }));
  });
};
exports.create = (req, res) => {
  const { title, amount, nonprofit, category, content } = req.body;
  const { file } = req;
  if (!file)
    return res.json({
      status: false,
      msg: "No file uploaded.",
    });
  else {
    const blob = bucket.file(
      "img/" +
        hash() +
        "." +
        req.file.originalname.split(".").pop().toLowerCase()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", async () => {
      const cover = `https://cdn.troth.mn/${blob.name}`;
      Project.create({
        title,
        amount: parseInt(amount),
        category,
        nonprofit,
        content,
        cover,
        owner: req.user.id,
      }).then(() => {
        return res.json({ status: true });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.media = (req, res) => {
  var { file } = req;
  if (!file)
    return res.json({
      status: false,
      msg: "No file uploaded.",
    });
  else {
    const blob = bucket.file(
      "media/" +
        hash() +
        "." +
        req.file.originalname.split(".").pop().toLowerCase()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", async () => {
      const src = `https://cdn.troth.mn/${blob.name}`;
      return res.json({ status: true, src });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.get = (req, res) => {
  Project.find({ owner: req.user.id }).then((result) => res.json({ result }));
};
exports.get_user = (req, res) => {
  const { id } = req.params;
  Project.find({ owner: id }).then((result) => res.json({ result }));
};
