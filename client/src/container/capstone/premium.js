import React, { useState, useContext } from "react";
import "./style.scss";
import { Spinner } from "reactstrap";
import axios from "axios";
import { User } from "context/user";
const CapstonePremium = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hiden, hide] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(true);
  const [bank, setBank] = useState(null);
  const { user } = useContext(User);
  return (
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
            {!loading ? (
              !hiden ? (
                <div className="payment-method">
                  <h4>Төлбөр төлөх хэрэгсэл</h4>
                  <hr />
                  <div
                    className="banks"
                    onClick={() => {
                      setLoading(true);
                      setError("");
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
                  <div
                    className="banks"
                    onClick={() => {
                      setError("");
                      if (user && user.type === "premium")
                        setError("Та Premium хэрэглэгч болсон байна.");
                      else {
                        hide(true);
                        setBank(true);
                      }
                    }}
                  >
                    <div>
                      <span className="material-icons icon material-icons-round">
                        receipt_long
                      </span>
                      Дансаар
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
                    Энэхүү QR кодыг уншуулснаар та төлбөрөө төлөх боломжтой
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
            {bank ? (
              <div>
                <hr />
                <h5 className="text-center">
                  Гишүүнчлэлийн төлбөр : 500,000 ₮
                </h5>
                {user ? (
                  <span className="bank">
                    • Хаан Банк <strong>5041263749 Б. Мөнх-Очир</strong> данс
                    руу шилжүүлнэ <br />• Гүйлгээний утганд{" "}
                    <strong>{user.email}</strong> гэж оруулна. <br />•
                    Шилжүүлсэний дараа{" "}
                    <pre className="d-inline">+976 8979 2133</pre> утсанд залгаж
                    мэдэгдэнэ үү. Ингэснээр бид таныг шилжүүлэг хийснийг шуурхай
                    мэдэх юм.
                  </span>
                ) : (
                  <span className="text-danger text-center">Please wait..</span>
                )}
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
