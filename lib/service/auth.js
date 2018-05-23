'use strict'

exports.accessMw = async (ctx, next) => {
  let _userId = ctx.session.id
  if (!_userId) ctx.throw(401)
  await next()
}

exports.accessRootMw = async (ctx, next) => {
  console.log(ctx.session)
  if (ctx.session.role !== 'root') ctx.throw(403)
  await next()
}
