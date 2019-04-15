require("dotenv").config();

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Keygrip = require("keygrip");
const express = require("express");
const app = express();
const PORT = 80;
// const superagent = require("superagent");
const slack = require("slack");
const Sheet = require("./spreadsheet");
const SHEETS = require("./sheets");
const sheet = new Sheet(SHEETS.HOST_CALLS);

sheet.init().then(async () => {
  // let header = await sheet.getHeader();
  // console.log(header);
  // let row = await sheet.getRowForCalls(5);
  // console.log(row);
  // let data = sheet.getStructuredData(header, row);
  // console.log(data);
  // console.log(firstCol.slice(firstCol.length - 100));
  // console.log("host details", sheet.getHostDetails(row, SHEETS.HOST_CALLS));
  // console.log("call details", sheet.getCallDetails(row, SHEETS.HOST_CALLS));
});

// parse application/json
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "session",
    keys: new Keygrip(["key1", "key2"], "SHA384", "base64"),

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);
app.use(cookieParser());
app.use(express.static("dist"));
app.get("/oauth", (req, res, next) => {
  // call slack to get token
  slack.oauth
    .access({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code
    })
    .then(response => {
      let { access_token } = response;

      if (access_token) {
        slack.conversations
          .list({
            token: access_token,
            exclude_archived: true,
            types: "private_channel"
          })
          .then(response => {
            if (response.channels) {
              if (
                response.channels.filter(i => i.name === "event-support-team")
                  .length === 1
              ) {
                res.cookie("token", access_token);
                res.redirect("/");
              } else {
                res.status(403).end();
              }
            } else {
              res.status(403).end();
            }
          });
      } else {
        res.status(403).end();
      }
    });
});

app.get("/api/nextrow", async (req, res, next) => {
  let index = sheet.getNextRowIndex();
  let row = await sheet.getStructuredRow(index);
  res.json(row);
});

app.put("/api/row", (req, res, next) => {
  // console.log(req.body);
  sheet.updateRow({ data: req.body.data, rowNum: req.body.rowNum });
  res.send("DONE...");
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
