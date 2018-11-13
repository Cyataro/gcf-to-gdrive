/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */

'use strict';

const cloudStorage    = require('@google-cloud/storage');
const notification    = require('./notification');
const EventReportPublisher = require('./eventReportPublisher');


/**
 * download storage file
 * @param {string} bucket
 * @param {string} file
 * @return {Object}
 */
const storageFile = (bucket, file) => {
  const storage = new cloudStorage({keyfile: 'gcloud-service-key.json'});

  return storage.bucket(bucket).file(file);
}


/**
 * @param {String} msg
 * @param {Object} e
 */
const log_error = (msg, e) => {
  if (global.process.env.GCF_ENV === 'production') {
    notification.error(`${msg} ${JSON.stringify(e)}`);
  }
  notification.postStackDriver(e);
}

/**
 * @param {String} bucket
 * @param {String} file
 */
const upload = (bucket, file) => {
  storageFile(bucket, file).download()
  .then(file => {
    const contents = JSON.parse(file)
    //GoogleDriveのフォルダへアップ
    new EventReportPublisher(contents).publish();
    return contents;
  })
  .then(rsp => {
    //通知の組み立て処理
    notification.success(`xxx`);
    return true;
  })
  .catch(err => {
    log_error('ERROR :', err);
    return false;
  });
}

/**
 * storage finalize
 * @param {string} event
 * @param {string} callback
 * @return {Object}
 */
exports.eventInputReminder = (event, callback) => {
  const file = event.data;
  console.log('functions start!!');
  if (typeof global.process.env.KINTONE_IS_DOWN !== 'undefined') {
    console.log(`kintone breaker is down!!!`);
    callback();
  } else if (file.resourceState === 'not_exists') {
    console.log('File ' + file.name + ' not_exists.');
    callback();
  } else {
    if (file.metageneration === '1') {

      console.log(`bucket: ${file.bucket}`);
      console.log(`file: ${file.name}`);

      upload(file.bucket, file.name);
      callback();
    } else {
      callback();
    }
  }
}
