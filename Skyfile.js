/* global sneaky */
sneaky('ay', function () {
  this.description = 'Deploy to dev environment'
  this.user = 'root'
  this.host = '47.96.158.74'
  this.path = '~/server/amy-bk/'
  this.filter = `
+ config**
+ lib**
+ yarn.lock
+ package.json
+ app.js
- *
`
  this.after('cd ~/server/amy-bk/source && yarn && pm2 restart api')
  this.overwrite = true
  this.nochdir = true
})
