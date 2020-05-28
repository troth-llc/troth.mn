const Category = require("../models/project_category");
const Project = require("../models/project");
const User = require("../models/user");
const { bucket } = require("../middleware/multer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
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
  const { title, amount, nonprofit, category, content, video } = req.body;
  const { file } = req;
  if (!file && !video)
    return res.json({
      status: false,
      msg: "No file uploaded.",
    });
  else if (video) {
    const cover = `https://img.youtube.com/vi/${video}/sddefault.jpg`;
    Project.create({
      title,
      amount: parseInt(amount),
      category,
      nonprofit,
      content,
      cover,
      video: `https://www.youtube.com/embed/${video}`,
      owner: req.user.id,
    }).then(() => {
      return res.json({ status: true });
    });
  } else {
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
  Project.find({ owner: req.user.id })
    .then((result) => res.json({ result }))
    .catch((err) => res.json({ status: false }));
};
exports.get_user = (req, res) => {
  const { id } = req.params;
  Project.find({ owner: id, status: true })
    .then((result) => res.json({ result }))
    .catch((err) => res.json({ status: false }));
};
exports.view = (req, res) => {
  const { id } = req.params;
  const token = req.header("x-auth-token");
  if (token) {
    const user = jwt.verify(token, process.env.JWTSECRET);
    Project.findOne({ _id: id, owner: user.id })
      .populate({
        path: "owner",
        select: "name username avatar",
      })
      .populate("category", "name")
      .exec((error, result) => {
        if (error) return res.json({ status: false, msg: "project not found" });
        else return res.json({ result });
      });
  } else {
    Project.findOne({ _id: id, status: true })
      .populate({
        path: "owner",
        select: "name username avatar",
      })
      .populate("category", "name")
      .exec((error, result) => {
        if (error) return res.json({ status: false, msg: "project not found" });
        else return res.json({ result });
      });
  }
};
exports.update = (req, res) => {
  const {
    title,
    amount,
    nonprofit,
    category,
    content,
    _id,
    video,
    cover: current_cover,
  } = req.body;
  const { file } = req;
  if (!file) {
    const yt_cover = `https://img.youtube.com/vi/${video}/sddefault.jpg`;
    Project.findByIdAndUpdate(_id, {
      title,
      amount: parseInt(amount),
      category,
      nonprofit,
      content,
      cover: yt_cover,
      video: `https://www.youtube.com/embed/${video}`,
      updated: new Date(),
      rejected: false,
    }).then(() => {
      return res.json({ status: true });
    });
  } else {
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
      Project.findByIdAndUpdate(_id, {
        title,
        amount: parseInt(amount),
        category,
        nonprofit,
        content,
        cover,
        video: null,
        updated: new Date(),
        rejected: false,
      }).then(() => {
        return res.json({ status: true });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
