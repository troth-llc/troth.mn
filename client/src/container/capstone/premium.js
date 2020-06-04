import React, { useState } from "react";
import "./style.scss";
import { Spinner } from "reactstrap";
import axios from "axios";
const CapstonePremium = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hiden, hide] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(true);
  return (
    <div className="container">
      <div className="capstone-premium">
        <div className="card">
          <div className="text-center">
            <h5 className="pt-3">TROTH Premium membership</h5>
          </div>
          <div className="included">
            <h4>Included in your membership:</h4>
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
            {!loading ? (
              !hiden ? (
                <div className="payment-method">
                  <h4>Төлбөр төлөх хэрэгсэл</h4>
                  <hr />
                  <div
                    className="banks"
                    onClick={() => {
                      setLoading(true);
                      axios.post("/api/invoice/premium").then((response) => {
                        if (response.data.status) {
                          hide(true);
                          setState(JSON.parse(response.data.result));
                        } else if (response.data.msg)
                          setError(response.data.msg);
                        else setError("Some thing went wrong try again later.");
                        setLoading(false);
                      });
                    }}
                  >
                    <div>
                      <img
                        src="https://cdn.troth.mn/media/mostmoney.png"
                        alt="mostmoney"
                        className="bank-icon"
                      />
                      Mostmoney
                    </div>
                    <span className="material-icons">keyboard_arrow_right</span>
                  </div>
                </div>
              ) : null
            ) : (
              <div className="w-100 text-center p-3">
                <Spinner color="secondary" size="sm" />
              </div>
            )}
            {state ? (
              <div className="qr-result">
                <div className={mobile ? "d-none d-sm-block text-center" : ""}>
                  <br />
                  <span>
                    Энэ хүү QR кодыг уншуулснаар та төлбөрөө төлөх боломжтой
                  </span>
                  <img
                    src={`data:image/png;base64,${state.qr_image}`}
                    alt={state.qr_code}
                  />
                </div>
                <div className="d-flex flex-column d-sm-none deeplink-container">
                  <a
                    className="deep-link"
                    href={`most://q?qPay_QRcode=${state.qr_code}`}
                  >
                    Энд дарж үргэлжлүүлнэ үү.
                  </a>
                  <span
                    className={mobile ? "open-qr" : "d-none"}
                    onClick={() => setMobile(false)}
                  >
                    QR код харах
                  </span>
                </div>
              </div>
            ) : null}
            <span className="text-danger">{error}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CapstonePremium;
