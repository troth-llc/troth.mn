import React, { useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Row, Col, Spinner } from "reactstrap";
import { ProjectItem } from "components";
import { User } from "context/user";
import "./style.scss";
const Profile = () => {
  const { user } = useContext(User);
  const projects = [
    {
      title: "Hello world",
      src: require("assets/image/project/landscape.jpg"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/landscape.jpg"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/landscape.jpg"),
      progress: 67,
      funded: 977,
    },
    {
      title: "Hello world",
      src: require("assets/image/project/landscape.jpg"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/landscape.jpg"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/landscape.jpg"),
      progress: 67,
      funded: 977,
    },
  ];
  useEffect(() => {
    var app = document.getElementsByClassName("app")[0];
    app.classList.add("p-0");
    return () => {
      app.classList.remove("p-0");
    };
  }, [user]);
  return (
    <div>
      {user ? (
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
            <div className="profile-action d-flex">
              <Link to="/settings/info">Edit profile</Link>
            </div>
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
        <div className="text-center w-100 pt-5">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default Profile;
