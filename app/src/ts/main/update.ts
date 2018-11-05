import * as request from 'request'
import { app } from 'electron'
import getPath from './path'
import * as fs from 'original-fs'

export function updateInit () {
  if (process.env.NODE_ENV === 'production') {
    if (fs.existsSync(getPath('../app.zip'))) {
      relaunch()
    }
  }
}

export function relaunch () {
  fs.renameSync(getPath('../updater'), getPath('../app'))
  app.relaunch()
  app.exit()
}

export function checkUpdate (githubRepo: string) {
  const headers = {
    'User-Agent': 'traveler'
  }
  const releases = {
    url: `https://api.github.com/repos/${githubRepo}/releases`,
    json: true,
    headers
  }
  const tags = {
    url: `https://api.github.com/repos/${githubRepo}/tags`,
    json: true,
    headers
  }
  return new Promise<{ version: string; commit: string; zipUrl: string | null; exeUrl: string | null; appZipUrl: string | null } | null>((resolve, reject) => {
    request(releases, (err, _res, body) => {
      if (err) {
        reject(err)
        return
      }

      if (!body.length) {
        resolve(null)
        return
      }

      const latest = body[0]
      const version = latest.tag_name.substr(1)
      if (app.getVersion() >= version) {
        resolve(null)
        return
      }
      // const description = marked(latest.body)
      const appZip = latest.assets.filter((a: any) => a.name === `app-${process.platform}.zip`)[0]
      const zip = latest.assets.filter((a: any) => ((a.content_type === 'application/x-zip-compressed' || a.content_type === 'application/zip') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]
      const exe = latest.assets.filter((a: any) => ((a.content_type === 'application/x-msdownload') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]

      const zipUrl = zip ? zip.browser_download_url : null
      const exeUrl = exe ? exe.browser_download_url : null
      const appZipUrl = appZip ? appZip.browser_download_url : null

      request(tags, (err, _res, body) => {
        if (err) {
          reject(err)
          return
        }

        const latestTag = body.filter((tag: any) => tag.name === latest.tag_name)[0]
        const commit = latestTag.commit.sha
        const versionData = { version, commit, zipUrl, exeUrl, appZipUrl }
        resolve(versionData)
      })
    })
  })
}
