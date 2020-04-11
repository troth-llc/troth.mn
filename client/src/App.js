import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
// React Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
// Container
import { Profile, Find, Search, Settings, Forgot, Email } from "container";
// Components
import { AuthDialog, Header, Toast } from "components";
// App container
import AppContainer from "AppContainer";
// user context
import { User } from "context/user";
import { Snackbar } from "context/notification-toast";
import "./App.css";
const App = (props) => {
  // user context
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const login = () => {
    axios
      .get("/api/auth")
      .then((response) => {
        const { user } = response.data;
        if (user === null) {
          localStorage.removeItem("token");
          document.location.reload();
        }
        setUser(user);
      })
      .catch((error) => {
        if (error) localStorage.removeItem("token");
      });
  };
  useEffect(() => {
    login();
  }, []);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const toast_value = useMemo(() => ({ toast, setToast }), [toast, setToast]);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        localStorage.token ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
  return (
    <Router>
      <User.Provider value={value}>
        <Snackbar.Provider value={toast_value}>
          <AppContainer>
            <div className="app">
              <Header />
              {/* <Sidebar /> */}
              <div className="main">
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <PrivateRoute path="/profile" component={Profile} />
                  <PrivateRoute path="/settings*" component={Settings} />
                  <Route path="/auth" exact>
                    <AuthDialog open={true} />
                  </Route>
                  <Route path="/auth/reset_password" component={Forgot} />
                  <Route path="/auth/verify_email" component={Email} />
                  <Route path="/search/:search" component={Search} />
                  <Route path="/:username" component={Find} />
                  <Route path="*">
                    <Notfound />
                  </Route>
                </Switch>
              </div>
            </div>
            <Toast />
          </AppContainer>
        </Snackbar.Provider>
      </User.Provider>
    </Router>
  );
};
function Home() {
  return <h1> </h1>;
}
function Notfound() {
  return <h2>404 not found</h2>;
}
export default App;
