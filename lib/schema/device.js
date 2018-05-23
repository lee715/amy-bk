const _ = require('lodash')
const moment = require('moment')
const sockSrv = require('../service/socket')
const redis = require('../service/redis')

module.exports = function (Schema) {
  let deviceSchema
  deviceSchema = new Schema({
    uid: String,
    name: String,
    _placeId: Schema.Types.ObjectId,
    disabled: {
      type: Boolean,
      'default': false
    },
    type: {
      type: String,
      'default': 'normal'
    },
    created: {
      type: Date,
      'default': Date.now
    }
  }, {
    toJSON: {
      virtuals: true,
      getters: true
    }
  })
  deviceSchema.methods.isReady = async function () {
    if (await this.getStatus() !== 'idle') return false
    await sockSrv.check(this.uid)
    return true
  }
  deviceSchema.methods.getStatus = function () {
    return redis.get(`devices:status:${this.uid}`)
  }
  // 时延
  deviceSchema.methods.getMs = function () {
    return redis.get(`devices:ms:${this.uid}`)
  }
  deviceSchema.methods.getStatistic = async function () {
    const StModel = this.model('Statistic')
    let st = await StModel.findByUid(this.uid, 'daily', moment().add(-1, 'month').toDate())
    if (st.length) {
      return _.sortBy(st, 'date').map((st) => st.format())
    }
    return []
  }
  deviceSchema.methods.format = async function () {
    let res = this.toJSON()
    res.status = await this.getStatus() || 'fault'
    res.ms = await this.getMs() || 9999
    res.st = await this.getStatistic()
    return res
  }
  deviceSchema.methods.getPayInfo = async function () {
    const PlaceModel = this.model('Place')
    if (!this._placeId) return null
    let res = await this.format()
    let place = await PlaceModel.findById(this._placeId).exec()
    res.placeName = place.name
    let placeFullInfo = await place.getFullInfo()
    res.times = placeFullInfo.times
    res.prices = placeFullInfo.prices
    return res
  }

  deviceSchema.statics.getByPlaceId = async function (_placeId) {
    let devices = await this.find({_placeId}).exec()
    let rs = []
    for (let de of devices) {
      rs.push(await de.format())
    }
    return rs
  }

  deviceSchema.statics.findByUid = function (uid) {
    return this.findOne({uid: uid}).exec()
  }

  deviceSchema.statics.findByPlaceId = function (_placeId) {
    return this.find({_placeId}).exec()
  }

  deviceSchema.statics.findByPage = function (_preId, count) {
    count = count || 100
    let query = _preId ? {_id: {$gt: _preId}} : {}
    return this.find(query).sort({_id: 1}).limit(count).exec()
  }
  return deviceSchema
}
