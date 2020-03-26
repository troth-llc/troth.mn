import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.scss";
const FollowDialog = props => {
  const { id, type } = props.data;
  const [follow, setFollow] = useState({ start: 0, end: 20 });
  useEffect(() => {
    console.log(id, type);
    if (id) {
      axios
        .get(`/api/user/${type}/${id}?start=${follow.start}&end=${follow.end}`)
        .then(res => console.log(res));
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
          <div className="mdc-dialog__content">
            <ul className="follow-container">
              <li className="people">
                <div className="people-container">
                  <div className="people-info flex">
                    <div className="follow-avatar">
                      <span className="avatar-picture"></span>
                    </div>
                    <div className="text">
                      <div className="text-username flex">
                        <Link title="ochrooo" to="/ochrooo">
                          ochrooo
                        </Link>
                      </div>
                      <div className="text-name flex">BMO</div>
                    </div>
                    <div className="follow-action">
                      <button className="mdc-button mdc-button--outlined">
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">Follow</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="placeholder">
              <div className="line"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>
  );
};
export default FollowDialog;
