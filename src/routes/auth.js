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
router.post("/forgot", validate.forgot, auth.forgot);
router.post("/reset_password", validate.reset_password, auth.reset_password);
router.get("/email", token, auth.email);
router.post("/verify_email", validate.verify_email, auth.verify_email);
module.exports = router;
