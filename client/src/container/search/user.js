import React from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
const User = () => {
  return (
    <>
      <div className="search-nav">
        <div className="home-nav">
          <Row className="m-0">
            <Col>
              <NavLink to="/search/project/" className="home-link">
                Projects
              </NavLink>
            </Col>
            <Col className="divider-nav">
              <NavLink to="/search/user/" className="home-link">
                Users
              </NavLink>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default User;
