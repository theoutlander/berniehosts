import superagent from "superagent";

class ServerApi {
  getNextRow() {
    return new Promise((resolve, reject) => {
      superagent.get("/api/nextrow").end((err, res) => {
        resolve(res.body);
      });
    });
  }

  updateRow(data, rowNum) {
    superagent
      .put("/api/row")
      .send({ data, rowNum }) // sends a JSON post body
      .end((err, res) => {
        if (err) {
          return console.error(err);
        }

        console.log(res);
      });
  }
}

export default new ServerApi();
