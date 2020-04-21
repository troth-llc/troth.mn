import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { ProjectItem } from "components";
import "./style.scss";
const Profile = () => {
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
  }, []);
  return (
    <div>
      <div className="profile">
        <div className="d-flex">
          <div className="profile-avatar">
            <img
              src={require("assets/image/user/avatar-profile.png")}
              alt="user profile"
            ></img>
          </div>
          <div className="profile-detail">
            <div className="profile-name">Uyanga</div>
            <span className="profile-type">Partner User</span>
          </div>
          <div className="profile-follow">
            <div className="follow">
              <div className="count">360</div>
              <div className="text">followers</div>
            </div>
            <div className="follow">
              <div className="count">340</div>
              <div className="text">following</div>
            </div>
          </div>
        </div>
        <hr />
        <div className="profile-bio">
          QUBS AG is a Swiss company based in Küsnacht near Zurich and founded
          by Hayri Bulman, a father of 2 children and with a passion for wooden
          toys and new technologies.
        </div>
        <hr />
        <div className="profile-action d-flex">
          <Link to="/settings/info">Edit profile</Link>
        </div>
      </div>
      <div className="home-nav m-3" style={{ width: "auto" }}>
        <Row>
          <Col>
            <NavLink to="/profile/calendar" className="home-link">
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
      <div className="profile-project">
        {projects.map((project, index) => (
          <ProjectItem key={index} {...project} />
        ))}
      </div>
    </div>
  );
};
export default Profile;
