import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Spinner,
  Modal,
  ModalBody,
  FormGroup,
  Label,
  Button,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { ProjectItem } from "components";
import { User } from "context/user";
import "./style.scss";
const Profile = () => {
  const { user } = useContext(User);
  const profileFile = useRef(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const toggle = () => setModal(!modal);
  const [projects, setProjects] = useState(null);
  useEffect(() => {}, [user]);
  useEffect(() => {
    axios
      .get("/api/project/get")
      .then((result) => setProjects(result.data.result));
  }, []);
  return (
    <div>
      {user ? (
        <>
          <div className="profile">
            <div className="d-flex container p-0 position-relative">
              <div className="profile-avatar" onClick={toggle}>
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
            <div className="profile-action d-flex">
              <Link to="/settings/info">Edit profile</Link>
            </div>
          </div>
          <div className="p-3">
            <div className="home-nav container p-0">
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
                  <NavLink to="/profile/funded" className="home-link">
                    Funded
                  </NavLink>
                </Col>
              </Row>
            </div>
            {/* add react router switch here */}
            <div className="profile-project container p-0">
              {projects ? (
                projects.map((project) => {
                  return <ProjectItem {...project} key={project._id} />;
                })
              ) : (
                <div className="text-center w-100 pt-5">
                  <Spinner size="sm" color="secondary" />
                </div>
              )}
            </div>
          </div>
          <Modal isOpen={modal} centered>
            <button
              className="material-icons btn-link modal-close-btn"
              disabled={disabled}
              onClick={toggle}
            >
              close
            </button>
            <ModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const { current } = profileFile;
                  var FileSize = current.files[0].size / 1024 / 1024;
                  if (FileSize > 5) {
                    setError({ file: "file must be under 5mb" });
                  } else {
                    disable(true);
                    const upload = new FormData();
                    upload.append("file", current.files[0]);
                    axios({
                      method: "post",
                      url: "/api/update/avatar",
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                      data: upload,
                    }).then((response) => {
                      if (response.data.status) window.location.reload();
                      else {
                        let errors = response.data.errors;
                        errors.map((error) =>
                          setError({ [error.param]: error.msg })
                        );
                        disable(false);
                      }
                      disable(false);
                    });
                  }
                }}
              >
                <FormGroup>
                  <Label>New Profile Picture</Label>
                  <input
                    type="file"
                    name="file"
                    ref={profileFile}
                    required={true}
                    disabled={disabled}
                    className={`form-control-file ${
                      error.file ? "is-invalid" : ""
                    }`}
                    accept="image/png, image/jpeg"
                  />
                  <FormFeedback>{error.file}</FormFeedback>
                </FormGroup>
                <div className="auth-action">
                  <Button color="primary" block disabled={disabled}>
                    Save
                  </Button>
                </div>
              </form>
            </ModalBody>
          </Modal>
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
