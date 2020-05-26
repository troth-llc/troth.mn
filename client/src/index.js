import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import Cookies from "js-cookie";
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token !== null) {
    config.headers["x-auth-token"] = token ? token : "";
    config.headers.Authorization = `Bearer ${token ? token : ""}`;
  }
  return config;
});
ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
