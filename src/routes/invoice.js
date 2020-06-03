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
router.get("/", token, invoice.index);
router.post("/hook", xmlparser(), invoice.hook);
module.exports = router;
