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
router.post("/users", validate.search, search.user);
module.exports = router;
