import React, { useState, useContext } from "react";
import { Navbar, Spinner } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import Drawer, { DrawerAppContent } from "@material/react-drawer";
import { useCookies } from "react-cookie";
import { User } from "context/user";
import "./style.scss";
const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(User);
  const [cookies, , removeCookie] = useCookies("token");
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
              {cookies.token ? (
                <div className="drawer-profile d-flex flex-row">
                  {user ? (
                    <>
                      <div className="drawer-avatar">T</div>
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
                  Sign in
                </Link>
              )}
            </div>
            <div className="drawer-link">
              <NavLink exact to="/">
                Home
              </NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <NavLink
                to="/logout"
                onClick={(e) => {
                  e.preventDefault();
                  removeCookie("token");
                  document.location.reload();
                }}
              >
                Logout
              </NavLink>
            </div>
          </div>
        </DrawerAppContent>
      </Drawer>
    </>
  );
};
export default Header;
