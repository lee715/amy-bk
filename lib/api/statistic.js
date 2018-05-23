'use strict'
const moment = require('moment')
const db = require('limbo').use('anmoyi')

exports.getPlaceData = async ctx => {
  let _placeId = ctx.params._placeId
  let startDate = ctx.query.startDate
  let endDate = ctx.query.endDate
  let start = startDate ? moment(startDate).format('YYYY-MM-DD')
    : moment().startOf('day').add(-30, 'day').format('YYYY-MM-DD')
  let end = endDate ? moment(endDate).format('YYYY-MM-DD')
    : moment().format('YYYY-MM-DD')
  let dailys = await db.statistic.find({
    date: {
      $gte: start,
      $lte: end
    },
    _placeId,
    type: 'daily'
  }).exec()
  start = startDate ? moment(startDate).format('YYYY-MM')
    : moment().add(-6, 'month').format('YYYY-MM-DD')
  end = endDate ? moment(endDate).format('YYYY-MM-DD')
    : moment().format('YYYY-MM-DD')
  let months = await db.statistic.find({
    date: {
      $gte: start,
      $lte: end
    },
    _placeId,
    type: 'month'
  })
  let recons = await db.statistic.find({
    date: {
      $gte: start,
      $lte: end
    },
    _placeId,
    type: 'reconciliation'
  })
  ctx.body = {
    daily: dailys,
    month: months,
    reconciliation: recons.map((rc) => {
      rc = rc.toJSON()
      rc.extra.total = rc.total
      rc.extra.date = rc.date
      return rc.extra
    })
  }
}
