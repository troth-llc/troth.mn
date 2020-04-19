import React from "react";
import { Progress } from "reactstrap";
import { Link } from "react-router-dom";
import "./style.scss";
const SliderItem = (props) => {
  return (
    <div className="slider-item">
      <div className="item-header">
        <img src={props.src} alt="img" />
      </div>
      <div className="item-container">
        <div className="title">{props.title}</div>
        <div className="project-progress">
          <Progress value={props.progress} />
        </div>
        <div className="status">
          <div className="status-container">
            <div className="count">{props.progress}%</div>
            <span className="title">Project funded</span>
          </div>
          <div className="status-container">
            <div className="count">{props.funded}</div>
            <span className="title">Project Backers</span>
          </div>
          <div className="action">
            <Link to="/" className="action-button">
              Pledge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SliderItem;
