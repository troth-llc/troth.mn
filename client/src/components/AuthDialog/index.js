import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MDCSelect } from "@material/select";
import { MDCDialog } from "@material/dialog";
import axios from "axios";
import { Snackbar } from "context/notification-toast";

import "./style.scss";
const AuthDialog = (props) => {
  const { setToast } = useContext(Snackbar);

  const [login, setLogin] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [reset, setReset] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setLoginError({
      username: "",
      password: "",
    });
    const { username, password } = login;
    axios
      .post("/api/auth", {
        username,
        password,
      })
      .then((response) => {
        let errors = response.data.errors;
        let { status, token } = response.data;
        if (status) {
          localStorage.setItem("token", token);
          window.location.reload();
        } else {
          errors.map((error) => setLoginError({ [error.param]: error.msg }));
        }
      });
  };
  // register
  const [load, setLoad] = useState(false);
  const [data_register, setData_register] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [register_error, seterror] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const [login_error, setLoginError] = useState({
    username: "",
    password: "",
  });
  const [gender, setGender] = useState("");
  const update_gender = (data) => {
    setGender(data);
  };
  useEffect(() => {
    if (props.open === true) {
      const dialog = new MDCDialog(document.querySelector("#auth"));
      dialog.open();
      dialog.escapeKeyAction = "";
      dialog.scrimClickAction = "";
    }
    const select = new MDCSelect(document.querySelector("#gender-select"));
    select.listen("MDCSelect:change", () => {
      update_gender(select.value);
    });
  }, [props.open]);
  const submit_register = (e) => {
    e.preventDefault();
    if (gender === "") {
      seterror({ ...register_error, gender: "Select valid gender" });
    } else {
      setLoad(true);
      const { name, username, email, password, id } = data_register;
      axios
        .post("/api/auth/register", {
          name,
          username,
          email,
          password,
          id,
          gender,
        })
        .then((response) => {
          var status = response.data.status;
          const labels = document.querySelectorAll(".mdc-floating-label");
          if (status) {
            setLoad(false);
            setData_register({
              name: "",
              username: "",
              email: "",
              password: "",
              id: "",
            });
            setShow(false);
            labels.forEach(
              (label) =>
                label.classList.contains("mdc-floating-label--float-above") &&
                label.classList.remove("mdc-floating-label--float-above")
            );
            document.getElementById("login-container").style.display = "block";
            document.getElementById("register-container").style.display =
              "none";
          } else {
            let errors = response.data.errors;
            errors.map((error) => seterror({ [error.param]: error.msg }));
            setLoad(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoad(false);
        });
    }
  };
  return (
    <div className="mdc-dialog" id="auth">
      <div className="mdc-dialog__container">
        <div
          className="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          tabIndex={0}
        >
          <form onSubmit={submit} className="login" id="login-container">
            <div className="login-container">
              <Link
                to="/"
                type="button"
                className="mdc-icon-button material-icons close-auth-dialog"
                data-mdc-dialog-action="no"
              >
                close
              </Link>
              <div className="logo">
                <img src={require("assets/img/logo.png")} alt="logo" />
              </div>
              <div className="login-input-container">
                <input
                  type="text"
                  required
                  placeholder="Username or Email"
                  name="username"
                  value={login.email}
                  autoFocus={true}
                  autoComplete="off"
                  tabIndex={0}
                  onChange={(e) =>
                    setLogin({ ...login, [e.target.name]: e.target.value })
                  }
                />
                <p
                  className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
                  style={{ width: "90%", margin: "0 auto", color: "red" }}
                >
                  {login_error.username}
                </p>
              </div>
              <div className="login-input-container">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  name="password"
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, [e.target.name]: e.target.value })
                  }
                />
                <p
                  className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
                  style={{ width: "90%", margin: "0 auto", color: "red" }}
                >
                  {login_error.password}
                </p>
              </div>
              <div className="action-container">
                <a
                  href="/auth/forgot"
                  className="forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginError({
                      username: "",
                    });
                    if (login.username.length < 5)
                      setLoginError({
                        username: "enter your username or email",
                      });
                    else if (reset)
                      setLoginError({
                        username: "Please wait",
                      });
                    else {
                      setReset(true);
                      axios
                        .post("/api/auth/forgot", {
                          username: login.username,
                        })
                        .then((response) => {
                          let errors = response.data.errors;
                          let { status } = response.data;
                          if (status) {
                            setToast({
                              msg: "Please check your inbox",
                              timeout: 8000,
                            });
                            setReset(false);
                          } else {
                            setReset(false);
                            errors.map((error) =>
                              setLoginError({ [error.param]: error.msg })
                            );
                          }
                        });
                    }
                  }}
                >
                  {reset ? "Please wait" : "Forgot Password"}
                </a>
                <button type="submit" className="submit btn">
                  Sign in
                </button>
                <div className="social">
                  <p>Login with Social Network</p>
                  <div className="social-link">
                    <button type="button">
                      <img
                        src={require("assets/img/facebook.png")}
                        alt="Login with Facebook"
                      />
                    </button>
                    <button type="button">
                      <img
                        src={require("assets/img/twitter.png")}
                        alt="Login with Facebook"
                      />
                    </button>
                    <button type="button">
                      <img
                        src={require("assets/img/google-plus.png")}
                        alt="Login with Facebook"
                      />
                    </button>
                    <p className="singup">
                      Don't have an account?{" "}
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(
                            "login-container"
                          ).style.display = "none";
                          document.getElementById(
                            "register-container"
                          ).style.display = "block";
                        }}
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form
            className="register"
            onSubmit={submit_register}
            style={{ display: "none" }}
            id="register-container"
          >
            <header className="register-header">
              <span>Troth</span>

              <Link
                to="/"
                type="button"
                className="mdc-icon-button material-icons close-auth-dialog"
                data-mdc-dialog-action="no"
                style={{
                  top: "4px",
                }}
              >
                close
              </Link>
            </header>
            <div
              role="progressbar"
              className="mdc-linear-progress mdc-linear-progress--indeterminate"
              style={{
                position: "absolute",
                top: "56px",
                left: 0,
                zIndex: "2",
                display: load ? "block" : "none",
              }}
            >
              <div className="mdc-linear-progress__buffer">
                <div className="mdc-linear-progress__buffer-bar"></div>
                <div className="mdc-linear-progress__buffer-dots"></div>
              </div>
              <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                <span className="mdc-linear-progress__bar-inner"></span>
              </div>
              <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                <span className="mdc-linear-progress__bar-inner"></span>
              </div>
            </div>
            <div
              className="register-scrim"
              style={{ display: load ? "block" : "none" }}
            ></div>
            <div className="header-label">Create your account</div>
            <div className="register-container">
              <div>
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    autoFocus={true}
                    required
                    name="name"
                    autoComplete="off"
                    value={data_register.name}
                    onChange={(e) =>
                      setData_register({
                        ...data_register,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Name</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  {register_error.name}
                </p>
              </div>
              <div>
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
                    required
                    autoComplete="off"
                    name="username"
                    value={data_register.username}
                    onChange={(e) =>
                      setData_register({
                        ...data_register,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Username</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  {register_error.username}
                </p>
              </div>
              <div>
                <div className="mdc-text-field">
                  <input
                    className="mdc-text-field__input"
                    type="email"
                    required
                    name="email"
                    value={data_register.email}
                    autoComplete="off"
                    onChange={(e) =>
                      setData_register({
                        ...data_register,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Email</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  {register_error.email}
                </p>
              </div>
              <div>
                <div className="mdc-text-field mdc-text-field--with-trailing-icon">
                  <button
                    type="button"
                    className="material-icons mdc-text-field__icon mdc-icon-button"
                    id="password-show"
                    onClick={() => setShow(!show)}
                  >
                    {show ? "visibility_off" : "visibility"}
                  </button>
                  <input
                    className="mdc-text-field__input"
                    type={show ? "text" : "password"}
                    required
                    name="password"
                    value={data_register.password}
                    onChange={(e) =>
                      setData_register({
                        ...data_register,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <div className="mdc-line-ripple"></div>
                  <label className="mdc-floating-label">Password</label>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg">
                  {register_error.password}
                </p>
              </div>
              <div className="flex center">
                <div
                  className="mdc-select mdc-select--no-label"
                  id="gender-select"
                  style={{ width: "100%" }}
                >
                  <div className="mdc-select__anchor">
                    <i className="mdc-select__dropdown-icon"></i>
                    <div
                      className="mdc-select__selected-text"
                      aria-required="true"
                    >
                      Gender
                    </div>
                    <span className="mdc-line-ripple"></span>
                  </div>
                  <div className="mdc-select__menu mdc-menu mdc-menu-surface">
                    <ul className="mdc-list">
                      <li className="mdc-list-item" data-value="male">
                        <span className="mdc-list-item__text">Male</span>
                      </li>
                      <li className="mdc-list-item" data-value="female">
                        <span className="mdc-list-item__text">Female</span>
                      </li>
                      <li className="mdc-list-item" data-value="custom">
                        <span className="mdc-list-item__text">Custom</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p
                className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
                style={{ marginBottom: "5px" }}
              >
                {register_error.gender}
              </p>
              <div>
                <p className="terms-text">
                  By clicking "Continue", you agree to the{" "}
                  <Link to="/terms" data-mdc-dialog-action="no">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" data-mdc-dialog-action="no">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              <div className="register-input">
                <div className="register-submit">
                  <button
                    className="mdc-button mdc-button--raised"
                    style={{ width: "100%" }}
                    disabled={load}
                  >
                    <span className="mdc-button__ripple"></span>Continue
                  </button>
                </div>
                <div className="action">
                  <p>
                    Already have an account?{" "}
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(
                          "login-container"
                        ).style.display = "block";
                        document.getElementById(
                          "register-container"
                        ).style.display = "none";
                      }}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>
  );
};
export default AuthDialog;
