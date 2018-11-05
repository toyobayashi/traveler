const path = require('path')
const fs = require('fs-extra')
const { unzip } = require('zauz')
const { app } = require('electron')

function getPath (...relative) {
  return path.join(__dirname, ...relative)
}

function relaunch () {
  app.relaunch()
  app.exit()
}

function removeApp () {
  if (fs.existsSync(getPath('../app.asar'))) fs.removeSync(getPath('../app.asar'))
  if (fs.existsSync(getPath('../app.asar.unpacked'))) fs.removeSync(getPath('../app.asar.unpacked'))
}

async function main () {
  if (fs.existsSync(getPath('../app.zip'))) {
    removeApp()
    await unzip(getPath('../app.zip'), getPath('..'))
    fs.removeSync(getPath('../app.zip'))
  }
  fs.renameSync(getPath('.'), getPath('../updater'))
  relaunch()
}

main()
