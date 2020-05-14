import React, { useState } from "react";
import { Form, FormGroup, Input, FormFeedback, Button } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.scss";
const Login = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  return (
    <div className="login">
      <h5 className="text-center w-100 pt-3 pb-3">Sign in</h5>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(data);
            axios.post("/api/auth", { ...data }).then((response) => {
              let errors = response.data.errors;
              let { status, token } = response.data;
              if (status) {
                localStorage.setItem("token", token);
                window.location.href = "/";
              } else {
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
              Login
            </Button>
            <div className="no-account">
              No account?
              <Link to="/auth/register">Sign up</Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
