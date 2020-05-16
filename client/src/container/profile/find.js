import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { Row, Col, Spinner } from "reactstrap";
import { ProjectItem } from "components";
import { User } from "context/user";
import axios from "axios";
import "./style.scss";
const Find = (props) => {
  const projects = [];
  const [user, setUser] = useState(null);
  const { user: you } = useContext(User);
  const [follow, setFollow] = useState(false);
  const get = () => {
    setUser(null);
    axios.get("/api/user/" + props.match.params.username).then((response) => {
      if (response.data.status) {
        setUser(response.data.user);
        setFollow(Boolean(response.data.following));
        document.title = response.data.user.username;
      } else setUser(false);
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => get(), []);
  useEffect(() => {
    var app = document.getElementsByClassName("app")[0];
    app.classList.add("p-0");
    return () => {
      document.title = "TROTH";
      app.classList.remove("p-0");
    };
  }, [user]);
  return (
    <div>
      {user && you ? (
        <>
          <div className="profile">
            <div className="d-flex">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="user profile" />
                ) : (
                  <div className="avatar-preview">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-detail">
                <div className="profile-name">{user.name}</div>
                <span className="profile-type">{user.type}</span>
              </div>
              <div className="profile-follow">
                <div className="follow">
                  <div className="count">{user.followers}</div>
                  <div className="text">followers</div>
                </div>
                <div className="follow">
                  <div className="count">{user.following}</div>
                  <div className="text">following</div>
                </div>
              </div>
            </div>
            <hr />
            {user.about ? (
              <>
                <div className="profile-bio">{user.about}</div>
                <hr />
              </>
            ) : null}
            {you._id === user._id ? (
              <div className="profile-action d-flex">
                <Link to="/settings/info">Edit profile</Link>
              </div>
            ) : (
              <div
                className="profile-action d-flex"
                onClick={() => {
                  setFollow(!follow);
                  axios
                    .get(
                      `/api/user/${follow ? "unfollow" : "follow"}/` + user._id
                    )
                    .then(() =>
                      setUser({
                        ...user,
                        followers: follow
                          ? Number(user.followers) - 1
                          : Number(user.followers) + 1,
                      })
                    );
                }}
              >
                <span className={follow ? "unfollow" : null}>
                  {follow ? "Unfollow" : "Follow"}
                </span>
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="home-nav">
              <Row className="m-0">
                <Col>
                  <NavLink to="/calendar" className="home-link">
                    Calendar
                  </NavLink>
                </Col>
                <Col className="divider-nav">
                  <NavLink to="/profile" exact className="home-link">
                    Projects
                  </NavLink>
                </Col>
                <Col className="divider-nav">
                  <NavLink to="/profile/saved" className="home-link">
                    Saved
                  </NavLink>
                </Col>
              </Row>
            </div>
            {/* add react router switch here */}
            <div className="profile-project">
              {projects.map((project, index) => (
                <ProjectItem key={index} {...project} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-100 mt-5">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default Find;
