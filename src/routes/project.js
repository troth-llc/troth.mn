const express = require("express");
const router = express.Router();
const project = require("../controllers/project");
// middleware
const token = require("../middleware/token");
const { multer } = require("../middleware/multer");
/**
 * /api/project:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.post("/create", multer.single("file"), token, project.create);
router.post("/media", multer.single("file"), token, project.media);
router.get("/get", token, project.get);
router.get("/category", project.category);
module.exports = router;
