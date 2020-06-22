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
  const json_to_html = (json) => {
    let articleHTML = "";
    json.blocks.map((obj) => {
      switch (obj.type) {
        case "paragraph":
          articleHTML += `<div class="campaing-block"><p>${obj.data.text}</p></div>\n`;
          break;
        case "image":
          articleHTML += `<div class="campaing-block">
                        <div class="d-flex text-center flex-column">
                                    <img src="${obj.data.file.url}" alt="${obj.data.caption}"/>
                                    <figcaption class="caption-img">
                                        ${obj.data.caption}
                                    </figcaption>
                          </div>
                        </div>\n`;
          break;
        case "header":
          articleHTML += `<div class="campaing-block"><h${obj.data.level}>${obj.data.text}</h${obj.data.level}></div>\n`;
          break;
        case "code":
          articleHTML += `<div class="campaing-block"><pre class="code-container"><span class="code">${obj.data.code}</span></pre></div>\n`;
          break;
        case "list":
          if (obj.data.style === "unordered") {
            const list = obj.data.items.map((item) => {
              return `<li>${item}</li>`;
            });
            articleHTML += `
            <div class="campaing-block">
               <ul>${list.join("")}</ul>
               </div>\n`;
          } else {
            const list = obj.data.items.map((item) => {
              return `<li>${item}</li>`;
            });
            articleHTML += `
            <div class="campaing-block">
             <ol>${list.join("")}</ol>
            </div>\n`;
          }
          break;
        case "delimeter":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <div class="ce-delimiter cdx-block"></div>
                            </div>
                        </div>\n`;
          break;
        case "attaches":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <a href="${obj.data.file.url}">${obj.data.file.name}</a>
                            </div>
                        </div>\n`;
          break;
        case "embed":
          articleHTML += `<div class="ce-block">
                                <div class="ce-block__content">
                                    <iframe width="${obj.data.width}" 
                                            height="${obj.data.height}" 
                                            src="${obj.data.source}" 
                                            frameborder="0" 
                                            allow="accelerometer; 
                                            autoplay; 
                                            encrypted-media; 
                                            gyroscope; 
                                            picture-in-picture" 
                                            allowfullscreen>
                                            </iframe>
                                    <strong>${obj.data.caption}</strong>
                                </div>
                            </div>\n`;
          break;
        default:
          return "";
      }
    });
    return articleHTML;
  };
  return (
    <div className="d-flex flex-center">
      <div className="project-offset">
        {state ? (
          state.length !== 0 ? (
            <>
              <div className="project-view">
                <div>
                  <h1 className="campaign-title">{state.title}</h1>
                </div>
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
                  <div className="d-flex flex-row pt-2 pb-2">
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
                      <div className="project-category">
                        {moment(state.created).fromNow()} ·{" "}
                        <Link to={"/project/category/" + state.category._id}>
                          <span className="material-icons material-icons-outlined">
                            local_offer
                          </span>{" "}
                          {state.category.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* campaign cover */}
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
                {/* campaign detail */}
                <div
                  className="campaign-content mt-3"
                  dangerouslySetInnerHTML={{
                    __html: json_to_html(JSON.parse(state.content)),
                  }}
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
    </div>
  );
};
export default ProjectView;
