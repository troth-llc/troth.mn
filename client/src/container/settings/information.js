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
const Information = () => {
  const [disabled, disable] = useState(false);
  const { user } = useContext(User);
  const [update, setUpdate] = useState(user);
  const [error, setError] = useState({});
  return user ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        disable(true);
        axios
          .post("/api/update/info", {
            ...update,
          })
          .then((response) => {
            if (response.data.status) window.location.reload();
            else {
              let errors = response.data.errors;
              errors.map((error) =>
                setError({ ...error, [error.param]: error.msg })
              );
              disable(false);
            }
          });
      }}
    >
      <p className="text-center mb-0">Update Information</p>
      <FormGroup>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          className="input-settings"
          value={update.name}
          required={true}
          invalid={error.name ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
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
          className="input-settings"
          value={update.username}
          required={true}
          invalid={error.username ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.username}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Phone</Label>
        <Input
          type="number"
          name="phone"
          placeholder="Phone"
          className="input-settings"
          value={update.phone}
          invalid={error.phone ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.phone}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Website</Label>
        <Input
          type="url"
          name="website"
          placeholder="Website"
          className="input-settings"
          value={update.website}
          invalid={error.website ? true : false}
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.website}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Bio</Label>
        <Input
          type="textarea"
          name="about"
          value={update.about}
          invalid={error.about ? true : false}
          className="input-settings"
          onChange={(e) =>
            setUpdate({ ...update, [e.target.name]: e.target.value })
          }
          autoComplete="off"
          disabled={disabled}
        />
        <FormFeedback>{error.about}</FormFeedback>
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
export default Information;
