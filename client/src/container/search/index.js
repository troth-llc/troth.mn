import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, Switch, Route, Redirect } from "react-router-dom";
import Project from "./project";
import User from "./user";
import "./style.scss";
const Search = (props) => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  useEffect(() => {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("scroll-lock");
    return () => {
      body.classList.remove("scroll-lock");
    };
  }, [props]);
  const categories = [
    { name: "Medical", count: "3'423" },
    { name: "Memorial", count: "3'423" },
    { name: "Emergency", count: "3'423" },
    { name: "Nonprofit", count: "3'423" },
    { name: "Education", count: "3'423" },
    { name: "Animals", count: "3'423" },
  ];
  return (
    <div id="search">
      <Link to="/">
        <img src={require("assets/image/left-arrow.svg")} alt="back-arrow" />
      </Link>
      <div className="mt-3">
        <form
          onSubmit={(e) => {
            if (search.trim()) {
              history.push(
                "/search/project/" + encodeURIComponent(search.trim())
              );
            }
            e.preventDefault();
          }}
        >
          <input
            className="search-input"
            placeholder="Search"
            alt="back"
            autoFocus={true}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <hr style={{ marginTop: "10px" }} />
      <div className="category-container">
        <Switch>
          <Route exact path="/search">
            {categories.map((category, index) => (
              <div key={index} className="search-category">
                <Link to={"/project/category/" + category.name.toLowerCase()}>
                  <div className="search-arrows">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="10"
                      viewBox="0 0 7 10"
                      className="mini-arrow"
                    >
                      <path
                        d="M4.186 1.139a1 1 0 0 1 1.627 0l3.057 4.28A1 1 0 0 1 8.057 7H1.943a1 1 0 0 1-.814-1.581z"
                        data-name="Polygon 2"
                        transform="rotate(90 3.5 3.5)"
                        style={{ fill: "#fa6c51" }}
                      />
                    </svg>

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
                  <div className="category-detail">
                    <div className="category-name">{category.name}</div>
                    <div className="category-count">
                      {category.count} Projects
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Route>
          <Route path="/search/project" component={Project} />
          <Route path="/search/user" component={User} />
          <Redirect from="/search" to="/search" />
        </Switch>
      </div>
    </div>
  );
};
export default Search;
