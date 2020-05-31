import React, { useEffect, useState, useContext } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { Row, Col, Spinner } from "reactstrap";
import { ProjectItem } from "components";
import { User } from "context/user";
import axios from "axios";
import "./style.scss";
const Find = (props) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const [user, setUser] = useState(null);
  const { user: you } = useContext(User);
  const [follow, setFollow] = useState(false);
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    const get = () => {
      setUser(null);
      axios
        .get("/api/user/" + props.match.params.username, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (response.data.status) {
            setUser(response.data.user);
            axios
              .get("/api/project/get/" + response.data.user._id)
              .then((res) => setProjects(res.data.result));
            setFollow(Boolean(response.data.following));
            document.title = response.data.user.username;
          } else setUser(false);
        });
    };
    get();
    return () => {
      setUser(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      document.title = "TROTH";
    };
  }, [user]);
  return (
    <div>
      {user ? (
        <>
          {you ? you._id === user._id && <Redirect to="/profile" /> : null}
          <div className="profile">
            <div className="d-flex container p-0 position-relative">
              <div className="profile-avatar">
                {user.avatar ? (
                  <div
                    className="avatar-container"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  />
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
            <hr className="container p-0" />
            {user.about ? (
              <div className="container p-0">
                <div className="profile-bio">{user.about}</div>
                {user.website ? (
                  <a
                    href={user.website}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="profile-website"
                  >
                    {user.website.substring(0, 50)}
                  </a>
                ) : null}
                <hr />
              </div>
            ) : null}
            {you ? (
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
            ) : null}
          </div>
          <div className="p-3">
            <div className="home-nav container p-0">
              <Row className="m-0">
                <Col>
                  <NavLink
                    to={`/project/funded/${user._id}`}
                    className="home-link"
                  >
                    Funded
                  </NavLink>
                </Col>
                <Col className="divider-nav">
                  <NavLink to={`/${user.username}`} exact className="home-link">
                    Projects
                  </NavLink>
                </Col>
                <Col className="divider-nav">
                  <NavLink to="/profile/saved" className="home-link">
                    Link
                  </NavLink>
                </Col>
              </Row>
            </div>
            {/* add react router switch here */}
            <div className="profile-project container p-0">
              {projects
                ? projects.map((project, index) => (
                    <ProjectItem key={index} {...project} />
                  ))
                : null}
            </div>
          </div>
        </>
      ) : user === false ? (
        <h6 className="text-center pt-4">404 Not Found</h6>
      ) : (
        <div className="text-center w-100 pt-5">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default Find;
