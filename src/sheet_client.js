'use strict';

let google = require('googleapis');
let authentication = require("./authentication");
const Promise = require('promise');
const googleapis = require('googleapis');
const GoogleAuth = require('google-auth-library');

function addSheet(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.create({
    auth: auth,
    resource: {
        properties:{
            title: "Anything-you-name"
        }
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
      console.log("Added");
    }
  });
}
/*
authentication.authenticate().then((auth)=>{
    addSheet(auth);
});
*/
class GoogleSheet {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const client = this.buildAuthClient();
    console.log('builded auth client');
    this.sheetsService = client.then((auth) => googleapis.sheets({version: 'v4', auth}));
    this.driveService = client.then((auth) => googleapis.drive({version: 'v3', auth}));
    this.filesToDelete = [];
  }
  /**
   * Builds the Google Auth Client
   * @return {Promise} A promise to return the auth client.
   */
  buildAuthClient() {
    console.log('build auth client');
    return new Promise((resolve, reject) => {
      (new GoogleAuth()).getApplicationDefault((err, authClient) => {
        if (err) return reject(err);
        let scopes = [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets',
        ];
        if (authClient.createScopedRequired &&
            authClient.createScopedRequired()) {
          authClient = authClient.createScoped(scopes);
        }
        resolve(authClient);
      });
    });
  }
  
  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  createSpreadsheet() {
    console.log('kitayo===');
    return this.sheetsService.then((sheets) => {
      const createSheet = Promise.denodeify(sheets.spreadsheets.create)
         .bind(sheets.spreadsheets);
      return createSheet({
        resource: {
          properties: {
            title: 'Test Spreadsheet',
          },
        },
        fields: 'spreadsheetId',
      })
      .then((spreadsheet) => {
        console.log(spreadsheet);
        return spreadsheet.spreadsheetId;
      })
      .catch(err => {
        console.log(err);
      });
    });
  }
}

module.exports = new GoogleSheet();
/*
function appendData(auth, sheetId) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:B', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ ["Void", "Canvas", "Website"], ["Paul", "Shan", "Human"] ]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}
/*
authentication.authenticate().then((auth)=>{
    appendData(auth);
});
*/
