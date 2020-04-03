const express = require("express");
const router = express.Router();
const update = require("../controllers/update");
const validate = require("../middleware/validator");
const token = require("../middleware/token");
/**
 * /api/update/:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.post("/info", validate.info, token, update.info);
router.post("/password", validate.password, token, update.password);
module.exports = router;
