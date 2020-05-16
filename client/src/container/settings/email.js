import React, { useContext, useState, useEffect } from "react";
import { User } from "context/user";
import {
  Spinner,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  Button,
  Alert,
  Modal,
} from "reactstrap";
import axios from "axios";
const Email = () => {
  const { user } = useContext(User);
  const [update, setUpdate] = useState({ email: "", password: "" });
  const [disabled, disable] = useState(false);
  const [error, setError] = useState({});
  const [code, setCode] = useState("");
  const [modal, openModal] = useState(false);
  useEffect(() => {
    if (user) {
      setError({
        ...update,
        email: user.email_verified_at ? "" : "Not verified",
      });
      setUpdate({ email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return user ? (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (
            update.email.trim().toLowerCase() ===
            user.email.trim().toLowerCase()
          )
            setError({ ...error, email: "Please enter a different email" });
          else {
            setError({});
            disable(true);
            axios
              .post("/api/update/email", {
                ...update,
              })
              .then((response) => {
                if (response.data.status === true) {
                  disable(false);
                  openModal(true);
                } else if (response.data.status)
                  setError({
                    status: "Server unavailable, Try again later",
                  });
                else {
                  let errors = response.data.errors;
                  errors.map((error) =>
                    setError({ ...error, [error.param]: error.msg })
                  );
                  disable(false);
                }
              });
          }
        }}
      >
        <p className="text-center mb-0">Update Email</p>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="input-settings"
            value={update.email}
            required={true}
            invalid={error.email ? true : false}
            onChange={(e) =>
              setUpdate({ ...update, [e.target.name]: e.target.value })
            }
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
            className="input-settings"
            required={true}
            invalid={error.password ? true : false}
            onChange={(e) =>
              setUpdate({ ...update, [e.target.name]: e.target.value })
            }
            disabled={disabled}
          />
          <FormFeedback>{error.password}</FormFeedback>
        </FormGroup>
        <Alert
          color="primary"
          style={{ display: error.resend ? "block" : "none" }}
          className="mt-2 mb-0"
        >
          Please check your inbox
        </Alert>
        <div className="auth-action">
          {!user.email_verified_at ? (
            <a
              disabled={disabled}
              className={error.resend ? "d-none" : null}
              style={{ color: disabled ? "#898989" : null }}
              href="#resend"
              onClick={(e) => {
                e.preventDefault();
                if (!disabled) {
                  disable(true);
                  axios.get("/api/auth/email").then((response) =>
                    response.data.status
                      ? (setError({ ...error, resend: true }), disable(false))
                      : setError({
                          status: "Server unavailable, Try again later",
                        })
                  );
                }
              }}
            >
              {disabled ? "Loading..." : "Resend verification link"}
            </a>
          ) : (
            ""
          )}
          <Button block disabled={disabled} className="mt-2">
            {disabled ? "Loading... " : "Save"}
          </Button>
        </div>
        <div className="invalid-feedback d-block">{error.status}</div>
      </form>
      <Modal isOpen={modal} centered>
        <form
          className="modal-body settings"
          onSubmit={(e) => {
            e.preventDefault();
            disable(true);
            axios.post("/api/update/code", { code }).then((response) => {
              if (response.data.status) window.location.reload();
              else {
                disable(false);
                let errors = response.data.errors;
                errors.map((error) => setError({ verify: error.msg }));
              }
            });
          }}
        >
          <FormGroup>
            <Label>Enter the verification code sent to your email</Label>
            <Input
              type="number"
              name="code"
              placeholder="Code"
              className="input-settings"
              required={true}
              invalid={error.verify ? true : false}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
            />
            <FormFeedback>{error.verify}</FormFeedback>
          </FormGroup>
          <div className="auth-action">
            <Button block disabled={disabled} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Modal>
    </>
  ) : (
    <div className="text-center mt-4">
      <Spinner size="sm" color="secondary" />
    </div>
  );
};
export default Email;
