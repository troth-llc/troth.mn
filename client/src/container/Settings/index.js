import React, { useEffect, useState } from "react";
import { MDCTabBar } from "@material/tab-bar";
import { NavLink, Switch, Route } from "react-router-dom";
import "./style.scss";
const Search = () => {
  const [tab, setTab] = useState(0);
  const path = window.location.pathname.split("/");
  useEffect(() => {
    new MDCTabBar(document.querySelector("#settings-tab"));
    try {
      document
        .querySelector(`.mdc-tab-indicator[tab=${path[path.length - 1]}]`)
        .classList.add("mdc-tab-indicator--active");
    } catch (err) {}
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
          <Route exact path="/settings/info">
            <h5 className="text-center">tab item 1</h5>
          </Route>
          <Route exact path="/settings/email">
            <h5 className="text-center">tab item 2</h5>
          </Route>
          <Route exact path="/settings/password">
            <h5 className="text-center">tab item 3</h5>
          </Route>
        </Switch>
      </div>
    </div>
  );
};
export default Search;
