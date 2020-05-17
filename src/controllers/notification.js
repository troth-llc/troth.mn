const User = require("../models/user");
const Notification = require("../models/follow_notification");
exports.follow = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .select("notifications")
    .populate({
      path: "notifications",
      populate: {
        path: "user",
        select: "name avatar",
      },
    })
    .then((result) => res.json({ result: result.notifications }));
};
