
module.exports = async (ctx, next) => {
  let method = ctx.method.toLowerCase()
  if (['get', 'delete'].includes(method)) {
    ctx.rawBody = ctx.query
  } else {
    ctx.rawBody = ctx.request.body
  }
  await next()
}
