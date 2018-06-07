const moment = require('moment')
const _ = require('lodash')

module.exports = function (Schema) {
  const Place = new Schema({
    name: String,
    province: String,
    city: String,
    district: String,
    company: String,
    email: String,
    bankName: String,
    bankAccount: String,
    // 客服人员id
    _salesmanId: Schema.Types.ObjectId,
    // 客服人员分成模式
    salesmanMode: {
      type: String,
      default: 'percent'
    },
    // 客服人员分成数额
    salesmanCount: {
      type: Number,
      default: 0
    },
    // 代理商id
    _agentId: Schema.Types.ObjectId,
    _gradId: Schema.Types.ObjectId,
    agentMode: {
      type: String,
      default: 'percent'
    },
    agentCount: {
      type: Number,
      default: 0
    },
    contacts: {
      type: Schema.Types.Mixed,
      default: []
    },
    password: String,
    created: {
      type: Date,
      default: Date.now
    }
  }, {
    toJSON: {
      virtuals: true,
      getters: true
    }
  })
  Place.virtual('location')
    .get(function () {
      return `${this.province}-${this.city}-${this.district}`
    })
  Place.statics.batch = async function () {
    let places = await this.find({}).exec()
    let rt = []
    for (let p of places) {
      rt.push(await p.format())
    }
    return rt
  }
  Place.methods.getStatistic = async function () {
    const StModel = this.model('Statistic')
    let st = await StModel.findByPlaceId(this._id, 'daily', moment().add(-1, 'month').toDate())
    if (st.length) {
      return _.sortBy(st, 'date').map((st) => st.format())
    }
    return []
  }
  Place.methods.getDevices = async function () {
    const Model = this.model('Device')
    let devices = await Model.getByPlaceId(this._id)
    return devices
  }
  Place.methods.getGrad = async function () {
    const GradModel = this.model('Grad')
    let grad = await GradModel.findById(this._gradId).exec()
    return grad
  }
  Place.methods.getAgent = async function () {
    const Model = this.model('User')
    let user = await Model.findById(this._agentId).exec()
    return user && user.toSafeJSON()
  }
  Place.methods.getSalesman = async function () {
    const Model = this.model('User')
    let user = await Model.findById(this._salesmanId).exec()
    return user && user.toSafeJSON()
  }
  Place.methods.format = async function () {
    let res = this.toJSON()
    res.st = await this.getStatistic()
    res.agent = await this.getAgent()
    res.salesman = await this.getSalesman()
    res.devices = await this.getDevices()
    let grad = await this.getGrad()
    if (grad) {
      res.times = grad.getTimes()
      res.prices = grad.getPrices()
    }
    return res
  }
  Place.methods.getFullInfo = async function () {
    const GradModel = this.model('Grad')
    let res = this.toJSON()
    let grad = await GradModel.findById(this._gradId).exec()
    res.times = grad.getTimes()
    res.prices = grad.getPrices()
    return res
  }
  return Place
}
