import React from "react";
import { Progress } from "reactstrap";
import { Link } from "react-router-dom";
import "./style.scss";
const ProjectItem = (props) => {
  return props.portrait ? (
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
  ) : (
    <div className="project-item-landscape ">
      <Link to="/" className="flex-row d-flex">
        <div className="project-photo">
          <img src={props.src} alt={props.title} />
        </div>
        <div className="project-detail">
          <div className="project-title">{props.title}</div>
          <div className="project-progress">
            <Progress value={props.progress} />
          </div>
          <div className="d-flex flex-row">
            <div className="status-info d-flex flex-row mr-4">
              <div className="count">{props.progress}% </div>
              <div className="text ml-1"> - Funded</div>
            </div>
            <div className="status-info d-flex flex-row">
              <div className="count">{props.funded}</div>
              <div className="text ml-1"> - Backer</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ProjectItem;
