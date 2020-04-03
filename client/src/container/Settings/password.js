import React, { useState, useEffect, useContext } from "react";
import { User } from "context/user";
import axios from "axios";
import moment from "moment";
const Password = () => {
  const { user } = useContext(User);
  const [password, setPassword] = useState({
    old: "",
    updated: "",
    confirm: "",
  });
  const [error, setError] = useState({
    old: "",
    updated: "",
    confirm: "",
  });
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {}, []);
  return user !== null ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const { old, updated, confirm } = password;
        if (updated !== confirm) setError({ confirm: "password must be same" });
        else {
          setDisabled(true);
          axios
            .post("/api/update/password", {
              old,
              updated,
              confirm,
            })
            .then((response) => {
              if (response.data.status) window.location.reload();
              else {
                let errors = response.data.errors;
                errors.map((error) => setError({ [error.param]: error.msg }));
                setDisabled(false);
              }
            });
        }
      }}
    >
      <div className="input-container">
        <div className="mdc-text-field">
          <input
            className="mdc-text-field__input"
            required
            type="password"
            value={password.old}
            onChange={(e) => {
              setPassword({
                ...password,
                [e.target.name]: e.target.value,
              });
            }}
            name="old"
          />
          <div className="mdc-line-ripple"></div>
          <label className="mdc-floating-label">Old password</label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.old}
        </p>
      </div>
      <div className="input-container">
        <div className="mdc-text-field">
          <input
            className="mdc-text-field__input"
            required
            type="password"
            value={password.new}
            onChange={(e) => {
              setPassword({
                ...password,
                [e.target.name]: e.target.value,
              });
            }}
            name="updated"
          />
          <div className="mdc-line-ripple"></div>
          <label className="mdc-floating-label">New password</label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.updated}
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
              setDisabled(false);
              setPassword({
                ...password,
                [e.target.name]: e.target.value,
              });
            }}
            name="confirm"
          />
          <div className="mdc-line-ripple"></div>
          <label className="mdc-floating-label">Old password</label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.confirm}
        </p>
      </div>
      <div className="action">
        <div>
          <span>Updated {moment(user.password_updated).fromNow()}</span>
          <button className="mdc-button mdc-button--raised" disabled={disabled}>
            <span className="mdc-button__ripple"></span>Save
          </button>
        </div>
      </div>
    </form>
  ) : (
    <div className="placeholder settings-container">
      <div className="line"></div>
    </div>
  );
};
export default Password;
