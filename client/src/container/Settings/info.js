import React, { useEffect, useContext, useState } from "react";
import { MDCSelect } from "@material/select";
import { User } from "context/user";
import axios from "axios";
import moment from "moment";
const Info = () => {
  const [update, setUpdate] = useState({
    name: "",
    username: "",
    website: "",
    gender: "",
    about: ""
  });
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState({
    name: "",
    username: "",
    website: "",
    gender: "",
    about: ""
  });
  const [gender, setGender] = useState("");
  const { user } = useContext(User);
  useEffect(() => {
    if (user) {
      const select = new MDCSelect(
        document.querySelector("#gender-select-info")
      );
      setUpdate({
        name: user.name,
        username: user.username,
        website: user.website,
        about: user.about,
        disabled: true
      });
      select.value = user.gender;
      setGender(user.gender);
      select.listen("MDCSelect:change", () => {
        setGender(select.value);
        setDisabled(false);
      });
    }
  }, [user]);
  return user !== null ? (
    <form
      onSubmit={e => {
        e.preventDefault();
        const { name, username, website, about } = update;
        setDisabled(true);
        axios
          .post("/api/update/info", {
            name,
            username,
            website,
            about,
            gender
          })
          .then(response => {
            if (response.data.status) window.location.reload();
            else {
              let errors = response.data.errors;
              errors.map(error => setError({ [error.param]: error.msg }));
              setDisabled(false);
            }
          });
      }}
    >
      <span className="notice">
        Personal Information Provide your personal information. Some info may be
        visible to other people using Troth.
      </span>
      <div className="input-container">
        <div className="mdc-text-field">
          <input
            className="mdc-text-field__input"
            required
            autoComplete="off"
            value={update.name}
            onChange={e => {
              setDisabled(false);
              setUpdate({
                ...update,
                [e.target.name]: e.target.value
              });
            }}
            name="name"
          />
          <div className="mdc-line-ripple"></div>
          <label
            className={`mdc-floating-label ${
              user.name ? "mdc-floating-label--float-above" : ""
            }`}
          >
            Name
          </label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.name}
        </p>
      </div>
      <div className="input-container">
        <div className="mdc-text-field">
          <input
            className="mdc-text-field__input"
            required
            autoComplete="off"
            value={update.username}
            onChange={e => {
              setDisabled(false);
              setUpdate({
                ...update,
                [e.target.name]: e.target.value,
                disabled: false
              });
            }}
            name="username"
          />
          <div className="mdc-line-ripple"></div>
          <label
            className={`mdc-floating-label ${
              user.username ? "mdc-floating-label--float-above" : ""
            }`}
          >
            Username
          </label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.username}
        </p>
      </div>
      <div className="input-container">
        <div className="mdc-text-field">
          <input
            className="mdc-text-field__input"
            type="url"
            autoComplete="off"
            value={update.website}
            name="website"
            onChange={e => {
              setDisabled(false);
              setUpdate({
                ...update,
                [e.target.name]: e.target.value,
                disabled: false
              });
            }}
          />
          <div className="mdc-line-ripple"></div>
          <label
            className={`mdc-floating-label ${
              user.website ? "mdc-floating-label--float-above" : ""
            }`}
          >
            Website
          </label>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.website}
        </p>
      </div>
      <div className="input-container">
        <div className="flex center">
          <div
            className="mdc-select mdc-select--no-label"
            id="gender-select-info"
            style={{ width: "100%" }}
          >
            <div className="mdc-select__anchor">
              <i className="mdc-select__dropdown-icon"></i>
              <div className="mdc-select__selected-text" aria-required="true">
                Gender
              </div>
              <span className="mdc-line-ripple"></span>
            </div>
            <div className="mdc-select__menu mdc-menu mdc-menu-surface">
              <ul className="mdc-list">
                <li className="mdc-list-item" data-value="male">
                  <span className="mdc-list-item__text">Male</span>
                </li>
                <li className="mdc-list-item" data-value="female">
                  <span className="mdc-list-item__text">Female</span>
                </li>
                <li className="mdc-list-item" data-value="custom">
                  <span className="mdc-list-item__text">Custom</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.gender}
        </p>
      </div>
      <div className="input-container">
        <div className="mdc-text-field mdc-text-field--textarea">
          <textarea
            className="mdc-text-field__input"
            rows="2"
            cols="15"
            name="about"
            value={update.about}
            onChange={e => {
              setDisabled(false);
              setUpdate({
                ...update,
                [e.target.name]: e.target.value
              });
            }}
          ></textarea>
          <div
            className={`mdc-notched-outline ${
              user.about
                ? "mdc-notched-outline--upgraded mdc-notched-outline--notched"
                : ""
            }`}
          >
            <div className="mdc-notched-outline__leading"></div>
            <div
              className="mdc-notched-outline__notch"
              style={{ width: user.about && "40.25px" }}
            >
              <label
                className={`mdc-floating-label ${
                  user.about ? "mdc-floating-label--float-above" : ""
                }`}
              >
                About
              </label>
            </div>
            <div className="mdc-notched-outline__trailing"></div>
          </div>
        </div>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
          {error.about}
        </p>
      </div>
      <div className="action">
        <div>
          <span>Updated {moment(user.updated).fromNow()}</span>
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
export default Info;
