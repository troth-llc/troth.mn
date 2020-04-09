const express = require("express");
const router = express.Router();
const update = require("../controllers/update");
const validate = require("../middleware/validator");
const token = require("../middleware/token");
const upload = require("../middleware/multer");
/**
 * /api/update/:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.post("/info", validate.info, token, update.info);
router.post("/password", validate.password, token, update.password);
router.post("/avatar", upload.avatar, token, update.avatar);
router.post("/cover", token, update.cover);
router.post("/email", validate.update_email, token, update.email);
router.post("/code", validate.code, token, update.code);
module.exports = router;
