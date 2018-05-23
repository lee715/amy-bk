
const _ = require('lodash')
const vfw = require('vfw')
const util = require('../service/util')

module.exports = (ruleObj) => {
  let checker = vfw.parse(ruleObj)
  return async (ctx, next) => {
    let checked = checker.check(ctx.rawBody, {withErrors: true})
    if (!checked[0]) ctx.throw(400, 'Invalid' + recognizeError(checked[1]))
    await next()
  }
}

function recognizeError (errs) {
  let path = errs[0].path
  let arr = path.split('.')
  let tar = arr.pop()
  while (tar) {
    if (!_.startsWith(tar, '$')) return util.capitalize(tar)
    tar = arr.pop()
  }
  return 'Param'
}
