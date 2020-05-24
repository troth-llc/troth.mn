import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProjectItem } from "components";
import { Row, Col, Spinner } from "reactstrap";
import axios from "axios";
const Project = (props) => {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    setProjects(null);
    axios
      .post("/api/search/projects", {
        search: props.match.params.search.trim(),
      })
      .then((response) => setProjects(response.data.project));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.search]);
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
        {projects ? (
          projects.length !== 0 ? (
            projects.map((project) => (
              <ProjectItem key={project._id} {...project} />
            ))
          ) : (
            <p className="text-center text-muted mt-3">No projects found</p>
          )
        ) : (
          <div className="text-center w-100 pt-3">
            <Spinner color="secondary" size="sm" />
          </div>
        )}
      </div>
    </>
  );
};
export default Project;
