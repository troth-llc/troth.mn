const { check } = require("express-validator");
const usernames = [
  "admin",
  "username",
  "profile",
  "settings",
  "search",
  "logout",
  "calendar",
  "home",
  "email",
  "password",
  "troth",
  "follow"
];
exports.create = [
  check("email").isEmail(),
  check("name")
    .isLength({
      min: 2,
      max: 72
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("username")
    .isLength({
      min: 4,
      max: 128
    })
    .withMessage("Must be between 4 and 128 in length")
    .not()
    .isIn(usernames)
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
  check("gender")
    .isIn(["male", "female", "custom"])
    .withMessage("Invalid gender"),
  check("password")
    .isLength({
      min: 6,
      max: 128
    })
    .withMessage("Must be between 6 and 128 in length")
];
exports.login = [
  check("username")
    .isLength({
      min: 4,
      max: 128
    })
    .withMessage("Must be between 4 and 128 in length"),
  check("password")
    .isLength({
      min: 6,
      max: 128
    })
    .withMessage("Must be between 6 and 128 in length")
];
exports.find = [
  check("username")
    .isLength({
      min: 4,
      max: 128
    })
    .withMessage("Must be between 4 and 128 in length")
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username")
];
exports.follow = [check("id")];
exports.search = [check("q")];
exports.info = [
  check("name")
    .isLength({
      min: 2,
      max: 72
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("username")
    .isLength({
      min: 4,
      max: 128
    })
    .withMessage("Must be between 4 and 128 in length")
    .not()
    .isIn(usernames)
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
  check("gender")
    .isIn(["male", "female", "custom"])
    .withMessage("Invalid gender"),
  check("website")
    .optional({ checkFalsy: true })
    .isLength({
      min: 10,
      max: 128
    })
    .withMessage("Must be between 10 and 128 in length"),
  check("about")
    .optional({ checkFalsy: true })
    .isLength({
      min: 2,
      max: 450
    })
    .withMessage("Must be between 2 and 450 in length")
];
