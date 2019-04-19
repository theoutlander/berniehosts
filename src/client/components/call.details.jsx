import React, { Component } from "react";
import { Segment, Header, Form, Divider } from "semantic-ui-react";
import FormHelper from "./form.helper";

const FIELDS = [
  [{ header: "Call Result" }],
  [
    { header: "Location Confirmed?" },
    { header: "Address We Have Correct?", options: ["Yes", "No"] }
  ],
  {
    header: "If NO: Correct Address",
    show: {
      header: "Address We Have Correct?",
      value: "No"
      // condition: "="
    }
  },
  [
    { header: "Time We Have Correct?" },
    {
      header: "If NO: Correct Time",
      show: {
        header: "Time We Have Correct?",
        value: "No"
      }
    }
  ],
  [
    {
      header: "Tech Confirmed?"
    },
    {
      header: "ADA accessable?"
    }
  ],
  [
    {
      header: "Will double event capacity?"
    },
    {
      header: "If YES, new capacity #"
    }
  ],
  [
    {
      header: "Webinar Status (If not completed, click to sign them up)"
    }
  ],
  {
    header: "Readiness Ranking"
  },
  {
    header: "Notes",
    type: "textarea"
  },
  {
    header: "Notes on Accessibility",
    type: "textarea"
  },
  [
    { header: "IF NO: School Name" },
    { header: "Joined Student Slack?" },
    { header: "School Name in Event Title? " },
    { header: "Will the event be on campus?" }
  ]
];

class CallDetails extends Component {
  render() {
    return (
      <Segment>
        <Header textAlign="center" as="h3">
          Call Details
        </Header>
        <Divider clearing />
        <Form size="huge">
          {FormHelper.renderInputs(
            this.props,
            {
              ...this.props.data.callDetails,
              ...this.props.data.studentDetails
            },
            FormHelper.handleChange.bind(
              this,
              this.props,
              this.props.data.callDetails
            ),
            FIELDS
          )}
        </Form>
      </Segment>
    );
  }
}

export default CallDetails;
