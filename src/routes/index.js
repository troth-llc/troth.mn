const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.send("🎉");
});
router.use("/auth", require("./auth.js"));
router.use("/user", require("./user.js"));
router.use("/search", require("./search.js"));
router.use("/update", require("./update.js"));
module.exports = router;
