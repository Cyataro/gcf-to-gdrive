/**
 * lib 
 */

'use strict';

const _ = require('lodash');

/**
 * @param {String} str
 * @return {String}
 */
const toLowerCamelCase = (str) => str.replace(/(_)(.)/g, (s) => s.charAt(1).toUpperCase());
/**
 * @param {String} time
 * @return {String}
 */
const timeZone = (time) => (typeof time !== 'undefined' && time !== '') ? `${time}+09:00` : "";
/**
 * 20xx-xx-xxT00:00:00
 * @param {String} date
 * @param {String} time
 * @return {String}
 */
const formatDateTime   = (date,time) => [date, time].filter((v) => { return v !== ""}).join(' ');
/**
 * @param {Object} contents
 * @return {Object} or undefined
 */
const isContentsExist  = (contents) => typeof contents !== 'undefined' ? contents : undefined;
/**
 * [[a,c],[b,d]] => [[a,b],[c,d]]
 * @param {Array} a
 * @return {Array}
 */
const nestedArrayTranspose = (a) => a[0].map((_, c) => a.map(r => r[c]));
/**
 * [1,2,3,4]-[3,5] => [1,2,4]
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
const subArray = (a,b) => _.difference(a, b);

exports.toLowerCamelCase     = toLowerCamelCase;
exports.timeZone             = timeZone;
exports.formatDateTime       = formatDateTime;
exports.isContentsExist      = isContentsExist;
exports.nestedArrayTranspose = nestedArrayTranspose;
exports.subArray             = subArray;
