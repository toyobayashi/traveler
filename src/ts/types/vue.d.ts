import * as electron from 'electron'
import * as request from 'request'
import { IncomingMessage } from 'http'

declare module 'vue/types/vue' {
  interface Vue {
    electron: typeof electron
    request (options: (request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)): Promise<{
      res: IncomingMessage,
      data: any
    }>
    route: {
      CAPTCHA_IMAGE (): string
      CAPTCHA_CHECK: string
      LOGIN: string
      AUTH_UAMTK: string
      AUTH_CLIENT: string
      LOGOUT: string
      GET_PASSENGER: string
    }
  }
}
