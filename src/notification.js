/**
 * notification
 */

'use strict';

const request = require('request');

/**
 * request post
 * @param {Hash} opt
 * @param {Integer} retryCount
 * @param {Integer} retryDelay //delayed before retry
 * @return {undefined}
 */
const postWebhook = (opt, retryCount = 3, retryDelay = 5000) => {
  new Promise((resolve, reject) => {
    request.post(opt, (error, response, body) => {
      if (error) return reject(error);
    })
  })
  .catch(err => {
    if (retryCount === 0) {
      postStackDriver(`failed Notification : ${err}`);
    } else {
      setTimeout(() => { postWebhook(opt, retryCount - 1); }, retryDelay);
    }
  });
}

/**
 * notification to google chat
 * @param {String} message
 * @param {Integer} retryCount
 * @return {undefined}
 */
const success = (message) => {
  postWebhook({
    url: global.process.env.GOOGLE_CHAT_WEBHOOK_URL,
    body: JSON.stringify({text: message})
  })
}

/**
 * notification to slack
 * @param {String} message
 * @param {Integer} retryCount
 * @return {undefined}
 */
const error = (message, retryCount = 3) => {
  postWebhook({
    url: global.process.env.SLACK_WEBHOOK_URL,
    headers: { 'Content-Type': 'application/json' },
    json: {
      username: 'test',
      icon_emoji: ':ghost:',
      text: message
  }})
}

/**
 * posted stack driver error report
 * @param {Object} e
 */
const postStackDriver = (e) => {
  if(e instanceof Error) {
    console.error(e);
  } else {
    console.error(new Error(e));
  }
}

exports.success = success;
exports.error = error;
exports.postStackDriver = postStackDriver;

