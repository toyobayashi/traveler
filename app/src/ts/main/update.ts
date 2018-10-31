import * as request from 'request'
import { app } from 'electron'

export default function () {
  const headers = {
    'User-Agent': 'traveler'
  }
  const releases = {
    url: 'https://api.github.com/repos/toyobayashi/traveler/releases',
    json: true,
    headers
  }
  const tags = {
    url: 'https://api.github.com/repos/toyobayashi/traveler/tags',
    json: true,
    headers
  }
  return new Promise<{ version: string; commit: string; zipUrl: string; exeUrl: string } | null>((resolve, reject) => {
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
      const zip = latest.assets.filter((a: any) => ((a.content_type === 'application/x-zip-compressed' || a.content_type === 'application/zip') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]
      const exe = latest.assets.filter((a: any) => ((a.content_type === 'application/x-msdownload') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]

      const zipUrl = zip ? zip.browser_download_url : null
      const exeUrl = exe ? exe.browser_download_url : null

      request(tags, (err, _res, body) => {
        if (err) {
          reject(err)
          return
        }

        const latestTag = body.filter((tag: any) => tag.name === latest.tag_name)[0]
        const commit = latestTag.commit.sha
        const versionData = { version, commit, zipUrl, exeUrl }
        resolve(versionData)
      })
    })
  })
}
