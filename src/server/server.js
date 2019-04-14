require("dotenv").config();

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const Keygrip = require("keygrip");
const express = require("express");
const app = express();
const PORT = 80;
// const superagent = require("superagent");
const slack = require("slack");
const Sheet = require("./spreadsheet");
const sheet = new Sheet();
const SHEETS = require("./sheets");

sheet.init().then(async () => {
  let header = await sheet.getHeader(SHEETS.HOST_CALLS);
  let row = await sheet.getRowForHostCalls(5);
  let data = sheet.getStructuredData(header, row, SHEETS.HOST_CALLS);

  // console.log(firstCol.slice(firstCol.length - 100));
  // console.log("host details", sheet.getHostDetails(row, SHEETS.HOST_CALLS));
  // console.log("call details", sheet.getCallDetails(row, SHEETS.HOST_CALLS));
});

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
app.listen(PORT, () => `Server is listening on port ${PORT}`);
