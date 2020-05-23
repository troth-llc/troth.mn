import React from "react";
import { Row, Col } from "reactstrap";
import "./style.scss";
const Projects = () => {
  return (
    <div className="projects">
      <Row>
        <Col sm="6" md="3" lg>
          <h5 className="text-center">Your Projects</h5>
        </Col>
      </Row>
    </div>
  );
};
export default Projects;
