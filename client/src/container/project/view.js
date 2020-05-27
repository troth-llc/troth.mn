import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Spinner, Progress } from "reactstrap";
import { Link } from "react-router-dom";
import "./view.scss";
import moment from "moment";
import { User } from "context/user";
const ProjectView = (props) => {
  const [state, setState] = useState(null);
  const { user } = useContext(User);
  useEffect(() => {
    axios.get("/api/project/view/" + props.match.params.id).then((res) => {
      if (res.data.result) {
        document.title = res.data.result.title;
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
        <>
          <div className="project-view">
            <div className="project-view-header">
              <div className="view-background">
                <div
                  className="image"
                  style={{ backgroundImage: `url(${state.cover})` }}
                />
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
                  raised of ₮{Number(state.amount.toFixed(1)).toLocaleString()}{" "}
                  goal
                </span>
              </h2>
            </div>
            {/* owner information */}
            <hr />
            <div>
              <div className="row">
                <div className="col-2">
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
                </div>
                <div className="col owner-info">
                  <Link to={"/" + state.owner.username}>
                    {state.owner.name}
                  </Link>
                  <br />
                  Created this project • {moment(state.created).fromNow()}
                </div>
              </div>
            </div>
            <hr />
            {/* campaign detail */}
            <div
              className="campaign-content mt-3"
              dangerouslySetInnerHTML={{ __html: state.content }}
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
        <div className="text-center w-100 pt-5">
          <Spinner size="sm" color="secondary" />
        </div>
      )}
    </div>
  );
};
export default ProjectView;
