import React, { useState, useContext } from "react";
import {
  FormGroup,
  Input,
  FormFeedback,
  Button,
  Spinner,
  Label,
} from "reactstrap";
import { User } from "context/user";
import axios from "axios";
const Password = () => {
  const [disabled, disable] = useState(false);
  const [update, setUpdate] = useState({ old: "", updated: "", confirm: "" });
  const [error, setError] = useState({});
  const { user } = useContext(User);
  return user ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError({});
        if (update.updated !== update.confirm)
          setError({ confirm: "Passwords don't match" });
        else {
          disable(true);
          axios
            .post("/api/update/password", {
              ...update,
            })
            .then((response) => {
              if (response.data.status) window.location.reload();
              else {
                let errors = response.data.errors;
                errors.map((error) => setError({ [error.param]: error.msg }));
                disable(false);
              }
            });
        }
      }}
    >
      <p className="text-center mb-0">Update Password</p>
      <FormGroup>
        <Label>Current password</Label>
        <Input
          type="password"
          name="old"
          placeholder="Current password"
          className="input-settings"
          value={update.old}
          required={true}
          invalid={error.old ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.old}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>New Password</Label>
        <Input
          type="password"
          name="updated"
          placeholder="New Password"
          className="input-settings"
          value={update.updated}
          invalid={error.updated ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.updated}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Confirm password</Label>
        <Input
          type="password"
          name="confirm"
          placeholder="Confirm password"
          className="input-settings"
          value={update.confirm}
          invalid={error.confirm ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.confirm}</FormFeedback>
      </FormGroup>
      <div className="auth-action">
        <Button block disabled={disabled}>
          {disabled ? "Loading... " : "Save"}
        </Button>
      </div>
      <div className="invalid-feedback d-block">{error.status}</div>
    </form>
  ) : (
    <div className="text-center mt-4">
      <Spinner size="sm" color="secondary" />
    </div>
  );
};
export default Password;
