import Vue, { VueConstructor } from 'vue'
import * as electron from 'electron'
import request from './request'
import Client from './client'

export default () => ({
  install (Vue: VueConstructor<Vue>) {
    Vue.prototype.electron = electron
    Vue.prototype.request = request
    Vue.prototype.client = new Client()
  }
})
