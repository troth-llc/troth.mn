const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const validate = require("../middleware/validator");
const token = require("../middleware/token");

/**
 * /api/user:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/:username", validate.find, user.find);
router.get("/follow/:id", token, validate.follow, user.follow);
router.get("/unfollow/:id", token, validate.follow, user.unfollow);
module.exports = router;
