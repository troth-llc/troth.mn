import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
const Search = props => {
  const [search, setSearch] = useState(null);
  const searchValue = props.match.params.search;
  useEffect(() => {
    document.getElementById("searchInput").value = decodeURIComponent(
      searchValue
    );
    axios
      .get("/api/search?q=" + decodeURIComponent(searchValue))
      .then(response => {
        if (response.data.user.length > 0) {
          setSearch(response.data.user);
        }
      });
  }, []);
  return (
    <div className="search">
      <p className="text-center">
        Search result for {decodeURIComponent(searchValue)}
        <b> {search !== null && search.length}</b>
      </p>
      {search ? (
        "11"
      ) : (
        <>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Search;
