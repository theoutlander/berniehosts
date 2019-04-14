import React, { Component } from "react";
import { AuthContext } from "./context";
import queryString from "querystring";
import { Redirect } from "react-router-dom";

class AuthCallback extends Component {
  state = { token: null };
  componentDidMount() {
    const params = queryString.parse(location.search.replace("?", ""));
    if (params && params.code) {
      this.setState({ token: params.code });
    }
  }
  render() {
    return (
      <AuthContext.Consumer>
        {value => {
          if (this.state.token) {
            value.setToken(this.state.token);
            return <Redirect push to="/" />;
          }

          return "Callback...";
        }}
      </AuthContext.Consumer>
    );
  }
}

export default AuthCallback;
