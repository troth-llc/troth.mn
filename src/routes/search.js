const express = require("express");
const router = express.Router();
const search = require("../controllers/search");
const validate = require("../middleware/validator");

/**
 * /api/search:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", validate.search, search.find);
module.exports = router;
