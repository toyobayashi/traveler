import Vue from 'vue'
import vueGlobal from './global'
import App from '../../vue/App.vue'
import store from './store'

Vue.use(vueGlobal())

// tslint:disable-next-line:no-unused-expression
const app = new Vue({
  el: '#root',
  store,
  render: h => h(App)
})

window.onbeforeunload = function () {
  app.bus.$emit('saveTask')
}

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
