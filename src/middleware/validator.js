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
  "follow",
  "auth",
  "capstone",
  "project",
  "notifications",
];
exports.create = [
  check("email").isEmail(),
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length")
    .not()
    .isIn(usernames)
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
exports.login = [
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length"),
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
exports.find = [
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length")
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
];
exports.follow = [check("id")];
exports.search = [check("search")];
exports.info = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length")
    .not()
    .isIn(usernames)
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
  check("website")
    .optional({ checkFalsy: true })
    .isLength({
      min: 10,
      max: 128,
    })
    .matches(
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ),
  check("phone")
    .optional({ checkFalsy: true })
    .isLength({
      min: 6,
      max: 32,
    })
    .withMessage("Must be between 6 and 32 in length")
    .matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/i)
    .withMessage("Invalid phone number"),
  check("about")
    .optional({ checkFalsy: true })
    .isLength({
      min: 2,
      max: 450,
    })
    .withMessage("Must be between 2 and 450 in length"),
];
exports.password = [
  check("old")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("updated")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("confirm")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
exports.forgot = [
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length"),
];
exports.reset_password = [
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("confirm_password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("token")
    .isLength({
      min: 20,
      max: 128,
    })
    .withMessage("invalid token"),
];
exports.update_email = [
  check("email").isEmail(),
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
exports.code = [
  check("code")
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage("Must be 6 digits"),
];
exports.verify_email = [
  check("token")
    .isLength({
      min: 20,
      max: 128,
    })
    .withMessage("invalid token"),
];
exports.project = [
  check("amount").isNumeric(),
  check("title")
    .isLength({
      max: 50,
    })
    .withMessage("Must be between 1 and 50 in length"),
  check("category"),
];
