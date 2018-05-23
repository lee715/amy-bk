'use struct'
const db = require('limbo').use('anmoyi')

exports.get = async ctx => {
  let uid = ctx.rawBody.uid

  let device = await db.device.findByUid(uid)
  if (!device) ctx.throw(404, 'DeviceNotFound')

  ctx.body = await device.format()
}

exports.create = async ctx => {
  let {_placeId, uid, name} = ctx.rawBody

  let device = await db.device.findByUid(uid)
  if (device) ctx.throw(400, 'DeviceExist')

  device = await db.device.findOneAndUpdate({
    uid: uid
  }, {_placeId, uid, name}, {
    upsert: true,
    new: true
  })
  ctx.body = device
}

exports.getByPlace = async ctx => {
  let _placeId = ctx.params._placeId
  let devices = await db.device.getByPlaceId(_placeId)
  ctx.body = devices
}

exports.remove = async ctx => {
  let _deviceId = ctx.params._deviceId
  await db.device.remove({_id: _deviceId}).exec()
  ctx.body = {}
}
