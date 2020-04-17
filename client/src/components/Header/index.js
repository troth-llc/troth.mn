import React from "react";
import { Navbar } from "reactstrap";
import "./style.scss";
const Header = () => {
  return (
    <Navbar light className="header">
      <div className="nav-container">
        <button className="nav-action" id="drawer-button">
          <img src={require("assets/image/menu.svg")} alt="menu"></img>
        </button>
        <h5 className="brand-name m-0">TROTH</h5>
        <button className="nav-action">
          <img src={require("assets/image/search.svg")} alt="menu"></img>
        </button>
      </div>
    </Navbar>
  );
};
export default Header;
