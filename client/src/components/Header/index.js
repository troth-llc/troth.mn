import React, { useState, useContext } from "react";
import { Navbar, Spinner } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import Drawer, { DrawerAppContent } from "@material/react-drawer";
import Cookies from "js-cookie";
import { User } from "context/user";
import "./style.scss";
const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(User);
  const cookie = Cookies.get("token");
  var dev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const auth_routes = [
    { name: "Home", to: "/", exact: true },
    { name: "Settings", to: "/settings/info", exact: false },
    { name: "About", to: "/about", exact: true },
    {
      name: "Logout",
      to: "/logout",
      exact: false,
      action: (e) => {
        e.preventDefault();
        Cookies.remove("token", {
          path: "/",
          domain: `${dev ? window.location.hostname : ".troth.mn"}`,
          secure: dev ? false : true,
        });
        document.location.reload();
      },
    },
  ];
  const routes = [
    { name: "Home", to: "/", exact: true },
    { name: "About", to: "/about", exact: true },
  ];
  return (
    <>
      <Navbar light className="header">
        <div className="nav-container">
          <button
            className="nav-action"
            id="drawer-button"
            onClick={() => setOpen(true)}
          >
            <img src={require("assets/image/menu.svg")} alt="menu"></img>
          </button>
          <Link to="/" className="brand-link">
            <h5 className="brand-name m-0">TROTH</h5>
          </Link>
          <Link to="/search" className="nav-action">
            <img src={require("assets/image/search.svg")} alt="menu"></img>
          </Link>
        </div>
      </Navbar>
      <Drawer modal open={open} onClose={() => setOpen(false)}>
        <DrawerAppContent>
          <div
            className="drawer-content"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            <div className="drawer-header">
              {cookie ? (
                <div className="drawer-profile d-flex flex-row">
                  {user ? (
                    <>
                      <div className="drawer-avatar">
                        {user.avatar ? (
                          <div
                            className="header-avatar-picture"
                            style={{ backgroundImage: `url(${user.avatar})` }}
                          />
                        ) : (
                          user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="drawer-user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-type">{user.type}</div>
                      </div>
                    </>
                  ) : (
                    <div className="drawer-loader">
                      <Spinner color="secondary" size="sm" />
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="drawer-signin">
                  Account
                </Link>
              )}
            </div>
            <div className="drawer-link">
              {cookie
                ? auth_routes.map((route, index) => {
                    return (
                      <NavLink
                        exact={route.exact}
                        to={route.to}
                        key={index}
                        onClick={route.action}
                      >
                        {route.name}
                      </NavLink>
                    );
                  })
                : routes.map((route, index) => {
                    return (
                      <NavLink
                        exact={route.exact}
                        to={route.to}
                        key={index}
                        onClick={route.action}
                      >
                        {route.name}
                      </NavLink>
                    );
                  })}
            </div>
            <div className="drawer-footer">
              <p className="text-muted text-center mb-0 f-12">
                &copy; {new Date().getFullYear()} TROTH
                <br />
                Beta v0.9.0
              </p>
            </div>
          </div>
        </DrawerAppContent>
      </Drawer>
    </>
  );
};
export default Header;
