import React, { Component } from "react";
import { Segment, Header, Form, Divider } from "semantic-ui-react";
import FormHelper from "./form.helper";

const FIELDS = [
  [
    {
      header: "Call Result",
      options: [
        "Talked to Host",
        "Host Busy(Call Back)",
        "Left Voicemail",
        "Unable to Leave Voicemail",
        "Wrong Number",
        "Refused to Talk / Hung Up",
        "No Phone Number",
        "DUPLICATE"
      ]
    }
  ],
  [
    { header: "Location Confirmed?", options: ["Yes", "No"] },
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
    { header: "Time We Have Correct?", options: ["Yes", "No"] },
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
      header: "Tech Confirmed?",
      options: ["Yes", "No"]
    },
    {
      header: "ADA accessable?",
      options: ["Yes", "No"]
    }
  ],
  [
    {
      header: "Will double event capacity?",
      options: ["Yes", "No"]
    },
    {
      header: "If YES, new capacity #",
      show: {
        header: "Will double event capacity?",
        value: "Yes"
      }
    }
  ],
  [
    {
      header: "Webinar Status (If not completed, click to sign them up)"
    }
  ],
  {
    header: "Readiness Ranking",
    options: ["(1) Ready", "(2) Getting There", "(3) Needs Help", "Cancelled"]
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
    { header: "School Name in Event Title? ", options: ["Yes", "No"] },
    {
      header: "IF NO: School Name",
      show: {
        header: "School Name in Event Title? ",
        value: "No"
      }
    },
    { header: "Joined Student Slack?", options: ["Yes", "No"] },
    { header: "Will the event be on campus?", options: ["Yes", "No"] }
  ]
];

class CallDetails extends Component {
  render() {
    return (
      <Segment
        style={{
          background: "lightblue"
        }}
      >
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
