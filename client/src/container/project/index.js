import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import ProjectItem from "components/ProjectItem";
import "./style.scss";
import axios from "axios";
const Projects = () => {
  const [state, setstate] = useState(null);
  useEffect(() => {
    axios.get("/api/project/get").then((res) => setstate(res.data.result));
  }, []);
  return (
    <div className="projects container">
      <h5 className="text-center pt-3 mb-3">Your Projects</h5>
      <Row>
        {state ? (
          state.length !== 0 ? (
            state.map((project) => {
              return (
                <Col key={project._id} md="4" lg="3" xs="6" className="mb-4">
                  <ProjectItem {...project} portrait="true" />
                </Col>
              );
            })
          ) : (
              <p className="text-center w-100">No projects found</p>
            )
        ) : (
            <div className="text-center w-100 pt-3">
              <Spinner color="secondary" size="sm" />
            </div>
          )}
      </Row>
      <div className="create">
        <Link to="/project/create" className="default-button">
          Create a Project
        </Link>
      </div>
    </div>
  );
};
export default Projects;
