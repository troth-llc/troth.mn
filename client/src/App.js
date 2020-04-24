import React from "react";
import "./App.css";
import { Header, BottomNav } from "components";
import { Home, Search, Profile, Calendar, Event } from "container";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
const App = () => {
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
      <Header />
      <div className="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/profile" component={Profile} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/event/:id" component={Event} />
          <PrivateRoute path="/admin" component={Profile} />
        </Switch>
      </div>
      <BottomNav />
    </Router>
  );
};
export default App;
