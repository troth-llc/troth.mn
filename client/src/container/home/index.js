import React from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Scrollable, ProjectItem } from "components";
import "./style.scss";
const Home = () => {
  const projects = [
    {
      title: "Hello world",
      src: require("assets/image/project/mini.png"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/mini.png"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/mini.png"),
      progress: 67,
      funded: 977,
    },
    {
      title: "Hello world",
      src: require("assets/image/project/mini.png"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/mini.png"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/mini.png"),
      progress: 67,
      funded: 977,
    },
  ];
  return (
    <>
      <div className="home-nav">
        <Row className="m-0">
          <Col>
            <NavLink to="/" className="home-link">
              Popular
            </NavLink>
          </Col>
          <Col className="divider-nav">
            <NavLink to="/newest" className="home-link">
              Newest
            </NavLink>
          </Col>
          <Col>
            <NavLink to="/ending" className="home-link">
              Ending
            </NavLink>
          </Col>
        </Row>
        <Scrollable />
        <div className="project-container">
          <Row>
            {projects.map((project, index) => (
              <Col xs={6} key={index} className="mb-3">
                <ProjectItem {...project} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};
export default Home;
