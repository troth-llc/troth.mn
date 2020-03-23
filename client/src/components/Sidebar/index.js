import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { MDCDialog } from "@material/dialog";
import { MDCMenu } from "@material/menu";
import { User } from "context/user";
import "./style.scss";
const guest = [
  {
    type: "guest-action",
    title: "Login",
    style: { padding: "20px", fontSize: "28px" }
  },
  {
    to: "/",
    type: "link",
    title: "Home",
    background: require("assets/img/sidebar/home.png"),
    exact: true
  },
  {
    to: "/search",
    type: "link",
    title: "Search",
    background: require("assets/img/sidebar/search.png"),
    exact: false,
    style: {}
  },
  {
    to: "/about",
    type: "link",
    title: "About",
    background: require("assets/img/sidebar/logo.png"),
    exact: false,
    style: {},
    class: " item-about"
  }
];
const link = [
  {
    to: "/",
    type: "link",
    title: "Home",
    background: require("assets/img/sidebar/home.png"),
    exact: true
  },
  {
    to: "/notification",
    type: "link",
    title: "Notification",
    background: require("assets/img/sidebar/notification.png"),
    exact: false,
    style: { padding: "26px" }
  },
  {
    to: "/followers",
    type: "link",
    title: "Followers",
    background: require("assets/img/sidebar/friends.png"),
    exact: false,
    style: { height: "19px" }
  },
  {
    to: "/comments",
    type: "link",
    title: "Comments",
    background: require("assets/img/sidebar/comments.png"),
    exact: false,
    style: { padding: "24px" }
  },
  {
    to: "/search",
    type: "link",
    title: "Search",
    background: require("assets/img/sidebar/search.png"),
    exact: false,
    style: {}
  },
  {
    to: "/settings",
    type: "link",
    title: "Settings",
    background: require("assets/img/sidebar/settings.png"),
    exact: false,
    style: { padding: "24px" }
  },
  {
    to: "/about",
    type: "link",
    title: "About",
    background: require("assets/img/sidebar/logo.png"),
    exact: false,
    style: {},
    class: " item-about"
  }
];
const Sidebar = () => {
  const { user } = useContext(User);
  return (
    <div className="sidebar" id="sidebar">
      {user !== null ? (
        <>
          {/* menu */}
          <div className="mdc-menu mdc-menu-surface" id="profile-menu">
            <ul
              className="mdc-list"
              role="menu"
              aria-hidden="true"
              aria-orientation="vertical"
              tabIndex="-1"
            >
              <Link to="/profile" className="mdc-list-item" role="menuitem">
                <span className="mdc-list-item__text">Profile</span>
              </Link>
              <li
                className="mdc-list-item"
                role="menuitem"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
              >
                <span className="mdc-list-item__text">Logout</span>
              </li>
            </ul>
          </div>
          <div className="sidebar-item">
            <Tooltip title={user.username + " - Profile"} placement="right">
              <NavLink
                to="/profile"
                className="avatar-link flex"
                onClick={e => {
                  e.preventDefault();
                  const menu = new MDCMenu(
                    document.querySelector("#profile-menu")
                  );
                  menu.open = true;
                }}
              >
                {user.avatar !== null ? (
                  <img
                    src="https://cdn.discordapp.com/avatars/525589602900377610/7b10cb16b93c5aefa7adcadadbc4a598.png?size=512"
                    alt={user.name}
                    className="sidebar-avatar"
                  />
                ) : (
                  <div className="temp-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </NavLink>
            </Tooltip>
          </div>
          {link.map((route, index) => {
            return (
              <div
                className={`sidebar-item ${route.class ? route.class : ""}`}
                key={index}
              >
                <NavLink to={route.to} exact={route.exact}>
                  <Tooltip title={route.title} placement="right">
                    <img
                      src={route.background}
                      alt={route.title}
                      style={route.style}
                    />
                  </Tooltip>
                </NavLink>
              </div>
            );
          })}
        </>
      ) : (
        guest.map((route, index) => {
          return route.type === "guest-action" ? (
            <div className={`sidebar-item ${route.type}`} key={index}>
              <div
                to={route.to}
                onClick={() => {
                  const dialog = new MDCDialog(document.querySelector("#auth"));
                  dialog.open();
                  dialog.scrimClickAction = "";
                }}
              >
                <Tooltip title={route.title} placement="right">
                  <i className="material-icons" style={route.style}>
                    account_circle
                  </i>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div
              className={`sidebar-item ${route.class ? route.class : ""}`}
              key={index}
            >
              <NavLink to={route.to} exact={route.exact}>
                <Tooltip title={route.title} placement="right">
                  <img
                    src={route.background}
                    alt={route.title}
                    style={route.style}
                  />
                </Tooltip>
              </NavLink>
            </div>
          );
        })
      )}
    </div>
  );
};
export default Sidebar;
