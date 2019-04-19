import React, { Component } from "react";
import { Segment, Form, Header, Divider } from "semantic-ui-react";
import FormHelper from "./form.helper";

const FIELDS = [
  [{ header: "First Name" }, { header: "Last Name" }],
  [{ header: "Phone" }, { header: "Email" }],
  { header: "Event Address" },
  [
    { header: "Event City" },
    { header: "Event State" },
    { header: "Event Zip" }
  ],
  [
    { header: "Capacity Count" },
    { header: "Approved?", options: ["Yes", "No"] }
  ],
  [{ header: "Event ID", readonly: true }, { header: "Event Creation Date" }],
  [
    { header: "EVENT TITLE" },
    { header: "Event Date" },
    { header: "Event Start Time" }
  ],
  [{ header: "Event Type" }, { header: "Host Time Zone" }],
  [
    { header: "Public Event Signup Link", readonly: true },
    { header: "Host Event Edit Link ", readonly: true }
  ],
  [
    { header: "Edits Sent:", hidden: true },
    { header: "Call Live", hidden: true, readonly: true }
  ],
  [{ header: "Pass #" }]
];

class HostDetails extends Component {
  render() {
    return (
      <Segment raised>
        <Header textAlign="center" as="h3">
          Host Details
        </Header>
        <Divider clearing />
        <Form size="huge">
          {FormHelper.renderInputs(
            this.props,
            this.props.data.hostDetails,
            FormHelper.handleChange.bind(
              this,
              this.props,
              this.props.data.hostDetails
            ),
            FIELDS
          )}
        </Form>
      </Segment>
    );
  }
}

export default HostDetails;
