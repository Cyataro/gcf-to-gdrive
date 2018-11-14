'use strict';

const sheet = require('./sheet_client');

class EventReportPublisher {
  constructor (report) {
    this.report = report
  }
  publish () {
    console.log(this.report);
    //const hoge = new sheet();
    sheet.createSpreadsheet()
    .then(file => {
      console.log(`dekitayo:${file.id}`);
    })
    .catch(err => {
      console.log(`shippaidayo:${err}`);
    });
  }
}

module.exports = EventReportPublisher;
