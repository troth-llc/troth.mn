import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
const Search = (props) => {
  useEffect(() => {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("scroll-lock");
    return () => {
      body.classList.remove("scroll-lock");
    };
  }, [props]);
  const categories = [{ name: "Test", count: "3,423" }];
  return (
    <div id="search">
      <Link to="/">
        <img src={require("assets/image/left-arrow.svg")} alt="back-arrow" />
      </Link>
      <div className="mt-3">
        <input
          className="search-input"
          placeholder="Search"
          alt="back"
          autoFocus={true}
        />
      </div>
      <hr style={{ marginTop: "10px" }} />
      <div className="category-container">
        {categories.map((category, index) => (
          <div key={index} className="search-category">
            <Link to={"/project/category/" + category.name.toLowerCase()}>
              <div>{category.name}</div>
              <div>{category.count}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Search;
