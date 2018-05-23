const crypto = require('crypto')

exports.genPass = (pass, salt) => {
  salt = salt || crypto.randomBytes(16).toString('base64')
  let hash = crypto.pbkdf2Sync(pass, salt, 200000, 64, 'sha256').toString('hex')
  return [salt, hash].join('$')
}

exports.comparePass = (pass, hash) => {
  let salt = hash.split('$')[0]
  let chash = exports.genPass(pass, salt)
  return chash === hash
}

exports.capitalize = function (str) {
  str = str
    .replace(/\W+/g, '')
    .replace(/[_\-.]{1}\w{1}/g, function (match) {
      return match.charAt(1).toUpperCase()
    })
  return str.charAt(0).toUpperCase() + str.slice(1)
}
