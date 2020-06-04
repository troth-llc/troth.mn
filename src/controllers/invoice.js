const Invoice = require("../models/invoice");
const User = require("../models/user");
const request = require("request");
const axios = require("axios");
exports.index = (req, res) => {
  return res.json({ status: true });
};
exports.premium = (req, res) => {
  var options = {
    method: "POST",
    url: process.env.MOST_CREATE_TRANSACTION,
    headers: {
      "Content-Type": "application/json",
      PV: "05",
      TT: "3051",
      RS: "00",
    },
    data: JSON.stringify({
      SD: "tVWQIAIXxyBxV4RJmGIGkek7uTu8Ap2cJQnqpPPJNuM=",
      EK:
        "KfbsuGZKsq1gM3an6JdA6LQny/8hjKkYa6eQot/tAE/aEGOwLWJOxKsZsQ2bvxHv/T7VZLuEF3eS1CGyxZQmRsjQaNfh36kA9MVQUe2zXtA1kRMNb6H8YXACVhe4Snx0SbEztFnMXt9uskA7iEwcnW/lpaRkwxmhbh3NiNjlCSw=",
      SG: "MPdUd+c0jdmdpir6FIfBRKSO3T8=",
      srcInstId: "20200318",
      channel: "44",
      lang: "0",
      traceNo: "2020052703472500",
      tranCur: "MNT",
      tranAmount: process.env.PREMIUM_AMOUNT,
      billId: req.user.id,
      posNo: "60883",
      payeeId: "60883",
      tranDesc: "TROTH PREMIUM SUBSCRIPTION",
      qrPaidLimit: "1",
      deviceIp: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      deviceMac: "",
      deviceName: "",
      PbKA:
        "&lt;RSAKeyValue&gt;&lt;Modulus&gt;n0GT9szLkGl6ST349vqiMqXnYOv0S64FKmtecYFxztDHy89baEezBNtefeHGLKtFCWehshLoqd/ClYb0zm/A2Jhbxc6+nHeJCw3jLsh9qJsgyg2qYcTYxUEA3UCOIz0uHu6BRB+ZQpASAn1jN1OFAQeP3CaIEy2+QxWZHKPHkNE=&lt;/Modulus&gt;&lt;Exponent&gt;AQAB&lt;/Exponent&gt;&lt;/RSAKeyValue&gt;",
    }),
  };
  User.findById(req.user.id).then((user) => {
    if (user.type === "premium")
      return res.json({
        status: false,
        msg: "Та Premium хэрэглэгч болсон байна.",
      });
    axios(options)
      .then((response) => {
        if (response.data.responseCode === "0")
          return res.json({ result: response.data.responseData, status: true });
        return res.json({ status: false, msg: "Банкны холболт саатлаа" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, msg: "some thing went wrong" });
      });
  });
};
exports.premium_hook = (req, res) => {
  if (req.body.data) {
    const {
      rettype,
      retdesc,
      paymentid,
      banktxnid,
      banktxndate,
      amount,
      billid,
    } = req.body.data;
    var save = {
      status: String(rettype),
      description: String(retdesc),
      payment_id: Number(paymentid),
      transaction_id: Number(banktxnid),
      date: new Date(banktxndate),
      amount: Number(amount),
      bill_id: String(billid),
    };
    // update user type to prmium
    if (parseInt(rettype) === 0) {
      User.findOneAndUpdate({ _id: save.bill_id }, { type: "premium" })
        .then((data) => {
          console.log(
            "user " + data.name + " bought premium status" + new Date()
          );
        })
        .catch((err) => console.log(err));
    }
    // save invoice
    Invoice.create({ ...save })
      .then(() => res.json({ status: true }))
      .catch((err) => {
        console.log(err);
        return res.json({ status: false });
      });
  } else return res.json({ status: false });
};
