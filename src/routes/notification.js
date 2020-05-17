const express = require("express");
const router = express.Router();
const notification = require("../controllers/notification");
// middleware
const token = require("../middleware/token");
/**
 * /api/notification:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, notification.follow);
module.exports = router;
