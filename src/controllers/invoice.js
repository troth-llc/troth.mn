exports.index = (req, res) => {
  return res.json({ status: true });
};
exports.hook = (req, res) => {
  if (req.body) return res.json({ status: true });
  else return res.json({ status: false });
};
