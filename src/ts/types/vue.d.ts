import * as electron from 'electron'
import request from '../renderer/request'
import Client from '../renderer/client'

declare module 'vue/types/vue' {
  interface Vue {
    electron: typeof electron
    request: typeof request
    client: Client
    bus: Vue
    changeStatus (status: string): void
    alert (text: string, title?: string): void
    showLoading (): void
    hideLoading (): void
  }
}
