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
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.scss";
const Forgot = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [disabled, disable] = useState(false);
  const [cookie] = useCookies(["token"]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    cookie.token && (window.location.href = "/");
  }, [cookie]);
  return (
    <div className="login">
      <h5 className="text-center w-100 pt-3 pb-3">Forgot password</h5>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setError({});
            axios.post("/api/auth/forgot", { ...data }).then((response) => {
              let errors = response.data.errors;
              let { status } = response.data;
              if (status) setOpen(true);
              else if (status === false) console.log("some thing went wrong");
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
          {open ? (
            <Alert color="success" className="mt-2">
              Please check your inbox
            </Alert>
          ) : null}
          <div className="auth-action">
            <Link to="/auth">Sign in</Link>
            <Button className="mt-2 auth-button" block disabled={disabled}>
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Forgot;
