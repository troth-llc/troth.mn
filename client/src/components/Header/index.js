import React, { useEffect, useContext } from "react";
import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCDrawer } from "@material/drawer";
import { MDCList } from "@material/list";
import { MDCDialog } from "@material/dialog";
import { Link, NavLink } from "react-router-dom";
import { User } from "context/user";
import "./style.scss";
const routes = [
  {
    to: "/user/calendar",
    exact: false,
    src: require("assets/icons/calendar.svg"),
    title: "Calendar"
  },
  {
    to: "/user/candidate",
    exact: false,
    src: require("assets/icons/candidate.svg"),
    title: "Candidate Action Status"
  },
  {
    to: "/user/group",
    exact: false,
    src: require("assets/icons/group.svg"),
    title: "Group Polls"
  },
  {
    to: "/user/survey",
    exact: false,
    src: require("assets/icons/survey.svg"),
    title: "Surveys"
  },
  {
    to: "/user/stream",
    exact: false,
    src: require("assets/icons/stream.svg"),
    title: "Live Streams"
  },
  {
    to: "/user/return",
    exact: false,
    src: require("assets/icons/return.svg"),
    title: "Return On Investment"
  }
];
const auth_routes = [
  {
    to: "/user/calendar",
    exact: false,
    src: require("assets/icons/calendar.svg"),
    title: "Calendar"
  },
  {
    to: "/user/candidate",
    exact: false,
    src: require("assets/icons/candidate.svg"),
    title: "Candidate Action Status"
  },
  {
    to: "/user/group",
    exact: false,
    src: require("assets/icons/group.svg"),
    title: "Group Polls"
  },
  {
    to: "/user/survey",
    exact: false,
    src: require("assets/icons/survey.svg"),
    title: "Surveys"
  },
  {
    to: "/user/stream",
    exact: false,
    src: require("assets/icons/stream.svg"),
    title: "Live Streams"
  },
  {
    to: "/user/return",
    exact: false,
    src: require("assets/icons/return.svg"),
    title: "Return On Investment"
  },
  { type: "divider" },
  {
    to: "/settings",
    exact: false,
    auth: true,
    src: require("assets/icons/settings.svg"),
    title: "Settings"
  },
  {
    to: "/logout",
    exact: false,
    src: require("assets/icons/logout.svg"),
    title: "Log out",
    action: e => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    }
  }
];
const Header = () => {
  // Instantiation
  useEffect(() => {
    // header
    new MDCTopAppBar(document.querySelector("#header"));
    // drawer
    const drawerElement = document.querySelector(".mdc-drawer");
    const drawer_btn = document.querySelector("#drawer-btn");
    const listElement = document.querySelector(".mdc-list");
    const list = new MDCList(listElement);
    list.wrapFocus = true;
    listElement.addEventListener("click", () => (drawer.open = false));
    const drawer = MDCDrawer.attachTo(drawerElement);
    // drawer trigger
    drawer_btn.addEventListener("click", () => {
      drawer.open = !drawer.open;
    });
  }, []);
  const { user } = useContext(User);
  return (
    <>
      <header className="mdc-top-app-bar mdc-top-app-bar--fixed" id="header">
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button
              className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
              id="drawer-btn"
            >
              menu
            </button>
            <span className="mdc-top-app-bar__title">Troth</span>
          </section>
          <section
            className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            role="toolbar"
          >
            <button className="material-icons mdc-top-app-bar__action-item mdc-icon-button">
              search
            </button>
            {user === null && (
              <button
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                onClick={() => {
                  const dialog = new MDCDialog(document.querySelector("#auth"));
                  dialog.open();
                  dialog.scrimClickAction = "";
                }}
              >
                account_circle
              </button>
            )}
          </section>
        </div>
      </header>
      {/* drawer */}
      <aside className="mdc-drawer mdc-drawer--modal" id="drawer">
        <div className="mdc-drawer__content">
          <nav className="mdc-list">
            {/* if user logged in render this element */}
            {user !== null ? (
              <>
                <div className="drawer-header">
                  <div className="avatar-image">
                    {user.avatar !== null ? (
                      <img
                        src="https://cdn.discordapp.com/avatars/525589602900377610/7b10cb16b93c5aefa7adcadadbc4a598.png?size=512"
                        alt="sup"
                        className="avatar-img"
                        tabIndex={0}
                      ></img>
                    ) : (
                      <div className="temp-avatar" tabIndex={0}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="user-info">
                      <Link to="/profile" className="name-container">
                        <span className="name">{user.name}</span>
                      </Link>
                      <p
                        className="type"
                        style={{ textTransform: "capitalize" }}
                      >
                        {user.type}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="list-divider"></hr>
              </>
            ) : (
              <div tabIndex={0}></div>
            )}
            {/* home */}
            <NavLink
              to="/"
              exact
              className="mdc-list-item"
              activeClassName="mdc-list-item--selected"
            >
              <i
                className="material-icons mdc-list-item__graphic"
                aria-hidden="true"
              >
                home
              </i>
              <span className="mdc-list-item__text">Home</span>
            </NavLink>
            {/* routes render */}
            {user === null
              ? routes.map((route, index) => {
                  if (route.type === "divider")
                    return <hr className="list-divider" key={index}></hr>;
                  return (
                    <NavLink
                      className="mdc-list-item"
                      to={route.to}
                      key={index}
                      activeClassName="mdc-list-item--selected"
                      onClick={route.action}
                    >
                      <i
                        className="material-icons mdc-list-item__graphic"
                        aria-hidden="true"
                      >
                        <img
                          src={route.src}
                          alt={route.title}
                          className="drawer-icon"
                        />
                      </i>
                      <span className="mdc-list-item__text">{route.title}</span>
                    </NavLink>
                  );
                })
              : auth_routes.map((route, index) => {
                  if (route.type === "divider")
                    return <hr className="list-divider" key={index}></hr>;
                  return (
                    <NavLink
                      className="mdc-list-item"
                      to={route.to}
                      key={index}
                      activeClassName="mdc-list-item--selected"
                      onClick={route.action}
                    >
                      <i
                        className="material-icons mdc-list-item__graphic"
                        aria-hidden="true"
                      >
                        <img
                          src={route.src}
                          alt={route.title}
                          className="drawer-icon"
                        />
                      </i>
                      <span className="mdc-list-item__text">{route.title}</span>
                    </NavLink>
                  );
                })}
          </nav>
        </div>
      </aside>
      <div className="mdc-drawer-scrim"></div>
    </>
  );
};
export default Header;
