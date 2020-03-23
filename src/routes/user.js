const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const validate = require("../middleware/validator");
/**
 * /api/user:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/:username", validate.find, user.find);
module.exports = router;
