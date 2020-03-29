import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.scss";
const FollowDialog = props => {
  const { id, type } = props.data;
  const [sliced, setFollow] = useState({ start: 0, end: 1 });
  const [data, setData] = useState([]);
  const [last, setLast] = useState(false);
  const follow = (start, end, scroll) => {
    scroll === false && setData([]);
    if (last === false) {
      axios
        .get(`/api/user/${type}/${id}?start=${start}&end=${end}`)
        .then(res => {
          if (res.data.status) {
            setLast(res.data.last);
            console.log(res.data.last);
            scroll
              ? setData([...data, ...res.data.follow])
              : setData(res.data.follow);
            setFollow({
              start: parseInt(res.data.end),
              end: parseInt(res.data.end) + 20
            });
          } else console.log("failed to fetch data");
        });
    }
  };
  useEffect(() => {
    if (id) {
      setLast(false);
      follow(0, 20, false);
    }
  }, [props]);
  return (
    <div className="mdc-dialog" id="follow">
      <div className="mdc-dialog__container">
        <div className="mdc-dialog__surface">
          <div className="follow-header" tabIndex={0}>
            <span>{type}</span>
            <button
              className="mdc-icon-button material-icons"
              data-mdc-dialog-action="no"
            >
              close
            </button>
          </div>
          <div
            className="mdc-dialog__content"
            onScroll={e => {
              if (
                e.currentTarget.scrollHeight -
                  e.currentTarget.scrollTop -
                  e.currentTarget.clientHeight <=
                0
              ) {
                follow(sliced.start, sliced.end, true);
              }
            }}
          >
            <ul className="follow-container" id="follow-scroll">
              {data.length > 0 ? (
                data.map((data, index) => {
                  return (
                    <li className="people" key={index}>
                      <div className="people-container">
                        <div className="people-info flex">
                          <div className="follow-avatar">
                            {data.avatar !== null ? (
                              <span className="avatar-picture"></span>
                            ) : (
                              <span className="avatar-picture null-avatar">
                                {data.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="text">
                            <div className="text-username flex">
                              <a title="ochrooo" href={`/${data.username}`}>
                                {data.username}
                              </a>
                            </div>
                            <div className="text-name flex">{data.name}</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <div className="placeholder">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>
  );
};
export default FollowDialog;
