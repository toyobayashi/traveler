const path = require('path')
const fs = require('fs-extra')
const { unzip } = require('zauz')
const { spawn } = require('child_process')
const [dirname, processArgv0] = process.argv.slice(2)

function removeApp () {
  const TIME = 100
  const remove = () => {
    if (fs.existsSync(path.join(dirname, 'app'))) fs.removeSync(path.join(dirname, 'app'))
    if (fs.existsSync(path.join(dirname, 'app.asar'))) fs.removeSync(path.join(dirname, 'app.asar'))
    if (fs.existsSync(path.join(dirname, 'app.asar.unpacked'))) fs.removeSync(path.join(dirname, 'app.asar.unpacked'))
  }

  return new Promise(resolve => {
    function callback () {
      try {
        remove()
        resolve()
      } catch (err) {
        setTimeout(callback, TIME)
      }
    }
    setTimeout(callback, TIME)
  })
}

async function main () {
  if (!dirname || !processArgv0) process.exit(0)
  if (fs.existsSync(path.join(dirname, 'app.zip'))) {
    await removeApp()
    await unzip(path.join(dirname, 'app.zip'), dirname)
    fs.removeSync(path.join(dirname, 'app.zip'))
    spawn(processArgv0, [], { detached: process.platform === 'win32', stdio: 'ignore' }).unref()
  }
}

main()
