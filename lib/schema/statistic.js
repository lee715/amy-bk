const _ = require('lodash')
const moment = require('moment')

module.exports = function (Schema) {
  const Model = new Schema({
    type: String,
    count: {
      type: Number,
      'default': 0
    },
    date: String,
    openId: String,
    uid: String,
    _agentId: Schema.Types.ObjectId,
    _placeId: Schema.Types.ObjectId,
    extra: Schema.Types.Mixed,
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

  Model.methods.format = function () {
    let jn = this.toJSON()
    return _.pick(jn, ['type', 'count', 'date', 'openId', 'uid', '_agentId', '_placeId', 'extra'])
  }

  Model.statics.findByUid = function (uid, type, start, end) {
    let conds = {uid, type}
    if (start) {
      conds.date = conds.date || {}
      conds.date['$gte'] = moment(start).format('YYYY-MM-DD')
    }
    if (end) {
      conds.date = conds.date || {}
      conds.date['$lte'] = moment(end).format('YYYY-MM-DD')
    }
    return this.find(conds).exec()
  }

  Model.statics.findByPlaceId = function (_placeId, type, start, end) {
    let conds = {_placeId, type}
    if (start) {
      conds.date = conds.date || {}
      conds.date['$gte'] = moment(start).format('YYYY-MM-DD')
    }
    if (end) {
      conds.date = conds.date || {}
      conds.date['$lte'] = moment(end).format('YYYY-MM-DD')
    }
    return this.find(conds).exec()
  }

  return Model
}
