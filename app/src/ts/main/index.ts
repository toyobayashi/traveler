import { app, BrowserWindow, BrowserWindowConstructorOptions, nativeImage, Menu } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { checkUpdate } from './update'
import createMenu from './menu'

let mainWindow: BrowserWindow | null

function createWindow () {
  const linuxIcon: string = require('../../../res/1024x1024.png')
  const browerWindowOptions: BrowserWindowConstructorOptions = {
    backgroundColor: '#E5E5E5',
    width: 996,
    height: 600,
    show: false,
    minWidth: 996,
    minHeight: 600
    // resizable: false,
    // minimizable: true,
    // maximizable: false
  }

  if (process.platform === 'linux') {
    browerWindowOptions.icon = nativeImage.createFromPath(join(__dirname, linuxIcon))
  } else {
    if (process.env.NODE_ENV !== 'production') {
      browerWindowOptions.icon = process.platform === 'win32' ? nativeImage.createFromPath(join(__dirname, '../res/traveler.ico')) : nativeImage.createFromPath(join(__dirname, '../res/traveler.icns'))
    }
  }
  mainWindow = new BrowserWindow(browerWindowOptions)

  mainWindow.on('ready-to-show', function () {
    if (!mainWindow) return
    mainWindow.show()
    mainWindow.focus()
    if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools()

    return checkUpdate(mainWindow, true)
  })

  if (process.env.NODE_ENV !== 'production') {
    const { devServerHost, devServerPort, publicPath } = require('../../../script/config.json')
    mainWindow.loadURL(`http://${devServerHost}:${devServerPort}${publicPath}`)
  } else {
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  Menu.setApplicationMenu(createMenu(mainWindow))
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
