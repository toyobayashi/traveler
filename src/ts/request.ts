import * as request from 'request'
import { IncomingMessage } from 'http'

const myRequest = request.defaults({
  baseUrl: 'https://kyfw.12306.cn',
  jar: true,
  gzip: true,
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
  }
})

export function promiseRequest<T = any> (options: (request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)): Promise<{ res: IncomingMessage; data: T }> {
  return new Promise((resolve, reject) => {
    myRequest(options, (err, res, data) => {
      if (err) return reject(err)
      return resolve({
        res,
        data
      })
    })
  })
}

export default promiseRequest
