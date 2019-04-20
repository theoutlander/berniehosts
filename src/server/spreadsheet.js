const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
// const SHEETS = require("./sheets");
const SpreadsheetColumn = require("spreadsheet-column");
const spreadsheetColumn = new SpreadsheetColumn();

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// const SPREADSHEET_ID = "14BBXOF1KBCXzrijozMJR_cCVXaJffnuvwxbphbqVs9o"; // Prod sheet
//const SPREADSHEET_ID = "1QGJ_0yn5WGG4O3aI2Vmfm-eAhqQWnY0TBra8Fz9AQOQ"; // DEV sheet
const SPREADSHEET_ID = "1nkUvaJwM7PWA_BUM8Yj2eMwHNqPBDulViaN9CvtjHEc"; // NEW DEV SHEET ....need related PROD id

class Spreadsheet {
  constructor(callSheet) {
    this.googleSheet = null;
    this.queue = [];
    this.nextRow = callSheet.nextRow; // starting at index 0
    this.callSheet = callSheet;
    this.header = [];
  }
  init() {
    return new Promise((resolve, reject) => {
      // Load client secrets from a local file.
      fs.readFile(path.join(__dirname, "credentials.json"), (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Authorize a client with credentials, then call the Google Sheets API.
        this.authorize(JSON.parse(content), async auth => {
          this.googleSheet = google.sheets({ version: "v4", auth });

          // Get all the data in the first colunn of the sheet
          this.queue = await this.getColumn({
            column: this.callSheet.rowStart,
            rowStart: 1,
            // rowEnd: 4000, // 3503
            // rowEnd: 3500, // 3467
            rowEnd: this.callSheet.totalRows, // 3467
            tabName: this.callSheet.tabName
          });

          // console.log(this.queue[3]);

          // Creater a key value pair with the value of the first column
          // also shift row index values from 0 in arrow based to 1 based in spreadsheet
          this.queue = this.queue.map((name, row) => {
            return [
              name[0],
              {
                name: name[0],
                row: row + 1
              }
            ];
          });

          debugger;
          this.header = await this.getHeader();
          // console.log(this.header);
          this.getNextRowIndex();
          // console.log("Next row is set to ", this.nextRow);
          resolve();
        });
      });
    });
  }

  getNextRowIndex() {
    let next = this.nextRow;
    let index = this.queue.slice(next).findIndex(item => {
      // console.log(item[0]);
      return typeof item[0] !== "string";
    });

    this.nextRow = next + index + 1;
    // console.log("index", nextRow);
    return next;
  }

  getKeyOrder(data) {
    return [this.header, Object.keys(data)];
  }

  getDataInInsertionOrder(data) {
    let result = [];

    this.header.forEach(colName => {
      result.push(data[colName]);
    });

    return result;
  }

