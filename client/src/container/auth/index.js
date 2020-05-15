import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, FormFeedback, Button } from "reactstrap";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.scss";
const Login = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [cookie, setCookie] = useCookies(["token"]);
  useEffect(() => {
    cookie.token && (window.location.href = "/");
  }, [cookie]);
  return (
    <div className="login">
      <h5 className="text-center w-100 pt-3 pb-3">Sign in</h5>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            axios.post("/api/auth", { ...data }).then((response) => {
              let errors = response.data.errors;
              let { status, token } = response.data;
              if (status) setCookie("token", token, { path: "/" });
              else if (status === false)
                setError({ status: "Server unavailable, Try again later" });
              else {
                disable(false);
                errors.map((error) => setError({ [error.param]: error.msg }));
              }
            });
            disable(true);
          }}
        >
          <FormGroup>
            <Input
              type="text"
              name="username"
              placeholder="Email or Username"
              className="input-round"
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              autoFocus={true}
              invalid={error.username ? true : false}
              autoComplete="off"
              disabled={disabled}
            />
            <FormFeedback>{error.username}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="input-round"
              invalid={error.password ? true : false}
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              disabled={disabled}
            />
            <FormFeedback>{error.password}</FormFeedback>
          </FormGroup>
          <div className="auth-action">
            <Link to="/auth/forgot">Forgot password?</Link>
            <Button className="mt-2 auth-button" block disabled={disabled}>
              {disabled ? "Loading... " : "Sign in"}
            </Button>
            <div className="no-account">
              No account?
              <Link to="/auth/register">Sign up</Link>
            </div>
            <div className="invalid-feedback d-block">{error.status}</div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
