import React, { useEffect, useContext, useState } from "react";
import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCDrawer } from "@material/drawer";
import { MDCList } from "@material/list";
import { MDCMenuSurface } from "@material/menu-surface";
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
    to: "/calendar",
    exact: false,
    src: require("assets/icons/calendar.svg"),
    title: "Calendar"
  },
  {
    to: "/candidate",
    exact: false,
    src: require("assets/icons/candidate.svg"),
    title: "Candidate Action Status"
  },
  {
    to: "/group",
    exact: false,
    src: require("assets/icons/group.svg"),
    title: "Group Polls"
  },
  {
    to: "/survey",
    exact: false,
    src: require("assets/icons/survey.svg"),
    title: "Surveys"
  },
  {
    to: "/stream",
    exact: false,
    src: require("assets/icons/stream.svg"),
    title: "Live Streams"
  },
  {
    to: "/return",
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
  }
];
const Header = props => {
  const [mobileSearch, setMobileSearch] = useState(false);
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
    // Initialize either modal or dismissable
    const initModalDrawer = () => {
      drawerElement.classList.remove(
        "mdc-drawer--dismissible",
        "mdc-drawer--open"
      );
      drawerElement.classList.add("mdc-drawer--modal");
      const drawer = MDCDrawer.attachTo(drawerElement);
      drawer.open = false;
      return drawer;
    };

    const initDismissableDrawer = () => {
      drawerElement.classList.remove("mdc-drawer--modal");
      drawerElement.classList.add(
        "mdc-drawer--dismissible",
        "mdc-drawer--open"
      );
      const drawer = MDCDrawer.attachTo(drawerElement);
      drawer.open = true;
      return drawer;
    };

    let drawer = window.matchMedia("(max-width: 900px)").matches
      ? initModalDrawer()
      : initDismissableDrawer();
    listElement.addEventListener("click", () => {
      if (drawerElement.classList.contains("mdc-drawer--modal"))
        drawer.open = false;
      else drawer.open = true;
    });
    // drawer trigger
    drawer_btn.addEventListener("click", () => {
      drawer.open = !drawer.open;
    });
    const resizeHandler = () => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        drawer.destroy();
        drawer = initModalDrawer();
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        drawer.destroy();
        drawer = initDismissableDrawer();
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
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
            <Link to="/" className="mdc-top-app-bar__title">
              <img src={require("../../assets/img/navlogo.png")} />
            </Link>
          </section>
          <section className="nav-middle">
            <div
              className={`search-outline ${mobileSearch ? "open-search" : ""}`}
            >
              <div className="search">
                <form
                  onSubmit={e => {
                    if (document.getElementById("searchInput").value) {
                      window.location.replace(
                        "/search/" +
                          encodeURIComponent(
                            document.getElementById("searchInput").value
                          )
                      );
                    }
                    e.preventDefault();
                  }}
                >
                  <input
                    id="searchInput"
                    aria-labelledby="prompt"
                    type="search"
                    placeholder="Search"
                    name="q"
                    autoComplete="off"
                  />
                </form>
              </div>
              <button
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button cancel-search"
                onClick={() => {
                  document.getElementById("searchInput").value = "";
                  setMobileSearch(false);
                }}
              >
                close
              </button>
            </div>
          </section>
          <section
            className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            role="toolbar"
          >
            <button
              className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
              id="search-button"
              onClick={e => {
                setMobileSearch(true);
                var el = document.querySelector("#searchInput");
                setTimeout(() => {
                  el.focus();
                }, 100);
              }}
            >
              search
            </button>
            {user === null ? (
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
            ) : (
              <>
                <button className="material-icons mdc-top-app-bar__action-item mdc-icon-button">
                  notifications
                </button>
                <div className="toolbar mdc-menu-surface--anchor">
                  <button
                    className="user--username"
                    onClick={() => {
                      const menu = new MDCMenuSurface(
                        document.querySelector("#account")
                      );
                      document
                        .querySelector("#account")
                        .addEventListener("click", () => menu.close());
                      menu.open();
                    }}
                  >
                    <i className="material-icons">account_circle</i>
                    <span>{user.username}</span>
                    <i className="material-icons i-dropdown">arrow_drop_down</i>
                  </button>
                  <div className="mdc-menu-surface" id="account">
                    <ul
                      className="mdc-list"
                      role="menu"
                      aria-hidden="true"
                      aria-orientation="vertical"
                      tabIndex="-1"
                    >
                      <Link
                        to="/profile"
                        className="mdc-list-item"
                        role="menuitem"
                      >
                        <span className="mdc-list-item__text">Profile</span>
                      </Link>
                      <li className="mdc-list-divider" role="separator"></li>
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
                </div>
              </>
            )}
          </section>
        </div>
      </header>
      {/* drawer */}
      <aside className="mdc-drawer mdc-drawer--modal" id="drawer">
        <div className="mdc-drawer__content">
          <nav className="mdc-list">
            <div tabIndex={0}></div>
            {/* home */}
            <NavLink
              to="/"
              exact
              className="mdc-list-item"
              activeClassName=""
              activeStyle={{
                backgroundColor: "rgba(0,0,0,0.07)"
              }}
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
                    return <hr className="mdc-list-divider" key={index} />;
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
                    return <hr className="mdc-list-divider" key={index} />;
                  return (
                    <NavLink
                      className="mdc-list-item"
                      to={route.to}
                      key={index}
                      activeClassName=""
                      activeStyle={{
                        backgroundColor: "rgba(0,0,0,0.07)"
                      }}
                      exact={route.exact}
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
