import React, { useState, useContext, useEffect } from "react";
import { MDCDialog } from "@material/dialog";
import { User } from "context/user";
import axios from "axios";
import moment from "moment";
import { Snackbar } from "context/notification-toast";

const Email = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [resend, setResend] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorResend, seterrorResend] = useState("");
  const { user } = useContext(User);
  const { setToast } = useContext(Snackbar);

  const [code, setcode] = useState("");
  const [errorCode, seterrorCode] = useState("");
  useEffect(() => {
    if (user) {
      setError({ email: user.email_verified_at ? "" : "Not verified" });
      setState({ email: user.email });
    }
  }, [user]);
  return user ? (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          setResend(true);

          if (state.email.trim() === user.email.trim())
            setError({ ...error, email: "Please enter a different email" });
          else {
            setLoading(true);
            setError({ email: "" });
            const { email, password } = state;
            axios
              .post("/api/update/email", {
                email,
                password,
              })
              .then((response) => {
                if (response.data.status) {
                  const dialog = new MDCDialog(
                    document.querySelector(".mdc-dialog")
                  );
                  dialog.escapeKeyAction = "";
                  dialog.scrimClickAction = "";
                  dialog.autoStackButtons = "";
                  dialog.open();
                } else {
                  let errors = response.data.errors;
                  errors.map((error) => setError({ [error.param]: error.msg }));
                  setDisabled(false);
                  setLoading(false);
                }
              });
          }
        }}
      >
        <div className="input-container">
          <div
            className={`mdc-text-field ${
              user.email_verified_at ? "" : "mdc-text-field--invalid"
            }`}
          >
            <input
              className="mdc-text-field__input"
              required
              type="email"
              autoComplete="off"
              value={state.email}
              disabled={loading}
              onChange={(e) => {
                setError({ email: "" });
                setState({
                  ...state,
                  [e.target.name]: e.target.value,
                });
              }}
              onKeyUp={(e) => {
                if (state.password && user.email !== e.target.value) {
                  setDisabled(false);
                }
              }}
              name="email"
            />
            <div className="mdc-line-ripple"></div>
            <label className="mdc-floating-label mdc-floating-label--float-above">
              Email
            </label>
          </div>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
            {error.email}
          </p>
        </div>
        <div className="input-container">
          <div className="mdc-text-field">
            <input
              className="mdc-text-field__input"
              required
              disabled={loading}
              type="password"
              onChange={(e) => {
                setDisabled(false);
                setState({
                  ...state,
                  [e.target.name]: e.target.value,
                });
              }}
              name="password"
            />
            <div className="mdc-line-ripple"></div>
            <label className="mdc-floating-label">Password</label>
          </div>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
            {error.password}
          </p>
        </div>
        <div className="action">
          <div>
            <div className="email-action">
              {user.email_verified_at ? (
                <span>Verified {moment(user.email_verified_at).fromNow()}</span>
              ) : (
                <button
                  className="mdc-button"
                  style={{ fontSize: "12px" }}
                  disabled={resend}
                  type="button"
                  onClick={() => {
                    setResend(true);
                    axios.get("/api/auth/email").then((response) =>
                      response.data.status
                        ? setToast({
                            msg: "Link has been send to your email address",
                            timeout: 4000,
                          })
                        : setToast({
                            msg: "Some thing went wrong",
                            timeout: 8000,
                          })
                    );
                  }}
                >
                  <span className="mdc-button__ripple"></span>
                  resend verification link
                </button>
              )}
              <span className="email-resend-status">{errorResend}</span>
            </div>
            <button
              className="mdc-button mdc-button--raised"
              disabled={disabled}
            >
              <span className="mdc-button__ripple"></span>
              {loading ? "Saving" : "Save"}
            </button>
          </div>
        </div>
      </form>
      <div className="mdc-dialog">
        <div className="mdc-dialog__container">
          <div
            className="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            style={{ width: "320px" }}
          >
            <div className="mdc-dialog__content">
              <p>
                Enter the verification code sent to your email{" "}
                <b>{state.email}</b>
              </p>
              <div className="mdc-text-field">
                <input
                  className="mdc-text-field__input"
                  required
                  type="number"
                  onChange={(e) => {
                    setcode(e.target.value);
                  }}
                  name="code"
                />
                <div className="mdc-line-ripple"></div>
                <label className="mdc-floating-label">Code</label>
              </div>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                {errorCode}
              </p>
            </div>
            <footer className="mdc-dialog__actions">
              <button
                type="button"
                className="mdc-button mdc-dialog__button"
                disabled={code.length > 5 ? false : true}
                onClick={() => {
                  axios.post("/api/update/code", { code }).then((response) => {
                    if (response.data.status) window.location.reload();
                    else {
                      let errors = response.data.errors;
                      errors.map((error) => seterrorCode(error.msg));
                    }
                  });
                }}
              >
                <div className="mdc-button__ripple"></div>
                <span className="mdc-button__label">Continue</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"></div>
      </div>
    </>
  ) : (
    <div className="placeholder settings-container">
      <div className="line"></div>
    </div>
  );
};
export default Email;
