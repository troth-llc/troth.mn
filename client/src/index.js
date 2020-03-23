import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    config.headers["x-auth-token"] = token;
    config.headers.Authorization = `Bearer ${localStorage.token}`;
  }
  return config;
});
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
