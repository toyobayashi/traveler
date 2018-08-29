import { app, BrowserWindow, BrowserWindowConstructorOptions, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'

let mainWindow: BrowserWindow | null

function createWindow () {
  const linuxIcon: string = require('../../res/512x512.png')
  const browerWindowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    backgroundColor: '#E5E5E5'
  }

  if (process.platform === 'linux') {
    browerWindowOptions.icon = nativeImage.createFromPath(join(__dirname, linuxIcon))
  } else {
    if (process.env.NODE_ENV !== 'production') {
      browerWindowOptions.icon = process.platform === 'win32' ? nativeImage.createFromPath(join(__dirname, '../res/traveler.ico')) : nativeImage.createFromPath(join(__dirname, '../res/traveler.icns'))
    }
  }
  mainWindow = new BrowserWindow(browerWindowOptions)

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.loadURL('http://localhost:7080/')
    mainWindow.webContents.openDevTools()
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