  updateRow({
    data,
    rowNum,
    tabName = this.callSheet.tabName,
    rowStart = this.callSheet.rowStart,
    rowEnd = this.callSheet.rowEnd
  }) {
    return new Promise((resolve, reject) => {
      let range = `${tabName}!${rowStart}${rowNum}:${rowEnd}${rowNum}`;
      console.log(range, tabName, rowNum, rowStart);

      // console.log(this.getKeyOrder(data));
      let values = this.getDataInInsertionOrder(data);
      console.log(values);

      this.googleSheet.spreadsheets.values.update(
        // {
        //   spreadsheetId: SPREADSHEET_ID,
        //   range: `${tabName}!${rowStart}${rowNum}:${rowEnd}${rowNum}`,
        //   // majorDimension: "ROWS",
        //   values: values
        // }

        {
          spreadsheetId: SPREADSHEET_ID,
          range,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [values]
          }
        },
        (err, res) => {
          if (err) {
            console.log("The API returned an error: " + err);
            return reject(err);
          }

          // const rows = res.data.values;
          // resolve(rows.length === 1 ? rows[0] : rows);

          console.log(res);
          resolve();
        }
      );
    });
  }

  lockRow(rowNum) {
    return new Promise((resolve, reject) => {
      let range = `${this.callSheet.tabName}!${
        this.callSheet.rowStart
      }${rowNum}:${this.callSheet.rowStart}${rowNum}`;

      this.googleSheet.spreadsheets.values.update(
        {
          spreadsheetId: SPREADSHEET_ID,
          range,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [["DONT EDIT"]]
          }
        },
        (err, res) => {
          if (err) {
            console.log("The API returned an error: " + err);
            return reject(err);
          }
          console.log(res);
          resolve();
        }
      );
    });
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

  getRowForCalls(num) {
    return this.getRow({
      num,
      tabName: this.callSheet.tabName,
      start: this.callSheet.hostStart,
      end: this.callSheet.hostEnd
    });
  }

  // getRowForStudentHostCalls(num) {
  //   return this.getRow({
  //     num,
  //     tabName: SHEETS.STUDENT_HOST_CALLS.tabName,
  //     start: SHEETS.STUDENT_HOST_CALLS.hostStart,
  //     end: SHEETS.STUDENT_HOST_CALLS.hostEnd
  //   });
  // }

  // getRowForBilingualHostCalls(num) {
  //   return this.getRow({
  //     num,
  //     tabName: SHEETS.BILINGUAL_HOST_CALLS.tabName,
  //     start: SHEETS.BILINGUAL_HOST_CALLS.hostStart,
  //     end: SHEETS.BILINGUAL_HOST_CALLS.hostEnd
  //   });
  // }

  getStructuredData(header, row, num) {
    debugger;
    let sheet = this.callSheet;
    let result = {
      row: {},
      callerDetails: {},
      hostDetails: {},
      callDetails: {},
      studentDetails: {},
      sheet,
      rowNum: num
    };

    for (let i = 0; i < header.length; i++) {
      result.row[header[i]] = row[i];
    }

    let hostRowDetails = this.getHostDetails(row);
    let hostHeaderDetails = this.getHostDetails(header);

    for (let i = 0; i < hostHeaderDetails.length; i++) {
      result.hostDetails[hostHeaderDetails[i]] = hostRowDetails[i]
        ? hostRowDetails[i]
        : "";
    }

    let callRowDetails = this.getCallDetails(row);
    let callHeaderDetails = this.getCallDetails(header);
    for (let i = 0; i < callHeaderDetails.length; i++) {
      result.callDetails[callHeaderDetails[i]] = callRowDetails[i]
        ? callRowDetails[i]
        : "";
    }

    let studentRowDetails = this.getStudentDetails(row);
    let studentHeaderDetails = this.getStudentDetails(header);
    for (let i = 0; i < studentHeaderDetails.length; i++) {
      result.studentDetails[studentHeaderDetails[i]] = studentRowDetails[i]
        ? studentRowDetails[i]
        : "";
    }

    result.callerDetails = {
      [header[0]]: row[0],
      [header[1]]: row[1]
    };

    return result;
  }

  // getRowForHostCalls(num) {
  //   return this.getRow({
  //     num,
  //     tabName: SHEETS.HOST_CALLS.tabName,
  //     start: SHEETS.HOST_CALLS.rowStart,
  //     end: SHEETS.HOST_CALLS.rowEnd
  //   });
  // }

  getColumnFromString(num) {
    return spreadsheetColumn.fromStr(num) - 1;
  }

  getStudentDetails(row) {
    let sheet = this.callSheet;
    let start = this.getColumnFromString(sheet.studentStart);
    let end = this.getColumnFromString(sheet.studentEnd) + 1;
    // console.log(start, end);
    return row.slice(start, end);
  }

  getCallDetails(row) {
    let sheet = this.callSheet;
    let start = this.getColumnFromString(sheet.callStart);
    let end = this.getColumnFromString(sheet.callEnd) + 1;
    // console.log(start, end);
    return row.slice(start, end);
  }

  getHostDetails(row) {
    let sheet = this.callSheet;
    let start = this.getColumnFromString(sheet.hostStart);
    let end = this.getColumnFromString(sheet.hostEnd) + 1;
    // console.log(start, end);
    return row.slice(start, end);
  }

  getHeader() {
    let sheet = this.callSheet;
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

  async getStructuredRow(num) {
    let row = await this.getRow({ num });
    // console.log(row);
    let data = this.getStructuredData(this.header, row, num);
    // console.log(data);
    return data;
  }

  getRow({
    num,
    tabName = this.callSheet.tabName,
    start = this.callSheet.rowStart,
    end = this.callSheet.rowEnd
  }) {
    // console.log(num, tabName, start, end);
    return new Promise((resolve, reject) => {
      // console.log(`${tabName}!${start}${num}:${end}${num}`);
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
          let row = rows.length === 1 ? rows[0] : rows;
          let colLength = spreadsheetColumn.fromStr(end);
          // api won't return everything towards the end if it is empty, so we have to pad it sometimes
          while (row.length < colLength) {
            row.push("");
          }

          resolve(row);
        }
      );
    });
  }
}
module.exports = Spreadsheet;
