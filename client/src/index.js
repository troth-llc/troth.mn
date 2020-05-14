import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import { CookiesProvider } from "react-cookie";
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
axios.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token !== null) {
    config.headers["x-auth-token"] = token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
