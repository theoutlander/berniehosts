import React, { Component } from "react";
import { AuthContext } from "./context";
import Record from "./record";

const CLIENT_ID = process.env.CLIENT_ID;

class Dashboard extends Component {
  state = {};

  render() {
    return (
      <AuthContext.Consumer>
        {value => {
          return value.isAuthenticated() ? (
            <Record />
          ) : (
            <a
              href={`https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.avatar&client_id=${CLIENT_ID}`}
            >
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
