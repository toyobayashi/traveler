import * as request from 'request'
import * as fs from 'original-fs'
import * as fse from 'fs-extra'
import * as path from 'path'

export default function download (u: string, p: string, onData?: (status: { name: string; current: number; max: number; loading: number }) => void) {
  let req: request.Request
  return new Promise<string>((resolve, reject) => {
    fse.mkdirsSync(path.dirname(p))
    if (fs.existsSync(p)) return resolve(p)

    const headers: { [x: string]: string } = {
      'User-Agent': 'traveler'
    }
    let fileLength = 0
    if (fs.existsSync(p + '.tmp')) {
      fileLength = fs.statSync(p + '.tmp').size
      if (fileLength > 0) {
        headers.Range = 'bytes=' + fileLength + '-'
      }
    }

    let rename = true
    let size = 0
    req = request.get({
      url: u,
      headers: headers,
      encoding: null
    })
    req.on('response', (res) => {
      const contentLength = Number(res.headers['content-length'])
      let start = new Date().getTime()
      req.on('data', (chunk) => {
        size += chunk.length
        if (typeof onData === 'function') {
          if (fileLength + size === fileLength + contentLength) {
            onData({
              name: path.parse(p).base,
              current: fileLength + size,
              max: fileLength + contentLength,
              loading: 100 * (fileLength + size) / (fileLength + contentLength)
            })
          } else {
            const now = new Date().getTime()
            if (now - start > 16) {
              start = now
              onData({
                name: path.parse(p).base,
                current: fileLength + size,
                max: fileLength + contentLength,
                loading: 100 * (fileLength + size) / (fileLength + contentLength)
              })
            }
          }
        }
      })
    })
    req.on('abort', () => {
      rename = false
      resolve('')
    })
    req.on('error', err => {
      rename = false
      reject(err)
    })
    req.pipe(fs.createWriteStream(p + '.tmp', { flags: 'a+' }).on('close', () => {
      if (rename) {
        fs.renameSync(p + '.tmp', p)
        resolve(p)
      }
    }).on('error', (err) => {
      if (err) {
        rename = false
        reject(err)
      }
    }))
  })
}
