import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, Switch, Route, Redirect } from "react-router-dom";
import Project from "./project";
import User from "./user";
import "./style.scss";
import { Spinner } from "reactstrap";
import axios from "axios";
const Search = (props) => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    axios
      .get("/api/project/category")
      .then((res) => setCategories(res.data.result));
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("scroll-lock");
    return () => {
      body.classList.remove("scroll-lock");
    };
  }, [props]);
  // useEffect(() => {}, [categories]);
  var location = new URL(window.location);
  var value = location.pathname.split("/")[3]
    ? location.pathname.split("/")[3]
    : "";
  return (
    <div id="search">
      <div className="search-container">
        <Link to="/">
          <img src={require("assets/image/left-arrow.svg")} alt="back-arrow" />
        </Link>
        <form
          onSubmit={(e) => {
            if (search.trim()) {
              history.push(
                `/search/${
                  location.pathname.split("/")[2]
                    ? location.pathname.split("/")[2]
                    : "project"
                }/${encodeURIComponent(search.trim())}`
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
            defaultValue={decodeURIComponent(value)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="category-container">
        <Switch>
          <Route exact path="/search">
            {categories ? (
              categories.map((category) => (
                <div key={category._id} className="search-category">
                  <Link to={"/project/category/" + category._id}>
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
                      <div className="category-count">0 Projects</div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center">
                <Spinner size="sm" color="secondary" />
              </div>
            )}
          </Route>
          <Route path="/search/project/:search" component={Project} />
          <Route path="/search/user/:search" component={User} />
          <Redirect from="/search" to="/search" />
        </Switch>
      </div>
    </div>
  );
};
export default Search;
