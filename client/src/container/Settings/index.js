import React, { useEffect } from "react";
import { MDCTabBar } from "@material/tab-bar";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import Info from "./info";
import Password from "./password";
import Email from "./email";
import "./style.scss";
const Search = () => {
  const path = window.location.pathname.split("/");
  useEffect(() => {
    new MDCTabBar(document.querySelector("#settings-tab"));
    try {
      document
        .querySelector(`.mdc-tab-indicator[tab=${path[path.length - 1]}]`)
        .classList.add("mdc-tab-indicator--active");
    } catch (err) {
      console.log("🤔");
    }
  }, [path]);
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
          <Route exact path="/settings/info" component={Info} />
          <Route exact path="/settings/email" component={Email} />
          <Route exact path="/settings/password" component={Password} />
          <Redirect from="/settings" to="/settings/info" />
        </Switch>
      </div>
    </div>
  );
};
export default Search;
