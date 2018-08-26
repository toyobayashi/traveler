import Vue, { VueConstructor } from 'vue'
import * as electron from 'electron'
import * as request from 'request'
import route from './route'

const myRequest = request.defaults({
  baseUrl: 'https://kyfw.12306.cn',
  jar: true,
  gzip: true,
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
  }
})

export default () => ({
  install (Vue: VueConstructor<Vue>) {
    Vue.prototype.electron = electron
    Vue.prototype.request = (options: (request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)) => new Promise((resolve, reject) => {
      myRequest(options, (err, res, data) => {
        if (err) return reject(err)
        return resolve({
          res,
          data
        })
      })
    })
    Vue.prototype.route = route
  }
})
