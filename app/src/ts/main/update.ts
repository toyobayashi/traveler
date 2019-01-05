import { BrowserWindow, app, shell, dialog, MessageBoxOptions } from 'electron'
import * as Updater from 'electron-github-asar-updater'

const updater = new Updater('toyobayashi/traveler')

export function msgbox (win: BrowserWindow, options: MessageBoxOptions) {
  return new Promise<number>(resolve => {
    dialog.showMessageBox(win, options, res => resolve(res))
  })
}

export async function checkUpdate (win: BrowserWindow, quiet?: true) {
  if (!quiet) win.webContents.send('status', '正在检查更新')

  try {
    await updater.check()
  } catch (err) {
    if (!quiet) win.webContents.send('status', '已就绪')
    await msgbox(win, { type: 'error', title: app.getName(), message: '检查更新失败。\n' + err, noLink: true, defaultId: 0, buttons: ['确定'] })
    return
  }

  if (!quiet) win.webContents.send('status', '已就绪')
  const info = updater.getUpdateInfo()
  if (!info) {
    if (!quiet) await msgbox(win, { type: 'info', title: app.getName(), message: '当前没有可用的更新。', noLink: true, defaultId: 0, buttons: ['确定'] })
    return
  }

  const buttons = ['更新', '取消']
  const response = await msgbox(win, {
    type: 'info',
    title: app.getName(),
    message: '有可用的更新',
    detail: `\n当前版本: ${app.getVersion()}\n最新版本: ${info.version}-${info.commit}`,
    buttons,
    defaultId: 0,
    noLink: true
  })

  if (buttons[response] !== '更新') return

  if (/* info.appZipUrl &&  */process.env.NODE_ENV === 'production') {
    if (updater.isReadyToDownload()) {
      try {
        const downloadResult = await updater.download((status: any) => {
          win.webContents.send('status', '更新中：' + Math.floor(status.loading) + '%')
        })

        if (!downloadResult) {
          win.webContents.send('status', '更新失败')
          await msgbox(win, { type: 'error', title: app.getName(), message: '更新失败。', noLink: true, defaultId: 0, buttons: ['确定'] })
          return
        }
      } catch (err) {
        win.webContents.send('status', '更新失败')
        await msgbox(win, { type: 'error', title: app.getName(), message: '更新失败。' + err, noLink: true, defaultId: 0, buttons: ['确定'] })
        return
      }

      win.webContents.send('status', '更新完成')
      const buttons = ['重新启动', '稍后重启']
      const response = await msgbox(win, {
        type: 'info',
        title: app.getName(),
        message: '更新完成',
        buttons,
        defaultId: 0,
        noLink: true
      })

      if (buttons[response] === '重新启动') {
        updater.relaunch()
      }
    }
  } else if (info.exeUrl) {
    shell.openExternal(info.exeUrl)
  } else if (info.zipUrl) {
    shell.openExternal(info.zipUrl)
  } else {
    shell.openExternal('https://github.com/toyobayashi/traveler/releases')
  }
}
