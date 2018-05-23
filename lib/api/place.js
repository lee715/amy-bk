'use strict'
const db = require('limbo').use('anmoyi')

exports.batch = async ctx => {
  let places = await db.place.batch()
  ctx.body = places
}

exports.get = async ctx => {
  let _placeId = ctx.params._placeId
  let place = await db.place.findById(_placeId).exec()
  place = await place.format()
  ctx.body = place
}

exports.update = async ctx => {
  let rawBody = ctx.rawBody
  let _id = ctx.params._placeId
  let place = await db.place.update({
    _id
  }, rawBody, {
    new: true
  })
  ctx.body = place
}

exports.create = async ctx => {
  let rawBody = ctx.rawBody
  let place = await db.place.findOneAndUpdate({
    email: rawBody.email
  }, rawBody, {
    upsert: true,
    new: true
  })
  ctx.body = place
}

exports.remove = async ctx => {
  let _placeId = ctx.params._placeId
  await db.place.remove({_id: _placeId}).exec()
  ctx.body = {}
}
