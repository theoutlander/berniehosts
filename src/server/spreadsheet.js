const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
const SHEETS = require("./sheets");
const SpreadsheetColumn = require("spreadsheet-column");
const spreadsheetColumn = new SpreadsheetColumn();

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const SPREADSHEET_ID = "14BBXOF1KBCXzrijozMJR_cCVXaJffnuvwxbphbqVs9o";
// const TAB_NAMES = ["Host Calls", "Student Host Calls", "Bilingual Host Calls"];

class Spreadsheet {
  constructor() {
    this.googleSheet = null;
    this.queue = [];
    this.nextRow = 509; // starting at index 0
  }
  init() {
    return new Promise((resolve, reject) => {
      // Load client secrets from a local file.
      fs.readFile(path.join(__dirname, "credentials.json"), (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Authorize a client with credentials, then call the Google Sheets API.
        this.authorize(JSON.parse(content), async auth => {
          this.googleSheet = google.sheets({ version: "v4", auth });

          this.queue = await this.getColumn({
            column: "A",
            rowStart: 1,
            // rowEnd: 4000, // 3503
            // rowEnd: 3500, // 3467
            rowEnd: 4500, // 3467
            tabName: SHEETS.HOST_CALLS.tabName
          });

          this.queue = this.queue.map((name, row) => {
            return [
              name[0],
              {
                name: name[0],
                row: row + 1
              }
            ];
          });

          // console.log(this.queue);
          this.getNextRow();
          resolve();
        });
      });
    });
  }

  getNextRow() {
    if (this.queue[this.nextRow] !== "") {
      // console.log(this.queue);
      let next = this.nextRow;
      let index = this.queue.slice(next).findIndex(item => {
        console.log(item[0]);
        return typeof item[0] !== "string";
      });
      let row = this.nextRow + index;
      console.log("index", row);
    }
  }
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return this.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          return console.error(
            "Error while trying to retrieve access token",
            err
          );
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  getRowForStudentHostCalls(num) {
    return this.getRow({
      num,
      tabName: SHEETS.STUDENT_HOST_CALLS.tabName,
      start: SHEETS.STUDENT_HOST_CALLS.hostStart,
      end: SHEETS.STUDENT_HOST_CALLS.hostEnd
    });
  }

  getRowForBilingualHostCalls(num) {
    return this.getRow({
      num,
      tabName: SHEETS.BILINGUAL_HOST_CALLS.tabName,
      start: SHEETS.BILINGUAL_HOST_CALLS.hostStart,
      end: SHEETS.BILINGUAL_HOST_CALLS.hostEnd
    });
  }

  getStructuredData(header, row, sheet) {
    let result = {
      row: {},
      callerDetails: {},
      hostDetails: {},
      callDetails: {},
      sheet
    };

    for (let i = 0; i < header.length; i++) {
      result.row[header[i]] = row[i];
    }

    let hostRowDetails = this.getHostDetails(row, sheet);
    let hostHeaderDetails = this.getHostDetails(header, sheet);

    for (let i = 0; i < hostHeaderDetails.length; i++) {
      result.hostDetails[hostHeaderDetails[i]] = hostRowDetails[i];
    }

    let callRowDetails = this.getCallDetails(row, sheet);
    let callHeaderDetails = this.getCallDetails(header, sheet);
    for (let i = 0; i < callHeaderDetails.length; i++) {
      result.callDetails[callHeaderDetails[i]] = callRowDetails[i];
    }

    result.callerDetails = {
      [header[0]]: row[0]
    };

    return result;
  }

  getRowForHostCalls(num) {
    return this.getRow({
      num,
      tabName: SHEETS.HOST_CALLS.tabName,
      start: SHEETS.HOST_CALLS.rowStart,
      end: SHEETS.HOST_CALLS.rowEnd
    });
  }

  getColumnFromString(num) {
    return spreadsheetColumn.fromStr(num) - 1;
  }

  getCallDetails(row, sheet) {
    let start = this.getColumnFromString(sheet.callStart);
    let end = this.getColumnFromString(sheet.callEnd);
    // console.log(start, end);
    return row.slice(start, end);
  }

  getHostDetails(row, sheet) {
    let start = this.getColumnFromString(sheet.hostStart);
    let end = this.getColumnFromString(sheet.hostEnd);
    // console.log(start, end);
    return row.slice(start, end);
  }

  getHeader(sheet) {
    return this.getRow({
      num: sheet.headerRow,
      tabName: sheet.tabName,
      start: sheet.rowStart,
      end: sheet.rowEnd
    });
  }

  getColumn({ column, rowStart, rowEnd, tabName }) {
    return new Promise((resolve, reject) => {
      console.log(`${tabName}!${column}${rowStart}:${column}${rowEnd}`);
      this.googleSheet.spreadsheets.values.get(
        {
          spreadsheetId: SPREADSHEET_ID,
          range: `${tabName}!${column}${rowStart}:${column}${rowEnd}`
        },
        (err, res) => {
          if (err) {
            console.log("The API returned an error: " + err);
            return reject(err);
          }

          const rows = res.data.values;
          resolve(rows.length === 1 ? rows[0] : rows);
        }
      );
    });
  }

  getRow({ num, tabName, start, end }) {
    return new Promise((resolve, reject) => {
      this.googleSheet.spreadsheets.values.get(
        {
          spreadsheetId: SPREADSHEET_ID,
          range: `${tabName}!${start}${num}:${end}${num}`
        },
        (err, res) => {
          if (err) {
            console.log("The API returned an error: " + err);
            return reject(err);
          }

          const rows = res.data.values;
          // console.log(rows[0]);
          //   if (rows.length) {
          //     console.log("Name, Major:");
          //     rows.map(row => {
          //       console.log(`${row[0]}, ${row[4]}`);
          //     });
          //   } else {
          //     console.log("No data found.");
          //   }

          resolve(rows.length === 1 ? rows[0] : rows);
        }
      );
    });
  }
}
module.exports = Spreadsheet;
