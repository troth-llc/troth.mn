import React from "react";
import "./style.scss";
const Loader = props => {
  return (
    <div className="loader">
      <svg
        className="spinner"
        width="32px"
        height="32px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="circle"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="28"
        ></circle>
      </svg>
    </div>
  );
};
export default Loader;
