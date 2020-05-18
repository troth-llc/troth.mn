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
        select: "name avatar username",
      },
    })
    .then((result) => res.json({ result: result.notifications }));
};
exports.read_follow = (req, res) => {
  const { id } = req.params;
  User.findById(req.user.id)
    .select("notifications")
    .populate({
      path: "notifications",
    })
    .then((result) => {
      var found = result.notifications.find(
        (notification) => notification._id == id
      );
      if (found) {
        Notification.findByIdAndUpdate({ _id: id }, { read: true })
          .then(() => res.json({ status: true }))
          .catch((err) => {
            console.log(err);
            return res.json({
              status: false,
              msg: "Some thing went wrong when saving",
            });
          });
      } else return res.json({ status: false, msg: "Invalid Notification Id" });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ status: false, msg: "Some thing went wrong" });
    });
};
