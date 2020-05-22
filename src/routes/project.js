const express = require("express");
const router = express.Router();
const project = require("../controllers/project");
// middleware
const token = require("../middleware/token");
/**
 * /api/project:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.post("/", token, project.create);
router.post("/media", token, project.media);
router.get("/category", project.category);
module.exports = router;
