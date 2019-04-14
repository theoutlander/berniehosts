import React, { Component } from "react";
import { AuthContext } from "./context";

class Dashboard extends Component {
  state = {};

  constructor(props) {
    super(props);
    // console.log(Cookies.get("token"));
  }

  render() {
    return (
      <AuthContext.Consumer>
        {value => {
          return value.isAuthenticated() ? (
            <div>Hello App</div>
          ) : (
            <a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.avatar&client_id=594723647687.596199046978">
              <img
                alt="Sign in with Slack"
                height="40"
                width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x,
                https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

export default Dashboard;
