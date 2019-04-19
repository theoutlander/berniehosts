import React, { Component } from "react";
import serverApi from "../api/serverApi";
import HostDetails from "./host.details";
import CallDetails from "./call.details";
import { Segment, Form, Container, Grid } from "semantic-ui-react";

class Record extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    let row = await serverApi.getNextRow();
    this.setState({ loading: false, row });
  }

  handleHostChange = data => {
    console.log("handleHostChange: ", data);
    let row = { ...this.state.row };
    row.hostDetails = data;
    this.setState({ row });
  };

  handleCallChange = data => {
    console.log("handleCallChange: ", data);
    let row = { ...this.state.row };
    row.callDetails = data;
    this.setState({ row });
  };

  render() {
    if (this.state.loading) {
      return "Fetching data...";
    }

    let { row: record } = this.state;
    console.log(this.state);

    return (
      <Container fluid>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={8}>
              {/* <Segment.Group> */}
              {/* <div>{JSON.stringify(record.row)}</div> */}
              <Segment basic>
                <HostDetails
                  data={this.state.row}
                  onChange={this.handleHostChange}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment basic>
                <CallDetails
                  data={this.state.row}
                  onChange={this.handleCallChange}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row width={16}>
            <Grid.Column>
              <Segment>
                <Form.Button
                  onClick={e => {
                    record.row = {
                      ...record.row,
                      ...record.hostDetails,
                      ...record.callDetails
                    };
                    serverApi.updateRow(record.row, record.rowNum);
                  }}
                >
                  Update Record
                </Form.Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          {/* </Segment.Group> */}
        </Grid>
      </Container>
    );
  }
}

export default Record;
