require("dotenv").config();
const secret = process.env.JWTSECRET;
const jwt = require("jsonwebtoken");
function token(req, res, next) {
  const token = req.header("x-auth-token");
  // Check for token
  if (!token) res.status(401).json({ msg: "No token, authorizaton denied" });
  else {
    try {
      // Verify token
      const decoded = jwt.verify(token, secret);
      // Add user from payload
      req.user = decoded;
      next();
    } catch (e) {
      res.status(400).json({ msg: "Token is not valid" });
    }
  }
}
module.exports = token;
