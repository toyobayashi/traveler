import * as electron from 'electron'
import request from '../request'
import Client from '../client'

declare module 'vue/types/vue' {
  interface Vue {
    electron: typeof electron
    request: typeof request
    client: Client
  }
}
