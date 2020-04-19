import React from "react";
import { Progress } from "reactstrap";
import { Link } from "react-router-dom";
import "./style.scss";
const ProjectItem = (props) => {
  return (
    <div className="project-item">
      <Link to="/">
        <div className="project-header">
          <img src={props.src} alt="img" />
        </div>
        <div className="project-detail">
          <div className="project-title">{props.title}</div>
          <div className="project-progress">
            <Progress value={props.progress} />
          </div>
          <div className="status-info">
            <div className="count">{props.progress}%</div>
            <div className="text">Project Funded</div>
          </div>
          <hr className="project-divider" />
          <div className="status-info">
            <div className="count">{props.funded}</div>
            <div className="text">Project Backer</div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ProjectItem;
