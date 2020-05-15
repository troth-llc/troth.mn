import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Input,
  FormFeedback,
  Button,
  Alert,
} from "reactstrap";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./style.scss";
const Password = (props) => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [cookie, setCookie] = useCookies(["token"]);
  useEffect(() => {
    cookie.token && (window.location.href = "/");
  }, [cookie]);
  return (
    <div className="login">
      <h5 className="text-center w-100 pt-3 pb-3">Reset your password</h5>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setError({});
            if (data.password !== data.confirm_password)
              setError({ ...error, confirm_password: "Passwords don't match" });
            else {
              disable(true);
              axios
                .post("/api/auth/reset_password", {
                  ...data,
                  token: props.match.params.token,
                })
                .then((response) => {
                  let errors = response.data.errors;
                  let { status, token } = response.data;
                  if (status) setCookie("token", token, { path: "/" });
                  else if (status === false)
                    console.log("some thing went wrong");
                  else {
                    disable(false);
                    errors.map((error) =>
                      setError({ [error.param]: error.msg })
                    );
                  }
                });
            }
          }}
        >
          <FormGroup>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="input-round"
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              autoFocus={true}
              invalid={error.password ? true : false}
              disabled={disabled}
            />
            <FormFeedback>{error.password}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="input-round"
              invalid={error.confirm_password ? true : false}
              required={true}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              disabled={disabled}
            />
            <FormFeedback>{error.confirm_password}</FormFeedback>
          </FormGroup>
          {error.token ? (
            <Alert color="danger" className="mt-2">
              Token invalid or expired
            </Alert>
          ) : null}
          <div className="auth-action">
            <Button className="mt-2 auth-button" block disabled={disabled}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Password;
