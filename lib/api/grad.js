'use strict'
const db = require('limbo').use('anmoyi')

exports.batch = async ctx => {
  let grads = await db.grad.getAll()
  ctx.body = grads
}

exports.get = async ctx => {
  let _gradId = ctx.params._gradId
  let grad = await db.grad.findById(_gradId).exec()
  ctx.body = grad
}

exports.create = async ctx => {
  let rawBody = ctx.rawBody
  let grad = await db.grad.findOneAndUpdate({
    name: rawBody.name
  }, rawBody, {
    upsert: true,
    new: true
  })
  ctx.body = grad
}

exports.remove = async ctx => {
  let _gradId = ctx.params._gradId
  await db.grad.remove({_id: _gradId}).exec()
  ctx.body = {}
}
