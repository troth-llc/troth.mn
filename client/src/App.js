import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import "@material/react-drawer/dist/drawer.css";
import { Header, BottomNav } from "components";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Home,
  Search,
  Profile,
  // Calendar,
  // Event,
  Login,
  Register,
  Forgot,
  Password,
  Email,
  Find,
  Info,
  Notification,
  ProjectCreate,
  Projects,
  ProjectView,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Route exact path="/coming-soon">
              <div id="coming-soon">
                <div className="center">
                  <span className="material-icons">laptop</span>
                  <span className="notice">
                    Your browser is not currently supported.
                  </span>
                  <a
                    href="https://discord.gg/HaQC5r3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join discord
                  </a>
                </div>
              </div>
            </Route>
            <PrivateRoute
              path="/notifications"
              exact
              component={Notification}
            />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/settings" component={Info} />
            {/* <PrivateRoute path="/calendar" component={Calendar} /> */}
            {/* <PrivateRoute path="/event/:id" component={Event} /> */}
            {/* auth routes */}
            <Route exact path="/auth" component={Login} />
            <Route exact path="/auth/forgot" component={Forgot} />
            <Route exact path="/auth/password/:token" component={Password} />
            <Route exact path="/auth/email/:token" component={Email} />
            <Route path="/auth/register" component={Register} />
            {/* Project */}
            <Route path="/project/view/:id" component={ProjectView} />
            <PrivateRoute path="/project/create" component={ProjectCreate} />
            <PrivateRoute path="/project" component={Projects} />
            {/* Other */}
            <Route path="/:username" component={Find} />
            <Route path="*">
              <h6 className="text-center mt-4">404 Not Found</h6>
            </Route>
          </Switch>
        </div>
        <BottomNav />
      </User.Provider>
    </Router>
  );
};
export default App;
