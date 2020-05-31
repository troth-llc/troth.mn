import React, { useState, useEffect, useContext } from "react";
import dompurify from "dompurify";
import axios from "axios";
import { Spinner, Progress } from "reactstrap";
import { Link } from "react-router-dom";
import "./view.scss";
import moment from "moment";
import { User } from "context/user";
const ProjectView = (props) => {
  const [state, setState] = useState(null);
  const { user } = useContext(User);
  const sanitizer = dompurify.sanitize;
  useEffect(() => {
    axios.get("/api/project/view/" + props.match.params.id).then((res) => {
      if (res.data.result) {
        document.title = res.data.result.title
          ? res.data.result.title
          : "Not Found";
        setState(res.data.result);
      }
    });
    return () => {
      document.title = "TROTH";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container">
      {state ? (
        state.length !== 0 ? (
          <>
            <div className="project-view">
              <div className="project-view-header">
                <div className="view-background">
                  {state.video ? (
                    <iframe
                      src={state.video}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="youtube player"
                      className="yt-iframe"
                    />
                  ) : (
                    <div
                      className="image"
                      style={{ backgroundImage: `url(${state.cover})` }}
                    />
                  )}
                </div>
              </div>
              <header className="campaign-header">
                <h1 className="campaign-title">{state.title}</h1>
              </header>
              {/* funded details */}
              <div>
                <Progress
                  value={Math.round((state.amount / state.funded) * 100)}
                  className="campaign-progress-bar"
                />
                <h2 className="progress-meter-heading">
                  ₮{Number(state.funded.toFixed(1)).toLocaleString()}
                  <span className="text-stat text-stat-title">
                    raised of ₮
                    {Number(state.amount.toFixed(1)).toLocaleString()} goal
                  </span>
                </h2>
              </div>
              {/* owner information */}

              <div>
                <div className="d-flex flex-row pt-2">
                  <div className="owner-avatar-container">
                    {state.owner.avatar ? (
                      <div
                        className="owner-avatar"
                        style={{
                          backgroundImage: `url(${state.owner.avatar})`,
                        }}
                      />
                    ) : (
                      <div className="owner-avatar-preview"></div>
                    )}
                  </div>

                  <div className="owner-info">
                    <Link to={"/" + state.owner.username}>
                      {state.owner.name}
                    </Link>{" "}
                    Is organizing this fundraiser.
                  </div>
                </div>
              </div>
              <ul className="project-category">
                <li>Created {moment(state.created).fromNow()}</li>
                <li>
                  <Link to={"/project/category/" + state.category._id}>
                    <span className="material-icons material-icons-outlined">
                      local_offer
                    </span>{" "}
                    {state.category.name}
                  </Link>
                </li>
              </ul>
              {/* campaign detail */}
              <div
                className="campaign-content mt-3"
                dangerouslySetInnerHTML={{ __html: sanitizer(state.content) }}
              />
            </div>
            {user ? (
              user._id === state.owner._id ? (
                <Link
                  className="default-button mt-3 pb-3 edit-button"
                  to={"/project/edit/" + state._id}
                >
                  Edit Project
                </Link>
              ) : null
            ) : null}
          </>
        ) : (
          <p className="text-center w-100 pt-2">No project found</p>
        )
      ) : (
        <div className="text-center w-100 pt-5">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default ProjectView;
