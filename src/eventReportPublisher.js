'use strict';

const sheet = require('./sheet_client');

class EventReportPublisher {
  constructor (report) {
    this.report = report
  }
  publish () {
    console.log(this.report);
    //const hoge = new sheet();
    const hoge = sheet.createSpreadsheet();
    console.log(hoge);
  }
}

module.exports = EventReportPublisher;
