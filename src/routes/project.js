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
router.post("/update", multer.single("file"), token, project.update);
router.post("/create", multer.single("file"), token, project.create);
router.post("/media", multer.single("file"), token, project.media);
router.get("/get", token, project.get);
router.get("/get/:id", project.get_user);
router.get("/view/:id", project.view);
router.get("/category", project.category);
router.get("/category/:id", project.browse);
module.exports = router;
