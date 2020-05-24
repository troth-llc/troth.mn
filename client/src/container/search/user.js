import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Row, Col, Spinner } from "reactstrap";
import axios from "axios";
const User = (props) => {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    setUsers(null);
    axios
      .post("/api/search/users", { search: props.match.params.search.trim() })
      .then((response) => setUsers(response.data.user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.search]);
  return (
    <>
      <div className="search-nav">
        <div className="home-nav">
          <Row className="m-0">
            <Col>
              <NavLink
                to={"/search/project/" + props.match.params.search}
                className="home-link"
              >
                Projects
              </NavLink>
            </Col>
            <Col className="divider-nav">
              <NavLink
                to={"/search/user/" + props.match.params.search}
                className="home-link"
              >
                Users
              </NavLink>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        {users ? (
          users.length !== 0 ? (
            users.map((user, index) => (
              <div className="search-user" key={index}>
                <Link to={"/" + user.username}>
                  <div className="user-avatar">
                    {user.avatar ? (
                      <div
                        className="avatar-container"
                        style={{ backgroundImage: `url(${user.avatar})` }}
                      />
                    ) : (
                      <div className="search-avatar-preview">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-container">
                    <div className="user-details">
                      <span className="user-name">{user.name}</span>
                      <span className="user-type">{user.type}</span>
                    </div>
                    <div className="user-arrow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="15.001"
                        viewBox="0 0 20 15.001"
                      >
                        <path
                          d="M12.75 15.5a1.972 1.972 0 0 1-1.968-1.977v-1.7a.781.781 0 1 1 1.563 0v1.7a.4.4 0 0 0 .683.281L18.21 8.56a.8.8 0 0 0 0-1.12L13.027 2.2a.4.4 0 0 0-.683.281v4.768a1.573 1.573 0 0 1-1.563 1.579h-10a.79.79 0 0 1 0-1.579h10V2.476A1.971 1.971 0 0 1 11.993.652a1.942 1.942 0 0 1 2.14.427l5.182 5.244a2.394 2.394 0 0 1 0 3.353l-5.182 5.244a1.942 1.942 0 0 1-1.383.58zm0 0"
                          transform="translate(0 -.499)"
                          style={{ fill: "#c7cdd4" }}
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-muted mt-3">No users found</p>
          )
        ) : (
          <div className="text-center w-100 pt-3">
            <Spinner color="secondary" size="sm" />
          </div>
        )}
      </div>
    </>
  );
};
export default User;
