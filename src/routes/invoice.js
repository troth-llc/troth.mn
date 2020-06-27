const express = require("express");
const router = express.Router();
const invoice = require("../controllers/invoice");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
const xmlparser = require("express-xml-bodyparser");
/**
 * /api/invoice:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.post("/mostmoney", xmlparser({ strict: false }), invoice.premium_hook);
router.post("/candypay", token, invoice.candypay);
router.post("/premium", token, invoice.premium);
module.exports = router;
