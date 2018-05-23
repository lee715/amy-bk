'use strict'
const db = require('limbo').use('anmoyi')

exports.batch = async ctx => {
  let orders = await db.order.getByPage(ctx.query)
  let rt = {
    result: orders
  }
  if (orders.length < (ctx.query.count || 100)) {
    rt.token = null
  } else {
    rt.token = orders[orders.length - 1]._id
  }
  ctx.body = rt
}
