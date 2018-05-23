'use strict'

module.exports = (Schema) => {
  let User = new Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    // root, agent, salesman
    role: String,
    // agent only
    company: String,
    contact: {
      type: Schema.Types.Mixed,
      default: []
    },
    bankName: String,
    bankAccount: String,
    license: String
  }, {
    toJSON: {
      virtuals: true,
      getters: true
    }
  })

  User.methods.toSafeJSON = function () {
    let data = this.toJSON()
    delete data.password
    return data
  }

  User.statics.findByEmail = function (email) {
    return this.findOne({email: email}).exec()
  }

  User.statics.batchAll = function () {
    return this.find({}).exec()
  }

  User.statics.batchAgents = function () {
    return this.find({role: 'agent'}).exec()
  }

  User.statics.batchSalesmans = function () {
    return this.find({role: 'salesman'}).exec()
  }

  User.statics.putByUserId = function (_id, data) {
    return this.update({_id}, data).exec()
  }
  return User
}
