import React from "react";
import "./App.css";
import { Header, BottomNav } from "components";
import { Home } from "container";
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
          <PrivateRoute path="/profile" component={() => <h1>profile</h1>} />
        </Switch>
      </div>
      <BottomNav />
    </Router>
  );
};
export default App;
