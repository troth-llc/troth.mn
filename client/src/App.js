import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
// React Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Container
import { Profile, Find } from "./container";
// Components
import { AuthDialog, Sidebar, Header } from "./components";
// App container
import AppContainer from "AppContainer";
// user context
import { User } from "context/user";
import "./App.css";
export default function App() {
  // user context
  const [user, setUser] = useState(null);
  const login = () => {
    axios
      .get("/api/auth")
      .then(response => {
        const { user } = response.data;
        if (user === null) {
          localStorage.removeItem("token");
          document.location.reload();
        }
        setUser(user);
      })
      .catch(error => {
        if (error) {
          localStorage.removeItem("token");
        }
      });
  };
  useEffect(() => {
    login();
  }, []);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.token ? (
          <Component {...props} />
        ) : (
          <AuthDialog open={true} />
        )
      }
    />
  );
  return (
    <Router>
      <User.Provider value={value}>
        <AppContainer>
          <div className="app">
            <Header />
            <Sidebar />
            <div className="main">
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <PrivateRoute path="/profile" component={Profile} />
                <Route path="/:username" component={Find} />
                <Route path="*">
                  <Notfound />
                </Route>
              </Switch>
            </div>
          </div>
          <AuthDialog />
        </AppContainer>
      </User.Provider>
    </Router>
  );
}
function Home() {
  return <h1> </h1>;
}
function Notfound() {
  return <h2>404 not found</h2>;
}
