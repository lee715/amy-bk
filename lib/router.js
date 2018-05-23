'use strict'

const Router = require('koa-router')
const router = new Router()
const vfwMw = require('./middleware/vfw')
const {accessMw, accessRootMw} = require('./service/auth')
const userApi = require('./api/user')
const gradApi = require('./api/grad')
const placeApi = require('./api/place')
const deviceApi = require('./api/device')
const staticApi = require('./api/statistic')
const orderApi = require('./api/order')

router.get('/api', async (ctx) => {
  ctx.body = 'hello'
})

router.get('/api/version', function (ctx) {
  ctx.body = {
    version: '0.0.1',
    name: 'Api Service'
  }
})

router.get('/api/logout', userApi.logout)

router.get('/api/users:me', accessMw, userApi.me)
router.get('/api/users:batch', accessRootMw, userApi.batchUsers)
router.get('/api/users/agent:batch', accessRootMw, userApi.batchAgents)
router.get('/api/users/salesman:batch', accessRootMw, userApi.batchSalesmans)

router.get('/api/grads', accessMw, gradApi.batch)
router.get('/api/grads/:_gradId', accessMw, gradApi.get)

const createGradVfw = vfwMw({
  price: 'String:required',
  name: 'String:required',
  time: 'String:required'
})
router.post('/api/grads', createGradVfw, accessMw, gradApi.create)
router.put('/api/grads', createGradVfw, accessMw, gradApi.create)
router.del('/api/grads/:_gradId', accessMw, gradApi.remove)

const loginVfwMw = vfwMw({
  email: 'Email:required',
  password: 'String:required'
})
router.post('/api/login', loginVfwMw, userApi.login)

const signupValidateMw = vfwMw({
  name: 'String:required',
  password: 'String:required',
  email: 'Email:required',
  role: 'String:required'
})
router.post('/api/users', signupValidateMw, userApi.signup)

const editUserValidateMw = vfwMw({
  name: 'String',
  password: 'String',
  email: 'Email',
  role: 'String'
})
router.put('/api/users/:_userId', editUserValidateMw, userApi.update)

router.get('/api/places', placeApi.batch)
router.get('/api/places/:_placeId', placeApi.get)
router.del('/api/places/:_placeId', placeApi.remove)
router.put('/api/places/:_placeId', placeApi.update)

const createPlaceVfw = vfwMw({
  name: 'String:required',
  password: 'String:required',
  email: 'Email:required'
})
router.post('/api/places', createPlaceVfw, placeApi.create)

router.post('/api/devices', deviceApi.create)
router.get('/api/places/:_placeId/devices', deviceApi.getByPlace)
router.del('/api/devices/:_deviceId', deviceApi.remove)

router.get('/api/places/:_placeId/statistic', staticApi.getPlaceData)

router.get('/api/orders:batch', orderApi.batch)

module.exports = router
