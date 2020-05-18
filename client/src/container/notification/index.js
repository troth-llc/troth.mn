import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "reactstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import "./style.scss";
const Notification = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    const load = () => {
      axios
        .get("/api/notification")
        .then((result) => setState(result.data.result));
    };
    load();
    return () => {
      setState(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state ? (
    <div className="notification">
      {state.map((notification) => {
        return (
          <Link
            to={"/" + notification.user.username}
            key={notification._id}
            onClick={() => {
              !notification.read
                ? axios.get("/api/notification/read_follow/" + notification._id)
                : console.log("nice bro!");
            }}
          >
            <div
              className={`follow-notification${
                !notification.read ? " new" : ""
              }`}
            >
              <div className="user-follow-avatar"></div>
              <div>
                <div className="user-follow-name">
                  <span>{notification.user.name}</span> followed you
                </div>
                <div className="user-follow-date">
                  {moment(notification.created).fromNow()}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  ) : (
    <div className="text-center w-100 pt-5">
      <Spinner size="sm" color="secondary" />
    </div>
  );
};
export default Notification;
