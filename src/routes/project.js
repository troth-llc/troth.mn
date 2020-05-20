const express = require("express");
const router = express.Router();
const project = require("../controllers/project");
// middleware
const token = require("../middleware/token");
/**
 * /api/category:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/category", project.category);
module.exports = router;
