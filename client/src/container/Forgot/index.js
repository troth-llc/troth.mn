import React, { useState } from "react";
import axios from "axios";
import "./style.scss";
const Forgot = () => {
  if (localStorage.getItem("token")) window.location.href = "/";
  const [disabled, setDisabled] = useState(true);
  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });
  const [error, setError] = useState({
    password: "",
    confirm_password: "",
    token: "",
  });
  const token_url = new URLSearchParams(window.location.search);
  const token = token_url.get("token");
  return token ? (
    <>
      <form
        className="settings-container reset-password"
        onSubmit={(e) => {
          e.preventDefault();
          if (password.new === password.confirm) {
            axios
              .post("/api/auth/reset_password", {
                password: password.new,
                confirm_password: password.confirm,
                token,
              })
              .then((response) => {
                let errors = response.data.errors;
                let { status, token } = response.data;
                if (status) {
                  localStorage.setItem("token", token);
                  window.location.href = "/";
                } else {
                  errors.map((error) => setError({ [error.param]: error.msg }));
                }
              });
          }
        }}
      >
        <h5 className="notice center font-reset">Reset your password</h5>
        <span className="notice">
          Please choose a new password to finish signing in. Password contains
          both uppercase and lowercase letters, numbers. This is for your own
          safety.
        </span>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg text-center">
          {error.token}
        </p>
        <div className="input-container">
          <div className="mdc-text-field">
            <input
              className="mdc-text-field__input"
              required
              type="password"
              autoFocus={true}
              value={password.new}
              onChange={(e) => {
                setPassword({
                  ...password,
                  [e.target.name]: e.target.value,
                });
              }}
              onKeyUp={(e) => {
                if (e.target.value.length < 6)
                  setError({
                    password: "Password must contain at least 6 characters.",
                  });
                else if (password.new !== password.confirm) {
                  setDisabled(true);
                  setError({ confirm: "Both password must be same" });
                } else setError({ password: "", confirm_password: "" });
              }}
              name="new"
            />
            <div className="mdc-line-ripple"></div>
            <label className="mdc-floating-label">New password</label>
          </div>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
            {error.password}
          </p>
        </div>
        <div className="input-container">
          <div className="mdc-text-field">
            <input
              className="mdc-text-field__input"
              required
              type="password"
              value={password.confirm}
              onChange={(e) => {
                setPassword({
                  ...password,
                  [e.target.name]: e.target.value,
                });
              }}
              onKeyUp={() => {
                if (password.new !== password.confirm) {
                  setDisabled(true);
                  setError({ confirm_password: "Both password must be same" });
                } else {
                  setDisabled(false);
                  setError({ confirm_password: "" });
                }
              }}
              name="confirm"
            />
            <div className="mdc-line-ripple"></div>
            <label className="mdc-floating-label">Confirm password</label>
          </div>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
            {error.confirm_password}
          </p>
        </div>
        <div className="action">
          <div>
            <span> </span>
            <button
              className="mdc-button mdc-button--raised"
              disabled={disabled}
            >
              <span className="mdc-button__ripple"></span>Save
            </button>
          </div>
        </div>
      </form>
    </>
  ) : (
    <p className="text-center" style={{ paddingTop: "50px" }}>
      invalid token
    </p>
  );
};
export default Forgot;
