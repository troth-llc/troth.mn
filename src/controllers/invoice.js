const Invoice = require("../models/invoice");
const User = require("../models/user");
const axios = require("axios");
const nodemailer = require("nodemailer");
const key = require("../../config.json");
// email config
const send = async (to, subject, html) => {
  return new Promise(async (resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL,
        serviceClient: key.client_id,
        privateKey: key.private_key,
      },
    });
    try {
      await transporter.verify();
      var result = await transporter.sendMail({
        from: `TROTH LLC ${process.env.GMAIL}`,
        to,
        subject,
        html,
      });
      if (result.accepted.length > 0) {
        resolve(true);
      }
    } catch (err) {
      reject(err);
      resolve(false);
    }
  });
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
      //
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
        console.log("INVOICE: MOSTMONEY " + err);
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
    console.log(req.body.data, new Date());
    var save = {
      status: `(MOSTMONEY) status: ${String(rettype)}`,
      description: String(retdesc),
      payment_id: Number(paymentid),
      transaction_id: Number(banktxnid),
      date: new Date(banktxndate),
      amount: Number(amount),
      bill_id: String(billid),
    };
    // update user type to premium
    if (parseInt(amount) > process.env.PREMIUM_AMOUNT) {
      User.findById({ _id: save.bill_id })
        .then((data) => {
          send(
            data.email,
            "Notice",
            `Dear <strong>${data.name}</strong>,
            <br/>
          <p>Гүйлгээ амжилтгүй боллоо.</p>
          </br>
          <pre>${paymentid}</pre>
          <strong>Troth LLC</strong></p>
          </br>
          <pre>https://capstone.troth.mn</pre>
          `
          );
        })
        .catch((err) => console.log("invoice error: ", err));
    } else if (
      parseInt(rettype) === 0 &&
      parseInt(amount) === process.env.PREMIUM_AMOUNT
    ) {
      User.findOneAndUpdate({ _id: save.bill_id }, { type: "premium" })
        .then((data) => {
          send(
            data.email,
            "Thank you for your purchase",
            `Dear <strong>${data.name}</strong>,
            <br/>
          <p>We are happy to announce that you’re confirmed as a Troth Premium member. Our journey starts now.</p>
          <p>Let’s make our dream project a reality.</p>
          <p>Best regards, <br/>
          <strong>Troth LLC</strong></p>
          </br>
          <pre>https://capstone.troth.mn</pre>
          `
          );
          console.log(
            "user " + data.name + " bought premium status " + new Date()
          );
        })
        .catch((err) => console.log("invoice error: ", err));
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
exports.candypay = (req, res) => {
  var io = req.app.get("io");
  var socket = io.to("candypay");
  io.on("connection", (socket) => {
    socket.emit("candypay", { state: "Төлөгдөөгүй", connected: true });
  });
  const check = (uuid, id) => {
    var check_uuid = setInterval(async () => {
      //10 секунд болгон төлөгдсөн эсэхийн шалгах
      socket.emit("candypay", {
        state: "Төлөгдөөгүй",
        connected: true,
      });
      try {
        let response = await axios({
          method: "get",
          url: `https://wallet.candy.mn/rest/branch/qrpurchase/check?uuid=${uuid}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dGVzdDExMzM6NTM3MDkyMg==",
          },
        });
        let { code, result, info } = await response.data;
        if (
          code === 0 &&
          result.amount === Number(process.env.PREMIUM_AMOUNT)
        ) {
          socket.emit("candypay", {
            state: "Төлөгдсөн",
            code: true,
            connected: true,
          });
          clearInterval(check_uuid);
          var save = {
            status: "CANDYPAY",
            description: info,
            payment_id: result.uuid,
            transaction_id: result.transactionId,
            date: result.usedAtUI,
            amount: result.amount,
            bill_id: result.uuid,
          };
          User.findOneAndUpdate({ _id: id }, { type: "premium" })
            .then((data) => {
              send(
                data.email,
                "Thank you for your purchase",
                `Dear <strong>${data.name}</strong>,
                <br/>
              <p>We are happy to announce that you’re confirmed as a Troth Premium member. Our journey starts now.</p>
              <p>Let’s make our dream project a reality.</p>
              <p>Best regards, <br/>
              <strong>Troth LLC</strong></p>
              </br>
              <pre>https://capstone.troth.mn</pre>
              `
              );
              console.log(
                "user " + data.name + " bought premium status " + new Date()
              );
            })
            .catch((err) => console.log("invoice error: ", err));
          Invoice.create({ ...save });
        }
      } catch (err) {
        console.log("INVOICE: CANDYPAY ERROR " + err);
        clearInterval(check_uuid);
      }
    }, 10000);
    setTimeout(() => {
      console.log(`INVOICE: CANDYPAY TIMEDOUT 'uuid': ${uuid}, 'user': ${id}`);
      clearInterval(check_uuid);
    }, 600000); //stop after 10 mins( 600000 ms)
  };
  var data = JSON.stringify({
    amount: process.env.PREMIUM_AMOUNT,
    displayName: "TROTH LLC",
    generateUuid: true,
  });
  var config = {
    method: "post",
    url: "https://wallet.candy.mn/rest/branch/qrpurchase/generate",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic dGVzdDExMzM6NTM3MDkyMg==",
    },
    data: data,
  };
  User.findById(req.user.id).then((user) => {
    if (user.type === "premium")
      return res.json({
        status: false,
        msg: "Та Premium хэрэглэгч болсон байна.",
      });
    axios(config)
      .then((response) => {
        const { code, result } = response.data;
        if (code === 0) {
          check(result.uuid, req.user.id);
          return res.json({ status: true, result });
        } else return res.json({ status: false });
      })
      .catch((error) => {
        console.log("candypay invoice " + error);
        return res.json({ status: false });
      });
  });
};
