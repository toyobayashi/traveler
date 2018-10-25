import * as electron from 'electron'
import request from '../renderer/request'
import Client from '../renderer/client'
import { State } from '../renderer/store'

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
    getStoreState: <K extends keyof State>(key: K) => State[K]
  }
}
