import React, { useState, useContext, useRef } from "react";
import { User } from "context/user";
import axios from "axios";
// import moment from "moment";
const Verify = () => {
  const front_input = useRef(null);
  const back_input = useRef(null);
  const { user } = useContext(User);
  const [state, setstate] = useState({ front: null, back: null });
  const [error, setError] = useState({
    front: null,
    back: null,
  });
  const [disabled, setDisabled] = useState(true);
  const update = (e) => {
    let type = e.target.name;
    setError({ front: null, back: null });
    let file = e.target.files[0];
    if (back_input.current.files[0] && front_input.current.files[0]) {
      setDisabled(false);
    }
    if (file && file.size < 5242880) {
      if (
        ["jpg", "png", "jpeg"].includes(
          /[^.]+$/.exec(file.name.toLowerCase())[0]
        )
      ) {
        var reader = new FileReader();
        reader.onload = (e) => {
          setstate({ ...state, [type]: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setstate({ ...state, [type]: null });
      setError({ ...error, [type]: "invalid image" });
    }
  };
  return user !== null ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (back_input.current.files[0] && front_input.current.files[0]) {
          const upload = new FormData();
          upload.append("front", front_input.current.files[0]);
          upload.append("back", back_input.current.files[0]);
          setDisabled(true);
          axios({
            method: "post",
            url: "/api/update/verify",
            data: upload,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((response) => {
            if (response.data.status) window.location.reload();
            else {
              let errors = response.data.errors;
              errors.map((error) => setError({ [error.param]: error.msg }));
              setDisabled(false);
            }
          });
        }
      }}
      className="verify-form"
    >
      <h5 className="notice center font-reset">Identity Verification</h5>
      <span className="notice center">
        Identity verification helps to ensure that there is a real person behind
        every project on Troth.
        <br />
        Your documents will not be shared with other members, Please upload
        (png, jpg) files,max allowed size 5mb per document.
        <br />
        The name on the ID should match the name that you provide on Troth
        account
      </span>
      <div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 text-center">
            {state.front ? (
              <button
                type="button"
                className="mdc-icon-button material-icons clear-input"
                onClick={() => {
                  front_input.current.value = "";
                  setstate({ ...state, front: null });
                  if (
                    !back_input.current.files[0] ||
                    !front_input.current.files[0]
                  )
                    setDisabled(true);
                }}
              >
                close
              </button>
            ) : null}
            <label
              className="id-verify flex center"
              htmlFor="front"
              style={{
                backgroundImage: state.front ? `url(${state.front})` : null,
              }}
            >
              {!state.front ? "ID Frontside" : null}
            </label>
            <input
              type="file"
              className="hidden"
              name="front"
              id="front"
              accept="image/png, image/jpeg"
              onChange={update}
              ref={front_input}
            />
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
              {error.front}
            </p>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 text-center">
            {state.back ? (
              <button
                type="button"
                className="mdc-icon-button material-icons clear-input"
                onClick={() => {
                  back_input.current.value = "";
                  setstate({ ...state, back: null });
                  if (
                    !back_input.current.files[0] ||
                    !front_input.current.files[0]
                  )
                    setDisabled(true);
                }}
              >
                close
              </button>
            ) : null}
            <label
              className="id-verify flex center"
              htmlFor="back"
              style={{
                backgroundImage: state.back ? `url(${state.back})` : null,
              }}
            >
              {!state.back ? "ID Backside" : null}
            </label>
            <input
              type="file"
              className="hidden"
              name="back"
              id="back"
              accept="image/png, image/jpeg"
              onChange={update}
              ref={back_input}
            />
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
              {error.back}
            </p>
          </div>
        </div>
      </div>
      <div className="action">
        <div>
          <button className="mdc-button mdc-button--raised" disabled={disabled}>
            <span className="mdc-button__ripple"></span>Save
          </button>
        </div>
      </div>
    </form>
  ) : (
    <div className="placeholder settings-container">
      <div className="line"></div>
    </div>
  );
};
export default Verify;
