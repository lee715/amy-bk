'use strict'
const util = require('../service/util')
const db = require('limbo').use('anmoyi')

exports.me = async (ctx, next) => {
  let user = ctx.session
  ctx.body = user
}

exports.signup = async ctx => {
  let data = ctx.rawBody
  let user = await db.user.findByEmail(data.email)
  if (user) ctx.throw(400, 'UserExist')

  data.password = util.genPass(data.password)
  user = await db.user.findOneAndUpdate({
    email: data.email
  }, data, {
    upsert: true,
    new: true
  }).exec()
  ctx.body = user.toSafeJSON()
}

exports.login = async ctx => {
  let {email, password} = ctx.rawBody
  let user = await db.user.findByEmail(email)
  if (!user) ctx.throw(400, 'UserNotExist')

  if (!util.comparePass(password, user.password)) ctx.throw(400, 'PassNotMatch')
  ctx.session = user.toSafeJSON()
  ctx.body = {}
}

exports.logout = async ctx => {
  ctx.session = null
  ctx.redirect('/#/login')
}

exports.batchUsers = async ctx => {
  let users = await db.user.batchAll()
  ctx.body = users.map(user => user.toSafeJSON())
}

exports.batchAgents = async ctx => {
  let agents = await db.user.batchAgents()
  ctx.body = agents.map(user => user.toSafeJSON())
}

exports.batchSalesmans = async ctx => {
  let agents = await db.user.batchSalesmans()
  ctx.body = agents.map(user => user.toSafeJSON())
}

exports.update = async ctx => {
  let _userId = ctx.params._userId
  await db.user.putByUserId(_userId, ctx.rawBody)
  ctx.body = {}
}
