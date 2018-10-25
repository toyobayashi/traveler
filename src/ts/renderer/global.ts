import Vue, { VueConstructor } from 'vue'
import * as electron from 'electron'
import request from './request'
import Client from './client'
import store, { State } from './store'

export default () => ({
  install (Vue: VueConstructor<Vue>) {
    const bus = new Vue()
    Vue.prototype.electron = electron
    Vue.prototype.request = request
    Vue.prototype.client = new Client()
    Vue.prototype.bus = bus
    Vue.prototype.changeStatus = (status: string) => store.commit('changeStatus', status)
    Vue.prototype.alert = (text: string, title?: string) => { bus.$emit('modal:alert', text, title) }
    Vue.prototype.showLoading = () => { bus.$emit('loading', true) }
    Vue.prototype.hideLoading = () => { bus.$emit('loading', false) }
    Vue.prototype.getStoreState = <K extends keyof State>(key: K) => store.state[key]
  }
})
