import React from "react";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import { Row, Col } from "reactstrap";
import Information from "./information";
import Password from "./password";
import Email from "./email";
import "./style.scss";
const Info = () => {
  return (
    <div className="settings container p-rem">
      <div className="home-nav">
        <Row className="m-0">
          <Col>
            <NavLink to="/settings/info" className="home-link">
              Info
            </NavLink>
          </Col>
          <Col className="divider-nav">
            <NavLink to="/settings/password" exact className="home-link">
              Password
            </NavLink>
          </Col>
          <Col className="divider-nav">
            <NavLink to="/settings/email" className="home-link">
              Email
            </NavLink>
          </Col>
        </Row>
      </div>
      <div className="mt-3 max-380-auto">
        <Switch>
          <Route exact path="/settings/info" component={Information} />
          <Route exact path="/settings/password" component={Password} />
          <Route exact path="/settings/email" component={Email} />
          <Redirect from="/settings" to="/settings/info" />
        </Switch>
      </div>
    </div>
  );
};
export default Info;
