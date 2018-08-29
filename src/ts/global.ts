import Vue, { VueConstructor } from 'vue'
import * as electron from 'electron'
import request from './request'
import Client from './client'

export default () => ({
  install (Vue: VueConstructor<Vue>) {
    const bus = new Vue()
    Vue.prototype.electron = electron
    Vue.prototype.request = request
    Vue.prototype.client = new Client()
    Vue.prototype.bus = bus
    Vue.prototype.changeStatus = (status: string) => (bus.$emit('status', status), void 0)
  }
})
