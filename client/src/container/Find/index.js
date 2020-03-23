import React, { useState, useEffect, useContext } from "react";
import { User } from "context/user";
import { Calendar } from "components";
import { NavLink } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { Loader } from "components";
import axios from "axios";
const Find = props => {
  const [user, setUser] = useState(null);
  const [calendar, setOpen] = useState(false);
  useEffect(() => {
    axios.get("/api/user/" + props.match.params.username).then(response => {
      if (response.data.status) setUser(response.data.user);
    });
    const element = document.querySelectorAll(".Calendar__weekRow");
    element.forEach(el => {
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].classList.contains("-today")) {
          el.classList.add("row-mobile");
          break;
        }
      }
    });
  }, []);
  const { user: current } = useContext(User);
  return (
    <>
      {user ? (
        <div id="profile">
          <div className="profile-container">
            <div className="profile-cover">
              <div className="cover-profile center">
                {user.avatar !== null ? (
                  <img
                    src="https://cdn.discordapp.com/avatars/525589602900377610/7b10cb16b93c5aefa7adcadadbc4a598.png?size=512"
                    alt="sup"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="mobile-name">{user.name}</span>
              </div>
            </div>
          </div>
          <div className="flex information-container">
            <div
              className={
                calendar ? "calendar-open calendar" : "calendar-closed calendar"
              }
            >
              <div className="profile-image">
                {user.avatar !== null ? (
                  <img
                    src="https://cdn.discordapp.com/avatars/525589602900377610/7b10cb16b93c5aefa7adcadadbc4a598.png?size=512"
                    alt="sup"
                    className="avatar-img"
                  />
                ) : (
                  <div className="emp-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <Calendar />
                <div className="flex center">
                  <button
                    className="mdc-icon-button material-icons expand"
                    onClick={() => setOpen(!calendar)}
                  >
                    {calendar ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </button>
                </div>
              </div>
            </div>
            <div className="info-container">
              <div className="user">
                <span className="name">
                  {user.name}{" "}
                  {user.verified && (
                    <Tooltip title="Verified" placement="bottom">
                      <img
                        src={require("assets/icons/badge-verified.svg")}
                        alt=""
                        className="badge"
                      ></img>
                    </Tooltip>
                  )}
                  {current !== null && (
                    <button
                      className="mdc-button mdc-button--outlined"
                      onClick={() => alert(current._id)}
                    >
                      <div className="mdc-button__ripple"></div>
                      <span className="mdc-button__label">Follow</span>
                    </button>
                  )}
                </span>
                <p className="type">{user.type}</p>
              </div>
              <div className="info-browser flex">
                <NavLink to={`/${user.username}`} exact className="info-item">
                  <img
                    src={require("assets/icons/profile-info.svg")}
                    alt="info"
                  />
                  <p>info</p>
                </NavLink>
                <NavLink to={`/${user.username}/feed`} className="info-item">
                  <img
                    src={require("assets/icons/profile-feed.svg")}
                    alt="info"
                  />
                  <p>feed</p>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default Find;
