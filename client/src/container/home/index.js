import React from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Scrollable } from "components";
import "./style.scss";
const Home = () => {
  return (
    <>
      <div className="home-nav">
        <Row className="m-0">
          <Col>
            <NavLink to="/">Popular</NavLink>
          </Col>
          <Col className="divider-nav">
            <NavLink to="/newest">Newest</NavLink>
          </Col>
          <Col>
            <NavLink to="/ending">Ending</NavLink>
          </Col>
        </Row>
        <Scrollable />
      </div>
    </>
  );
};
export default Home;
