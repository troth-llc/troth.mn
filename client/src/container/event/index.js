import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
const Event = (props) => {
  useEffect(() => {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("scroll-lock");
    return () => {
      body.classList.remove("scroll-lock");
    };
  }, [props]);
  return (
    <div className="event">
      <Link to="/calendar">
        <img src={require("assets/image/left-arrow.svg")} alt="back-arrow" />
      </Link>
    </div>
  );
};
export default Event;
