module.exports = function (Schema) {
  const Order = new Schema({
    money: Number,
    time: Number,
    status: {
      type: String,
      default: 'PREPAY'
    },
    mode: {
      type: String,
      default: 'WX'
    },
    openId: String,
    uid: String,
    _agentId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _placeId: {
      type: Schema.Types.ObjectId,
      ref: 'Place'
    },
    serviceStatus: {
      type: String,
      default: 'BEFORE'
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }, {
    toJSON: {
      virtuals: true,
      getters: true
    }
  })

  Order.statics.init = function (data) {
    return this.create(data)
  }

  Order.statics.getByPage = async function ({token, count, startTime, endTime}) {
    let conds = {}
    if (token) {
      conds['_id'] = {$lt: token}
    }
    if (startTime && endTime) {
      conds['created'] = {
        $gt: startTime,
        $lt: endTime
      }
    }
    let orders = await this.find(conds)
      .sort({_id: -1})
      .limit(count ? Number(count) : 1000)
      .populate({
        path: '_placeId _agentId',
        select: 'name'
      })
      .exec()
    orders = orders.map((order) => {
      let data = order.toJSON()
      data.place = data._placeId
      data._placeId = data.place && data.place.id
      data.agent = data._agentId
      data._agentId = data.agent && data.agent.id
      return data
    })
    return orders
  }

  Order.methods.format = async function () {

  }

  Order.methods.switchPayStatus = function (status) {
    switch (status) {
      case 1:
        return this.update({status: 'SUCCESS'}).exec()
      case 0:
        return this.update({status: 'PREPAY'}).exec()
    }
  }

  Order.methods.switchDeviceStatus = function (status) {
    switch (status) {
      case 1:
        return this.update({serviceStatus: 'STARTED'}).exec()
      case 0:
        return this.update({serviceStatus: 'BEFORE'}).exec()
    }
  }

  Order.methods.isPayed = function () {
    return this.status === 'SUCCESS'
  }

  return Order
}
