const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/auth:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, user.profile);
router.post("/", validate.login, user.login);
router.post("/register", validate.create, user.create);
module.exports = router;
