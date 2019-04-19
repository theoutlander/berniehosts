import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { AuthContext } from "./context";
import Dashboard from "./views/dashboard";
import AuthCallback from "./components/auth.callback";
import Cookies from "js-cookie";

import { Switch, Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";

const isAuthenticated = () => {
  console.log(Cookies.get("token"));
  return Cookies.get("token") != null;
};

class App extends React.Component {
  render() {
    return (
      <AuthContext.Provider value={{ isAuthenticated }}>
        <Router>
          <Switch>
            <Route exact path="/oauth" component={AuthCallback} />
            <Route exact path="/" component={Dashboard} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
