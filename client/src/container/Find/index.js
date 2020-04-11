import React, { useState, useEffect, useContext } from "react";
import { User } from "context/user";
import { MDCDialog } from "@material/dialog";
import { Calendar, FollowDialog } from "components";
import { NavLink, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { Loader } from "components";
import axios from "axios";
const Find = (props) => {
  const [user, setUser] = useState(null);
  const [following, setFollow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendar, setOpen] = useState(false);
  const [follow, openFollow] = useState(false);
  const fetch_user = () => {
    setUser(null);
    axios.get("/api/user/" + props.match.params.username).then((response) => {
      if (response.data.status) {
        setUser(response.data.user);
        document.title = `${response.data.user.name} (@${response.data.user.username}) • Troth`;
        setFollow(response.data.following);
      } else setUser(false);
    });
  };
  useEffect(() => {
    fetch_user();
  }, [props.match.params.username]);
  useEffect(() => {
    const element = document.querySelectorAll(".Calendar__weekRow");
    element.forEach((el) => {
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].classList.contains("-today")) {
          el.classList.add("row-mobile");
          break;
        }
      }
    });
  }, [loading]);
  const { user: current } = useContext(User);
  return (
    <>
      {user === null && <Loader />}
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
                  <div
                    style={{
                      backgroundImage: `url(${"/uploads/" + user.avatar})`,
                    }}
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
                      <i className="material-icons badge">verified_user</i>
                    </Tooltip>
                  )}
                  {current !== null ? (
                    current._id === user.id ? (
                      <Link
                        to="/settings/info"
                        className="mdc-button mdc-button--outlined"
                      >
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">Edit</span>
                      </Link>
                    ) : (
                      <button
                        className="mdc-button mdc-button--outlined"
                        onClick={() => {
                          setLoading(true);
                          axios
                            .get(
                              `/api/user/${
                                following ? "unfollow" : "follow"
                              }/` + user.id
                            )
                            .then((response) => {
                              if (response.data.status) {
                                fetch_user();
                                setLoading(false);
                              }
                            });
                        }}
                        disabled={loading}
                      >
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">
                          {following ? "Unfollow" : "Follow"}
                        </span>
                      </button>
                    )
                  ) : (
                    ""
                  )}
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
                            openFollow({ id: user.id, type: "followers" });
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
                            openFollow({ id: user.id, type: "following" });
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
      )}
      {user === false && (
        <div className="notfound">
          <i className="material-icons">error</i>Error 404 page not found
        </div>
      )}
      <FollowDialog data={follow} />
    </>
  );
};
export default Find;
