import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { AuthContext } from "./context";
import Dashboard from "./dashboard";
import AuthCallback from "./auth.callback";
import Cookies from "js-cookie";

import { Switch, Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
  isAuthenticated = () => {
    console.log(Cookies.get("token"));
    return Cookies.get("token") != null;
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: this.isAuthenticated
        }}
      >
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
