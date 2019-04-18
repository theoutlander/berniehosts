import React, { Component } from "react";
import { Segment, Header, Form, Divider } from "semantic-ui-react";
import FormHelper from "./form.helper";

// Additional Notes: "this person thinks Bernie is full communist. wants one type of cereal, thinks people who join Bernie's movement early will be higher ranking in the communist party. This person is not a good representative of bernie. He has some unusual ideas about rape and quotas and stuff. Event is basically almost canceled in his words. He was hoping if 2 other Berniecrats in the area signed up that the work would be spit in 3rds."
// Attended a webinar ?: "No"
// Call Result: "Talked to Host"
// "Date you called (use time below)": "4/9/2019"
// Event Address Accurate ?: "No"
// Event Location Confirmed?: "Location TBD"
// "Host Guide Received (via email)? ": ""
// "If NO, write correct address here": ""
// If YES, what # should their doubled event capacity be ?: ""
// "If no, were you able to sign them up? (click for link)": ""
// Is the event ADA accessable ?: "No"
// Livestream Tech Confirmed ?: "No"
// Needs another Host Guide / Spanish Guide ?: "Yes"
// Readiness Ranking: "(3) Needs Help "
// Signed up for webinar ?: "No"
// Time Zone: "Eastern"
// Will they double their capacity # to account for folks who will RSVP but not make it ?: ""

// const FIELDS = [
//   [
//     { header: "Date you called (use time below)" },
//     { header: "Time Zone" },
//     { header: "Call Result" }
//   ],
//   [
//     { header: "Event Location Confirmed?" },
//     { header: "Event Address Accurate?" }
//   ],
//   {
//     header: "If NO, write correct address here"
//   },
//   [
//     {
//       header: "Livestream Tech Confirmed?"
//     },
//     {
//       header: "Is the event ADA accessable?"
//     }
//   ],
//   [
//     {
//       header:
//         "Will they double their capacity # to account for folks who will RSVP but not make it?"
//     },
//     {
//       header: "If YES, what # should their doubled event capacity be?"
//     }
//   ],
//   [
//     {
//       header: "Signed up for webinar?"
//     },
//     {
//       header: "If no, were you able to sign them up? (click for link)"
//     }
//   ],
//   [
//     {
//       header: "Attended a webinar?"
//     },
//     {
//       header: "Host Guide Received (via email)?"
//     },
//     {
//       header: "Needs another Host Guide / Spanish Guide?"
//     }
//   ],
//   {
//     header: "Readiness Ranking"
//   },
//   {
//     header: "Additional Notes",
//     type: "textarea"
//   }
// ];

const FIELDS = [
  [{ header: "Call Result" }],
  [{ header: "Location Confirmed?" }, { header: "Address We Have Correct?" }],
  {
    header: "If NO: Correct Address"
  },
  [{ header: "Time We Have Correct?" }, { header: "If NO: Correct Time" }],
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
        {/* {JSON.stringify(this.props.data.callDetails)} */}
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
