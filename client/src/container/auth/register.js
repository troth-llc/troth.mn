import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Input,
  FormFeedback,
  Button,
  Label,
} from "reactstrap";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const cookie = Cookies.get("token");
  var dev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  useEffect(() => {
    cookie && (window.location.href = "/");
  }, [cookie]);
  return (
    <div className="register">
      <h5 className="text-center w-100 pt-3 pb-3">Sign up</h5>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setError({});
            axios.post("/api/auth/register", { ...data }).then((response) => {
              let errors = response.data.errors;
              let { status, token } = response.data;
              if (status) {
                Cookies.set("token", token, {
                  path: "/",
                  domain: `${dev ? window.location.hostname : ".troth.mn"}`,
                  secure: dev ? false : true,
                });
                window.location.href = "/";
              } else if (status === false)
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
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              className="input-round"
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              autoFocus={true}
              invalid={error.name ? true : false}
              autoComplete="off"
              disabled={disabled}
            />
            <FormFeedback>{error.name}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              className="input-round"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              invalid={error.username ? true : false}
              autoComplete="off"
              disabled={disabled}
            />
            <FormFeedback>{error.username}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              className="input-round"
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              invalid={error.email ? true : false}
              autoComplete="off"
              disabled={disabled}
            />
            <FormFeedback>{error.email}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
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
            <Button className="mt-2 auth-button" block disabled={disabled}>
              {disabled ? "Loading..." : "Signup"}
            </Button>
            <div className="invalid-feedback d-block">{error.status}</div>
            <div className="no-account">
              Already a member?
              <Link to="/auth">Sign in</Link>
            </div>
            <div className="legal">
              By continuing, you agree to TROTH's{" "}
              <Link to="/terms">Terms of Service</Link>,{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Register;
