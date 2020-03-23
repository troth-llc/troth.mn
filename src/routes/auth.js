const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
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
router.get("/", token, auth.profile);
router.post("/", validate.login, auth.login);
router.post("/register", validate.create, auth.create);
module.exports = router;
