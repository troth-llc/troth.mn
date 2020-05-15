import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "reactstrap";
const Email = (props) => {
  const { token } = props.match.params;
  const [error, seterror] = useState("loading");
  useEffect(() => {
    if (token)
      axios
        .post("/api/auth/verify_email", { token })
        .then((response) =>
          response.data.status
            ? (window.location.href = "/")
            : seterror("invalid token")
        );
  }, [token]);
  return token ? (
    error === "loading" ? (
      <div className="text-center w-100 mt-5">
        <Spinner size="sm" color="secondary" />
      </div>
    ) : (
      <div className="text-center w-100 mt-5">
        <p className="text-center" style={{ paddingTop: "50px" }}>
          {error}
        </p>
      </div>
    )
  ) : (
    <div className="text-center w-100 mt-5">
      <p className="text-center" style={{ paddingTop: "50px" }}>
        invalid token
      </p>
    </div>
  );
};
export default Email;
