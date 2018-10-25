import Vuex from 'vuex'
import Vue from 'vue'
import { getDate } from './util'

Vue.use(Vuex)

export interface State {
  status: string,
  goDate: string
}

const store = new Vuex.Store<State>({
  state: {
    status: '已就绪',
    goDate: localStorage.getItem('travelerGoDate') || getDate()
  },
  mutations: {
    changeStatus (state, status: string) {
      state.status = status
    },
    changeGoDate (state, goDate: string) {
      state.goDate = goDate
      localStorage.setItem('travelerGoDate', goDate)
    }
  }
})

export default store
