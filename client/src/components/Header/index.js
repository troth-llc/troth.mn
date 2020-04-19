import React from "react";
import { Navbar } from "reactstrap";
import { Link } from "react-router-dom";
import "./style.scss";
const Header = () => {
  return (
    <Navbar light className="header">
      <div className="nav-container">
        <button className="nav-action" id="drawer-button">
          <img src={require("assets/image/menu.svg")} alt="menu"></img>
        </button>
        <Link to="/" className="brand-link">
          <h5 className="brand-name m-0">TROTH</h5>
        </Link>
        <Link to="search" className="nav-action">
          <img src={require("assets/image/search.svg")} alt="menu"></img>
        </Link>
      </div>
    </Navbar>
  );
};
export default Header;
