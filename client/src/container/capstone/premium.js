import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import io from "socket.io-client";
import QRCode from "qrcode";
import "./style.scss";
import { Spinner, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import axios from "axios";
import { User } from "context/user";
const CapstonePremium = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deeplink, setDeeplink] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(User);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [countdown, setCountDown] = useState(600);
  const toggle = () => setModal(!modal);
  const create = (bank) => {
    setLoading(true);
    setError("");
    axios.post("/api/invoice/premium").then((response) => {
      if (response.data.status) {
        setState(JSON.parse(response.data.result));
        setDeeplink(bank);
      } else if (response.data.msg) setError(response.data.msg);
      else setError("Some thing went wrong try again later.");
      setLoading(false);
    });
  };
  const candypay = () => {
    setLoading(true);
    setError("");
    axios.post("/api/invoice/candypay").then((response) => {
      const { status, result } = response.data;
      if (status) {
        QRCode.toDataURL(
          result.qrcode,
          {
            width: 300,
            height: 300,
            margin: 2,
            color: {
              dark: "#20733f",
              light: "#fff",
            },
          },
          (err, url) => {
            if (err) setError("QR код үүсгэхэд алдаа гарлаа");
            else {
              var qr_image = url.split(",")[1];
              setState({
                type: "candypay",
                qr_image,
                qr_code: result.qrcode.split("|")[4],
              });
            }
          }
        );

        const socket = io();
        socket.emit("candypay");
        socket.on("candypay", (data) => {
          setStatus(data);
          if (data.code) socket.close();
        });
      } else if (response.data.msg) setError(response.data.msg);
      else setError("Some thing went wrong try again later.");
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!countdown) return;
    const interval = setInterval(() => {
      setCountDown(countdown - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);
  return (
    <>
      <div className="container">
        <div className="capstone-premium">
          <div className="card">
            <div className="text-center">
              <h5 className="pt-3">TROTH Премиум гишүүнчлэл</h5>
            </div>
            <div className="included">
              <h4>Премиум гишүүнд нэгдсэнээр дараах эрхүүд нээгдэнэ:</h4>
              <div className="included-list">
                <span>
                  <li>
                    <div>
                      <span className="material-icons">done</span>
                      Онлайн сургалтанд үнэгүй хамрагдах
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="material-icons">done</span>
                      Зохион байгуулагдах нээлттэй эвентүүдэд үнэ төлбөргүй
                      оролцох
                    </div>
                  </li>
                </span>
              </div>
              <div className="auth-action">
                <Button
                  className="mt-2 auth-button mb-2"
                  block
                  onClick={toggle}
                >
                  Нэгдэх
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modal}
        centered
        className={`payment-modal ${loading || state ? "loaded" : ""}`}
      >
        <ModalHeader toggle={toggle}>Премиум гишүүнчлэлд нэгдэх</ModalHeader>
        <ModalBody>
          {loading === false ? (
            state ? (
              <div className="text-center qr-loaded">
                <p className="mb-0">
                  Энэхүү QR кодыг уншуулснаар та төлбөрөө төлөх боломжтой
                </p>
                <img
                  src={`data:image/png;base64,${state.qr_image}`}
                  alt={state.qr_code}
                  className={`qr-image ${countdown < 5 ? "blurred" : ""}`}
                />
                {deeplink === "khanbank://q?qPay_QRcode=" ||
                deeplink === "statebank://q?qPay_QRcode=" ||
                deeplink === "xacbank://q?qPay_QRcode=" ? (
                  <p className="text-muted text-center">
                    <span className="material-icons">info</span>
                    Шилжүүлэх дүн 500'000.
                  </p>
                ) : null}
                {deeplink ? (
                  <a href={deeplink + state.qr_code} className="deeplink">
                    Энд дарж үргэлжлүүлнэ үү.
                  </a>
                ) : null}
                {status ? (
                  <>
                    <p className="mb-0">{status.state}</p>
                    <p
                      className={status.code ? "d-none" : ""}
                      style={{ color: countdown < 300 ? "#dc3545" : "" }}
                    >
                      Session expired in{" "}
                      {moment.unix(countdown).utc().format("mm[:]ss []")}
                    </p>
                  </>
                ) : (
                  "Холбогдож байна"
                )}
              </div>
            ) : (
              <>
                <h5 className="header-legend">Дансаар шилжүүлэх</h5>
                <span className="text-muted">Банк</span>
                <div className="detail">
                  <p>Худалдаа Хөгжлийн Банк</p>
                  {/* <span className="material-icons">keyboard_arrow_down</span> */}
                  <div></div>
                </div>
                <span className="text-muted">Дансны дугаар:</span>
                <div className="detail">
                  <p>40 610 7359</p>
                  <span
                    className="action"
                    onClick={() => navigator.clipboard.writeText("406107359")}
                  >
                    Хуулах
                  </span>
                </div>
                <span className="text-muted">Хүлээн авагч:</span>
                <div className="detail">
                  <p>Б. Мөнх-Очир</p>
                  <span
                    className="action"
                    onClick={() =>
                      navigator.clipboard.writeText("Б. Мөнх-Очир")
                    }
                  >
                    Хуулах
                  </span>
                </div>
                <span className="text-muted">Шилжүүлэх дүн:</span>
                <div className="detail">
                  <p>500'000 ₮</p>
                  <span
                    className="action"
                    onClick={() => navigator.clipboard.writeText("500000")}
                  >
                    Хуулах
                  </span>
                </div>
                <span className="text-muted">Гүйлгээний утга:</span>
                <div className="detail">
                  {user ? (
                    <>
                      <p>{user.email}</p>
                      <span
                        className="action"
                        onClick={() =>
                          navigator.clipboard.writeText(user.email)
                        }
                      >
                        Хуулах
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <hr />
                <h5 className="header-legend">Qpay-ээр төлөх</h5>
                <div className="bank-select">
                  <div
                    className="bank-container"
                    onClick={() => create("most://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">Most Money</p>
                    <img
                      src="https://lh3.googleusercontent.com/9IyPmQNDdI72wxG0hQ8HhrBk6s561TgxCavHChhj0Qu8ak6RtH-q-DBlCbeKtQtGYPeM=s180-rw"
                      alt="mostmoney"
                      className="bank-icon"
                    />
                  </div>
                  <div
                    className="bank-container"
                    onClick={() => create("tdbbank://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">ХХБ</p>
                    <img
                      src="https://lh3.googleusercontent.com/oLKxnYGEgAyoxZ4rG6ogqzoLQMIUC7wrAuE7tca9PKWZubIev1t3CvvnJvpvj7KhKL4=s180-rw"
                      alt="tradedevbank"
                      className="bank-icon"
                    />
                  </div>
                  <div
                    className="bank-container"
                    onClick={() => create("ubcbank://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">УБХБ</p>
                    <img
                      src="https://lh3.googleusercontent.com/HykFBw7Rf8yNdytlsrtA4AQaIuybO0hmLsWMsKAU0MO7hKce_EEqyZp-zZooGs-Rq4XO=s180-rw"
                      alt="UB City Bank"
                      className="bank-icon"
                    />
                  </div>
                  <div
                    className="bank-container"
                    onClick={() => create("khanbank://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">Хаанбанк</p>
                    <img
                      src="https://lh3.googleusercontent.com/p7hXFskPhLktF-tlcwlZ62WlOKP3i4nJ3iIhMNGXJT28vHdCheSw228PgRuu8Q7WejoY=s180-rw"
                      alt="Khaanbank"
                      className="bank-icon"
                    />
                  </div>
                  <div
                    className="bank-container"
                    onClick={() => create("xacbank://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">Хасбанк</p>
                    <img
                      src="https://lh3.googleusercontent.com/XdgGl-1W5nsU5vl-qyq1QaaHifnq-SgEh6Dh_DdJ4hEtMfGSgjpQIkOq7Ly3zfG3zA8=s180-rw"
                      alt="xacbank"
                      className="bank-icon"
                    />
                  </div>
                  <div
                    className="bank-container"
                    onClick={() => create("statebank://q?qPay_QRcode=")}
                  >
                    <p className="bank-label">Төрийн банк</p>
                    <img
                      src="https://lh3.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco=s180-rw"
                      alt="statebank"
                      className="bank-icon"
                    />
                  </div>
                  <div className="bank-container" onClick={candypay}>
                    <p className="bank-label">Candy Pay</p>
                    <img
                      src="https://lh3.googleusercontent.com/gwLFWRVuNcdqYrfqPxFu8mhxHPW2Aaz3l3Hy4TK310S68K8TcksOi13e0gmHCgqy0gE=s180-rw"
                      alt="candypay"
                      className="bank-icon"
                    />
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="w-100 p-3 text-center">
              <Spinner size="sm" color="secondary" />
            </div>
          )}
          <h5 className="text-danger header-legend mt-2">{error}</h5>
        </ModalBody>
      </Modal>
    </>
  );
};
export default CapstonePremium;
