'use strict'

const _ = require('lodash')
const nodeValidator = require('validator')
const vfw = require('vfw')
require('vfw-tb')(vfw)

vfw.extend('type', {
  Email: function (str) {
    let isEmail = _.isString(str) && nodeValidator.isEmail(str, {allow_utf8_local_part: false})
    return !!isEmail
  }
})
