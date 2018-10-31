import Vuex from 'vuex'
import Vue from 'vue'
import { getDate } from './util'

Vue.use(Vuex)

export interface State {
  status: string,
  goDate: string,
  config: any
}

const store = new Vuex.Store<State>({
  state: {
    status: '已就绪',
    goDate: localStorage.getItem('travelerGoDate') || getDate(),
    config: localStorage.getItem('travelerConfig') ? JSON.parse(localStorage.getItem('travelerConfig') as any) : {}
  },
  mutations: {
    changeStatus (state, status: string) {
      state.status = status
    },
    changeGoDate (state, goDate: string) {
      state.goDate = goDate
      localStorage.setItem('travelerGoDate', goDate)
    },
    changeConfig (state, config) {
      state.config = config
      localStorage.setItem('travelerConfig', JSON.stringify(config))
    }
  }
})

export default store
