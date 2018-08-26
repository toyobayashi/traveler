import { app, BrowserWindow } from 'electron'
import { format } from 'url'
import { join } from 'path'

let mainWindow: BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

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
