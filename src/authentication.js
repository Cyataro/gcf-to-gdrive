'use strict';

const fs = require('fs');
const readline = require('readline');
//const {googleAuth} = require('google-auth-library');
const {OAuth2Client} = require('google-auth-library');
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];
const TOKEN_DIR = './'; //the directory where we're going to save the token
const TOKEN_PATH = TOKEN_DIR + 'token.json'; //the file which will contain the token

class Authentication {
  authenticate(){
    return new Promise((resolve, reject)=>{
      const credentials = JSON.parse(this.getClientSecret());
      let authorizePromise = this.authorize(credentials);
      authorizePromise.then(resolve, reject).catch(err => console.log(err));
    });
  }
  getClientSecret(){
    return fs.readFileSync('./credentials.json','utf8');
  }
  authorize(credentials) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
//    var auth = new googleAuth();
    var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    return new Promise((resolve, reject)=>{
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          this.getNewToken(oauth2Client).then((oauth2ClientNew) => {
            return resolve(oauth2ClientNew);
          }, (err)=>{
            reject(err);
          })
          .catch(err => {
            console.log(err);
          });
        } else {
          oauth2Client.credentials = JSON.parse(token);
          resolve(oauth2Client);
        }
      });
    });
  }
  getNewToken(oauth2Client, callback) {
    return new Promise((resolve, reject)=>{
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: \n ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\n\nEnter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            reject(err);
          }
          console.log('get new token!!')
          oauth2Client.credentials = token;
          this.storeToken(token);
          resolve(oauth2Client);
        });
      });
    });
  }
  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }
}

module.exports = new Authentication();
