import { app, BrowserWindow, BrowserWindowConstructorOptions, nativeImage, Menu, shell } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { updateInit, checkUpdate, relaunch } from './update'
import createMenu, { msgbox } from './menu'
import download from './download'
import getPath from './path'

updateInit()

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

  mainWindow.on('ready-to-show', async function () {
    if (!mainWindow) return
    mainWindow.show()
    mainWindow.focus()
    if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools()

    const versionData = await checkUpdate('toyobayashi/traveler')
    if (versionData) {
      const buttons = ['更新', '取消']
      const response = await msgbox(mainWindow, {
        type: 'info',
        title: app.getName(),
        message: '有可用的更新',
        detail: `\n当前版本: ${app.getVersion()}\n最新版本: ${versionData.version}-${versionData.commit}`,
        buttons,
        defaultId: 0,
        noLink: true
      })

      if (buttons[response] !== '更新') return

      if (versionData.appZipUrl && process.env.NODE_ENV === 'production') {
        let p: string = ''
        try {
          p = await download(versionData.appZipUrl, getPath('../app.zip'), (status) => {
            if (mainWindow) mainWindow.webContents.send('status', '更新中：' + Math.floor(status.loading) + '%')
          })
        } catch (err) {
          mainWindow.webContents.send('status', '更新失败')
          msgbox(mainWindow, { type: 'info', title: app.getName(), message: '更新失败。' + err, noLink: true, defaultId: 0, buttons: ['确定'] })
          return
        }

        if (p) {
          mainWindow.webContents.send('status', '更新完成')
          const buttons = ['重新启动', '稍后重启']
          const response = await msgbox(mainWindow, {
            type: 'info',
            title: app.getName(),
            message: '更新完成',
            buttons,
            defaultId: 0,
            noLink: true
          })

          if (buttons[response] === '重新启动') {
            relaunch()
          }
        }
      } else if (versionData.exeUrl) {
        shell.openExternal(versionData.exeUrl)
      } else if (versionData.zipUrl) {
        shell.openExternal(versionData.zipUrl)
      } else {
        shell.openExternal('https://github.com/toyobayashi/traveler/releases')
      }
    }

  })

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.loadURL('http://localhost:7080')
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
