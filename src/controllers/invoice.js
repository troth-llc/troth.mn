exports.index = (req, res) => {
  return res.json({ status: true });
};
exports.hook = (req, res) => {
  console.log(req.body);
  if (data) return res.json({ status: true });
  else return res.json({ status: false });
};
