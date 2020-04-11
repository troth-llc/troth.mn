import React, { useEffect, useState } from "react";
import axios from "axios";
const Email = () => {
  const token_url = new URLSearchParams(window.location.search);
  const token = token_url.get("token");
  const [error, seterror] = useState("please wait");
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
    error
  ) : (
    <p className="text-center" style={{ paddingTop: "50px" }}>
      invalid token
    </p>
  );
};
export default Email;
