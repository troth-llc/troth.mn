import React from "react";
import { NavLink } from "react-router-dom";
import { ProjectItem } from "components";
import { Row, Col } from "reactstrap";
const Project = (props) => {
  const projects = [
    {
      title: "Hello world",
      src: require("assets/image/project/landscape.jpg"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/landscape.jpg"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/landscape.jpg"),
      progress: 67,
      funded: 977,
    },
    {
      title: "Hello world",
      src: require("assets/image/project/landscape.jpg"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/landscape.jpg"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/landscape.jpg"),
      progress: 67,
      funded: 977,
    },
  ];
  return (
    <>
      <div className="search-nav">
        <div className="home-nav">
          <Row className="m-0">
            <Col>
              <NavLink
                to={"/search/project/" + props.match.params.search}
                className="home-link"
              >
                Projects
              </NavLink>
            </Col>
            <Col className="divider-nav">
              <NavLink
                to={"/search/user/" + props.match.params.search}
                className="home-link"
              >
                Users
              </NavLink>
            </Col>
          </Row>
        </div>
      </div>
      <div className="search-projects">
        {projects.map((project, index) => (
          <ProjectItem key={index} {...project} />
        ))}
      </div>
    </>
  );
};
export default Project;
