import React, { useEffect, useState } from "react";
import { Spinner, Col, Row } from "reactstrap";
import axios from "axios";
import ProjectItem from "components/ProjectItem";
import "./style.scss";
const CategoryList = (props) => {
  const [state, setState] = useState(null);
  useEffect(() => {
    axios
      .get("/api/project/category/" + props.match.params.id)
      .then((res) => setState(res.data.result));
  }, []);
  return (
    <div className="browse container">
      {state ? (
        state.length !== 0 ? (
          <>
            <h5 className="text-center pt-3 mb-3">
              Browse {state[0].category.name}
            </h5>
            <p className="f-12 text-center text-muted">
              Total {state.length} projects
            </p>
            <Row>
              {state.map((project) => {
                return (
                  <Col key={project._id} md="4" lg="3" xs="6" className="mb-4">
                    <ProjectItem {...project} portrait="true" />
                  </Col>
                );
              })}
            </Row>
          </>
        ) : (
          <p className="text-center w-100">No projects found</p>
        )
      ) : (
        <div className="w-100 p-3 text-center">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default CategoryList;
