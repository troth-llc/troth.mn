import React from "react";
const Email = () => {
  const token_url = new URLSearchParams(window.location.search);
  const token = token_url.get("token");
  return token ? (
    "hola"
  ) : (
    <p className="text-center" style={{ paddingTop: "50px" }}>
      invalid token
    </p>
  );
};
export default Email;
