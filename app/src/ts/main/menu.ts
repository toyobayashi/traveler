import { app, Menu, MenuItemConstructorOptions, dialog, MessageBoxOptions, clipboard, BrowserWindow, shell } from 'electron'
import { checkUpdate, relaunch } from './update'
import { execSync } from 'child_process'
import download from './download'
import getPath from './path'

declare function __non_webpack_require__ (module: string): any

let commit = ''
let commitDate = ''
if (process.env.NODE_ENV !== 'production') {
  commit = execSync('git rev-parse HEAD', { cwd: require('path').join(__dirname, '..') }).toString().replace(/[\r\n]/g, '')
  commitDate = new Date((execSync('git log -1', { cwd: require('path').join(__dirname, '..') }).toString().match(/Date:\s*(.*?)\n/) as any)[1]).toISOString()
}

export function msgbox (win: BrowserWindow, options: MessageBoxOptions) {
  return new Promise<number>(resolve => {
    dialog.showMessageBox(win, options, res => resolve(res))
  })
}

export default function createMenu (win: BrowserWindow): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      label: '帮助',
      submenu: [
        {
          label: '设置',
          click () {
            if (win) win.webContents.send('setting')
          }
        },
        {
          type: 'separator'
        },
        {
          label: '切换开发人员工具',
          click () {
            win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
          }
        },
        {
          label: '检查更新...',
          async click () {
            win.webContents.send('status', '正在检查更新')
            let versionData: {
              version: string;
              commit: string;
              zipUrl: string | null;
              exeUrl: string | null;
              appZipUrl: string | null;
            } | null = null
            try {
              versionData = await checkUpdate('toyobayashi/traveler')
            } catch (err) {
              win.webContents.send('status', '已就绪')
              msgbox(win, { type: 'error', title: app.getName(), message: '检查更新失败。\n' + err, noLink: true, defaultId: 0, buttons: ['确定'] })
              return
            }

            win.webContents.send('status', '已就绪')
            if (!versionData) {
              msgbox(win, { type: 'info', title: app.getName(), message: '当前没有可用的更新。', noLink: true, defaultId: 0, buttons: ['确定'] })
              return
            }
            const buttons = ['更新', '取消']
            const response = await msgbox(win, {
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
                  win.webContents.send('status', '更新中：' + Math.floor(status.loading) + '%')
                })
              } catch (err) {
                win.webContents.send('status', '更新失败')
                msgbox(win, { type: 'info', title: app.getName(), message: '更新失败。' + err, noLink: true, defaultId: 0, buttons: ['确定'] })
                return
              }

              if (p) {
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
        },
        {
          label: '关于',
          async click () {
            const detail = '\n' + Array.prototype.join.call([
              `版本: ${app.getVersion()}`,
              process.env.NODE_ENV === 'production' ? `提交: ${__non_webpack_require__('../package.json')._commit}` : `提交: ${commit}`,
              process.env.NODE_ENV === 'production' ? `日期: ${__non_webpack_require__('../package.json')._commitDate}` : `日期: ${commitDate}`,
              `Electron: ${process.versions.electron}`,
              `Chrome: ${process.versions.chrome}`,
              `Node.js: ${process.versions.node}`,
              `V8: ${process.versions.v8}`,
              `架构: ${process.arch}`
            ], '\n')
            const buttons = ['确定', '复制']

            const response = await msgbox(win, {
              type: 'info',
              title: app.getName(),
              message: app.getName(),
              buttons,
              noLink: true,
              defaultId: 0,
              detail
            })
            if (buttons[response] === '复制') {
              clipboard.writeText(detail)
            }
          }
        },
        {
          label: 'Github',
          click () {
            shell.openExternal('https://github.com/toyobayashi/traveler')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName()
    })
  }

  return Menu.buildFromTemplate(template)
}
