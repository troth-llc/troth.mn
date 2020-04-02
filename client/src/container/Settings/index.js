import React, { useEffect, useContext, useState } from "react";
import { MDCTabBar } from "@material/tab-bar";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import { User } from "context/user";
import { MDCSelect } from "@material/select";
import "./style.scss";
const Search = () => {
  const path = window.location.pathname.split("/");
  const { user } = useContext(User);
  useEffect(() => {
    new MDCTabBar(document.querySelector("#settings-tab"));
    try {
      document
        .querySelector(`.mdc-tab-indicator[tab=${path[path.length - 1]}]`)
        .classList.add("mdc-tab-indicator--active");
    } catch (err) {
      console.log("🤔");
    }
    // gender update
    const select = new MDCSelect(document.querySelector("#gender-select-info"));
    select.value = user && user.gender;
    select.listen("MDCSelect:change", () => {
      console.log(select.value);
    });
  }, []);
  return (
    <div className="settings-container">
      <div className="mdc-tab-bar" role="tablist" id="settings-tab">
        <div className="mdc-tab-scroller">
          <div className="mdc-tab-scroller__scroll-area">
            <div className="mdc-tab-scroller__scroll-content">
              <NavLink
                to="/settings/info"
                activeClassName="mdc-tab--active"
                className="mdc-tab"
                role="tab"
              >
                <span className="mdc-tab__content">
                  <span
                    className="mdc-tab__icon material-icons"
                    aria-hidden="true"
                  >
                    account_circle
                  </span>
                  <span className="mdc-tab__text-label">Information</span>
                </span>
                <span className="mdc-tab-indicator" tab="info">
                  <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                </span>
                <span className="mdc-tab__ripple"></span>
              </NavLink>
              <NavLink
                to="/settings/email"
                activeClassName="mdc-tab--active"
                className="mdc-tab"
                role="tab"
              >
                <span className="mdc-tab__content">
                  <span
                    className="mdc-tab__icon material-icons"
                    aria-hidden="true"
                  >
                    email
                  </span>
                  <span className="mdc-tab__text-label">Email</span>
                </span>
                <span className="mdc-tab-indicator" tab="email">
                  <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                </span>
                <span className="mdc-tab__ripple"></span>
              </NavLink>
              <NavLink
                to="/settings/password"
                activeClassName="mdc-tab--active"
                className="mdc-tab"
                role="tab"
              >
                <span className="mdc-tab__content">
                  <span
                    className="mdc-tab__icon material-icons"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                  <span className="mdc-tab__text-label">Password</span>
                </span>
                <span className="mdc-tab-indicator" tab="password">
                  <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                </span>
                <span className="mdc-tab__ripple"></span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div id="settings-container">
        <Switch>
          {/* information */}
          <Route exact path="/settings/info">
            <form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <span className="notice">
                Personal Information Provide your personal information. Some
                info may be visible to other people using Troth.
              </span>
              <div className="input-container">
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    required
                    autoComplete="off"
                    defaultValue={user && user.name}
                    name="name"
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Name</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  error message look like this
                </p>
              </div>
              <div className="input-container">
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    required
                    autoComplete="off"
                    defaultValue={user && user.username}
                    name="username"
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Username</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  error message look like this
                </p>
              </div>
              <div className="input-container">
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    type="url"
                    autoComplete="off"
                    name="web"
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Website</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  error message look like this
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
                      <div
                        className="mdc-select__selected-text"
                        aria-required="true"
                      >
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
                  error message look like this
                </p>
              </div>
              <div className="input-container">
                <div className="mdc-text-field mdc-text-field--textarea">
                  <textarea
                    className="mdc-text-field__input"
                    rows="2"
                    cols="15"
                    name="bio"
                  ></textarea>
                  <div className="mdc-notched-outline">
                    <div className="mdc-notched-outline__leading"></div>
                    <div className="mdc-notched-outline__notch">
                      <label className="mdc-floating-label">Bio</label>
                    </div>
                    <div className="mdc-notched-outline__trailing"></div>
                  </div>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  error message look like this
                </p>
              </div>
              <div className="action">
                <div>
                  <button className="mdc-button mdc-button--raised" disabled>
                    <span className="mdc-button__ripple"></span>Save
                  </button>
                </div>
              </div>
            </form>
          </Route>
          <Route exact path="/settings/email">
            <h5 className="text-center">tab item 2</h5>
          </Route>
          <Route exact path="/settings/password">
            <h5 className="text-center">tab item 3</h5>
          </Route>
          <Redirect from="/settings" to="/settings/info" />
        </Switch>
      </div>
    </div>
  );
};
export default Search;
