'use strict'

const config = require('config')
const Koa = require('koa')
const session = require('koa-session')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const rawMidd = require('./middleware/raw')

require('./service/vfw')

const app = new Koa()
app.keys = config.session.secrets

app
  .use(cors({
    credentials: true
  }))
  .use(bodyParser())
  .use(session(config.session, app))
  .use(rawMidd)

const start = async () => {
  await require('./service/mongo').isReady
  await require('./service/redis').isReady
  const router = require('./router')
  app
    // .use(authSrv.accessMid)
    .use(router.routes())
    .use(router.allowedMethods())
  app.listen(config.port, () => console.log(`listen port ${config.port}`))
}
start()
