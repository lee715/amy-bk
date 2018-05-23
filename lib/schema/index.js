
module.exports = (Schema) => {
  return {
    User: require('./user')(Schema),
    Device: require('./device')(Schema),
    Grad: require('./grad')(Schema),
    Place: require('./place')(Schema),
    Order: require('./order')(Schema),
    Statistic: require('./statistic')(Schema)
  }
}
