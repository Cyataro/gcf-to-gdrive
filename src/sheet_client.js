'use strict';

//let google = require('googleapis');
let authentication = require("./authentication");
//const Promise = require('promise');
const {google} = require('googleapis');
//const GoogleAuth = require('google-auth-library');
//const keys = require('./credentials.json');

// function addSheet(auth) {
//   var sheets = google.sheets('v4');
//   sheets.spreadsheets.create({
//     auth: auth,
//     resource: {
//         properties:{
//             title: "Anything-you-name"
//         }
//     }
//   }, (err, response) => {
//     if (err) {
//       console.log('The API returned an error: ' + err);
//       return;
//     } else {
//       console.log("Added");
//     }
//   });
// }
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
//    const client = this.buildAuthClient();
    console.log('builded auth client');
//    this.sheetsService = client.then((auth) => google.sheets({version: 'v4', auth}));
//    this.driveService = client.then((auth) => google.drive({version: 'v3', auth}));
    this.sheetsService = authentication.authenticate().then((auth) => google.sheets({version: 'v4', auth}));
    this.driveService = authentication.authenticate().then((auth) => google.drive({version: 'v3', auth}));
    this.filesToDelete = [];
  }
  /**
   * Builds the Google Auth Client
   * @return {Promise} A promise to return the auth client.
   */
  // buildAuthClient() {
  //   console.log('build auth client');
  //   const scopes = [
  //     'https://www.googleapis.com/auth/drive',
  //     'https://www.googleapis.com/auth/drive.file',
  //     'https://www.googleapis.com/auth/spreadsheets',
  //   ];
  //   return google.auth.getClient({
  //       scopes: scopes,
  //     });

    //   (new GoogleAuth()).getApplicationDefault((err, authClient) => {
    //     if (err) return reject(err);
    //     let scopes = [
    //       'https://www.googleapis.com/auth/drive',
    //       'https://www.googleapis.com/auth/drive.file',
    //       'https://www.googleapis.com/auth/spreadsheets',
    //     ];
    //     if (authClient.createScopedRequired &&
    //         authClient.createScopedRequired()) {
    //       authClient = authClient.createScoped(scopes);
    //     }
    //     resolve(authClient);
    //   });
    // });
//  }
  
  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  createSpreadsheet() {
    console.log('kitayo===');
  
    return new Promise((resolve, reject) => {
      const folderId = '14c9rk111dTSaerA7-WFl3TgNtWMNigcV'
      const body = {
        'mimeType': 'application/vnd.google-apps.spreadsheet',
        'name': 'TestSheet',
        parents: [ folderId ],
      }
      this.driveService.files.create({
        resource: body,
      }, (err, file) => {
        if(err) {
          console.log(err);
          reject(err);
        } else {
          console.log('File Id: ', file.id);
          resolve(file);
        }
      });
    });
    // return this.sheetsService.then((sheets) => {
    //   const createSheet = Promise.denodeify(sheets.spreadsheets.create)
    //      .bind(sheets.spreadsheets);
    //   return createSheet({
    //     resource: {
    //       properties: {
    //         title: 'TestSpreadsheet',
    //       },
    //     },
    //     fields: 'spreadsheetId',
    //   })
    //   .then((spreadsheet) => {
    //     console.log(spreadsheet);
    //     return spreadsheet.spreadsheetId;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // });
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
