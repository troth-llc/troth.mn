import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import { Header, BottomNav } from "components";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Home,
  Search,
  Profile,
  Calendar,
  Event,
  Login,
  Register,
} from "container";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
// own context
import { User } from "context/user";
const App = () => {
  const [cookie, , removeCookie] = useCookies("token");
  const [user, setUser] = useState(null);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        cookie.token ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
  const login = () => {
    if (cookie.token) {
      axios
        .get("/api/auth")
        .then((response) => {
          const { user, msg } = response.data;
          if (user === null || msg) {
            removeCookie("token");
            document.location.reload();
          }
          setUser(user);
        })
        .catch((error) => {
          if (error) {
            removeCookie("token");
            document.location.reload();
          }
        });
    }
  };
  useEffect(() => {
    login();
  }, []);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <Router>
      <User.Provider value={value}>
        <Header />
        <div className="app">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/event/:id" component={Event} />
            <Route exact path="/auth" component={Login} />
            <Route path="/auth/register" component={Register} />
          </Switch>
        </div>
        <BottomNav />
      </User.Provider>
    </Router>
  );
};
export default App;
