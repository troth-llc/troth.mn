import React, { useEffect, useState, useContext } from "react";
import { MDCDialog } from "@material/dialog";
import { Calendar, FollowDialog } from "components";
import { NavLink, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { User } from "context/user";
import "./style.scss";
const Profile = () => {
  const [calendar, setOpen] = useState(false);
  const [follow, openFollow] = useState(false);
  const { user } = useContext(User);
  useEffect(() => {
    if (user) document.title = `${user.name} (@${user.username}) • Troth`;
    const element = document.querySelectorAll(".Calendar__weekRow");
    element.forEach(el => {
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].classList.contains("-today")) {
          el.classList.add("row-mobile");
          break;
        }
      }
    });
  });
  return (
    <>
      {user && (
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
                  <Link
                    to="/settings/info"
                    className="mdc-button mdc-button--outlined"
                  >
                    <div className="mdc-button__ripple"></div>
                    <span className="mdc-button__label">Edit</span>
                  </Link>
                </span>
                <p className="type">{user.type}</p>
                <ul className="follow">
                  <li>
                    <Tooltip
                      title={`show ${user.followers} people followers`}
                      placement="top"
                    >
                      <p
                        onClick={() => {
                          if (user.followers !== 0) {
                            openFollow({ id: user._id, type: "followers" });
                            const dialog = new MDCDialog(
                              document.querySelector("#follow")
                            );
                            dialog.open();
                          }
                        }}
                      >
                        <span>{user.followers}</span> followers
                      </p>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip
                      title={`show ${user.following} people following`}
                      placement="top"
                    >
                      <p
                        onClick={() => {
                          if (user.following !== 0) {
                            openFollow({ id: user._id, type: "following" });
                            const dialog = new MDCDialog(
                              document.querySelector("#follow")
                            );
                            dialog.open();
                          }
                        }}
                      >
                        <span>{user.following}</span> following
                      </p>
                    </Tooltip>
                  </li>
                </ul>
              </div>
              <div className="info-browser flex">
                <NavLink to="/profile" exact className="info-item">
                  <img
                    src={require("assets/icons/profile-info.svg")}
                    alt="info"
                  />
                  <p>info</p>
                </NavLink>
                <NavLink to="/profile/feed" className="info-item">
                  <img
                    src={require("assets/icons/profile-feed.svg")}
                    alt="info"
                  />
                  <p>feed</p>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="fab-container">
            <button className="mdc-fab" aria-label="Fab">
              <div className="mdc-fab__ripple"></div>
              <span className="mdc-fab__icon material-icons">add</span>
            </button>
          </div>
        </div>
      )}
      <FollowDialog data={follow} />
    </>
  );
};
export default Profile;
