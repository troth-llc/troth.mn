import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import "./style.scss";
const Search = (props) => {
  const [search, setSearch] = useState(null);
  const searchValue = props.match.params.search;
  useEffect(() => {
    setSearch(null);
    document.getElementById("searchInput").value = decodeURIComponent(
      searchValue
    );
    axios
      .get("/api/search?q=" + decodeURIComponent(searchValue))
      .then((response) => {
        if (response.data.user.length > 0) {
          setSearch(response.data.user);
        } else {
          setSearch(false);
        }
      });
  }, [searchValue]);
  return (
    <div className="search">
      <p className="text-center">
        Found <b> {search !== null && search.length}</b> results for:{" "}
        {decodeURIComponent(searchValue)}
      </p>
      {search &&
        search.map((user, index) => {
          return (
            <div className="search-content flex" key={index}>
              <div className="search-avatar">
                {user.avatar !== null ? (
                  <div
                    className="search-avatar-img"
                    style={{
                      backgroundImage: `url(${"/uploads/" + user.avatar})`,
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder-search">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex">
                <Link className="search-name" to={`/${user.username}`}>
                  {`${user.name}`}
                  {user.verified ? (
                    <Tooltip title="Verified" placement="bottom">
                      <span className="material-icons verified">
                        verified_user
                      </span>
                    </Tooltip>
                  ) : null}
                </Link>
              </div>
            </div>
          );
        })}
      {search === null && (
        <>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
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
              </div>
            </div>
          </div>
          <div className="search-placeholder">
            <div className="search-content">
              <div className="placeholder">
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
      {search === false && <h4 className="text-center">Result not found</h4>}
    </div>
  );
};
export default Search;
