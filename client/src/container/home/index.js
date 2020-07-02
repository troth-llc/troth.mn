import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Scrollable, ProjectItem } from "components";
import "./style.scss";
const Home = () => {
  const projects = [
    {
      title: "Hello world",
      cover: require("assets/image/project/mini.png"),
      progress: 20,
      funded: 350,
      portrait: true,
    },
    {
      title: "Hello Troth",
      cover: require("assets/image/project/mini.png"),
      progress: 81,
      funded: 52,
      portrait: true,
    },
    {
      title: "testing",
      cover: require("assets/image/project/mini.png"),
      progress: 67,
      funded: 977,
      portrait: true,
    },
    {
      title: "Hello world",
      cover: require("assets/image/project/mini.png"),
      progress: 20,
      funded: 350,
      portrait: true,
    },
    {
      title: "Hello Troth",
      cover: require("assets/image/project/mini.png"),
      progress: 81,
      funded: 52,
      portrait: true,
    },
    {
      title: "testing",
      cover: require("assets/image/project/mini.png"),
      progress: 67,
      funded: 977,
      portrait: true,
    },
  ];
  useEffect(() => {
    // if (window.screen.width >= 786) window.location.href = "/coming-soon";
    // window.location.href = "https://capstone.troth.mn?ref=troth";
  }, []);
  return (
    <div className="d-flex flex-column container home-container">
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
      </div>
      <Scrollable />
      <div className="project-container">
        <Row>
          {projects.map((project, index) => (
            <Col md="4" lg="3" xs="6" key={index} className="mb-3">
              <ProjectItem {...project} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
export default Home;
