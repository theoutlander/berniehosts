import React, { Component } from "react";
import { Segment, Form, Header, Divider } from "semantic-ui-react";
import FormHelper from "./form.helper";

// {
// 	"Event Creation Date": "4/7/19 5:30 PM",
// 	"First Name": "Guy",
// 	"Last Name": "Asmart",
// 	"Phone": "(518) 248-2036",
// 	"Email": "Asmartguy@nycap.rr.com",
// 	"Event City": "Albany",
// 	"Event State": "NY",
// 	"Event Zip": "12208",
// 	"Event Address": "To Be Determined Address",
// 	"Capacity Count": "20",
// 	"Approved?": "FALSE",
// 	"Event ID": "3100",
// 	"Public Event Signup Link": "https://act.berniesanders.com/event/organizing_kickoff/3100/signup/"
// "Host Event Edit Link ": ""
// }

// Make fields hidden
// Conditionally display fields
// Include script
// const FIELDS = [
//   [{ header: "First Name" }, { header: "Last Name" }],
//   [{ header: "Phone" }, { header: "Email" }],
//   { header: "Event Address" },
//   [
//     { header: "Event City" },
//     { header: "Event State" },
//     { header: "Event Zip" }
//   ],
//   [
//     { header: "Capacity Count" },
//     { header: "Approved?", options: ["Yes", "No"] }
//   ],
//   [{ header: "Event ID", readonly: true }, { header: "Event Creation Date" }],
//   [
//     { header: "Public Event Signup Link", readonly: true },
//     { header: "Host Event Edit Link", readonly: true }
//   ]
// ];

/*
Approved?: "5047"
Call Live: ""
Capacity Count: "21"
EVENT TITLE: ""
Edits Sent:: "FALSE"
Email: "Htormu@gmail.com"
Event Address: ""
Event City: "New York"
Event Creation Date: "4/14/19 1:37 AM"
Event Date: ""
Event ID: ""
Event Start Time: ""
Event State: "NY"
Event Type: "Default"
Event Zip: "10025"
First Name: "hudson"
"Host Event Edit Link ": "[City, State]: Bernie 2020 Organizing Kickoff!"
Host Time Zone: "Eastern"
Last Name: "mckinley uss"
Pass #: "2"
Phone: "(646) 630-3989"
Public Event Signup Link: ""
*/

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
        {/* {JSON.stringify(this.props.data.hostDetails)} */}
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
