import React, { Component } from "react";
import serverApi from "./serverApi";

class Record extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    let row = await serverApi.getNextRow();
    this.setState({ loading: false, row });
  }

  render() {
    if (this.state.loading) {
      return "Fetching data...";
    }

    let { row: record } = this.state;

    return (
      <div>
        <div>{JSON.stringify(record.row)}</div>
        <button
          onClick={e => {
            serverApi.updateRow(record.row, record.rowNum);
          }}
        >
          Update
        </button>
      </div>
    );
  }
}

export default Record;
