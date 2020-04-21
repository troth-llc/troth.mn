import React from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
import "./style.scss";
const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <Row>
        <Col>
          <NavLink to="/" exact className="bottom-nav-item">
            <object
              type="image/svg+xml"
              data={require("assets/image/home.svg")}
              aria-label="home nav"
              className="1"
            />
          </NavLink>
        </Col>
        <Col>
          <NavLink to="/project" exact className="bottom-nav-item">
            <object
              type="image/svg+xml"
              data={require("assets/image/project.svg")}
              aria-label="project nav"
              className="1"
            />
          </NavLink>
        </Col>
        <Col>
          <NavLink to="/notifications" className="bottom-nav-item">
            <object
              type="image/svg+xml"
              data={require("assets/image/notification.svg")}
              aria-label="user notification"
              className="1"
            />
          </NavLink>
        </Col>
        <Col>
          <NavLink to="/profile" className="bottom-nav-item">
            <object
              type="image/svg+xml"
              data={require("assets/image/user.svg")}
              aria-label="user nav"
              className="1"
            />
          </NavLink>
        </Col>
      </Row>
    </div>
  );
};
export default BottomNav;
