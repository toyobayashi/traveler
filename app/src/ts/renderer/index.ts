import Vue from 'vue'
import vueGlobal from './global'
import App from '../../vue/App.vue'
import store from './store'
import { ipcRenderer } from 'electron'

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

ipcRenderer.on('setting', () => {
  app.bus.$emit('modal:setting')
})

// ipcRenderer.on('about', () => {
//   remote.dialog.showMessageBox(remote.BrowserWindow.g, {
//     type: 'info',
//     title: remote.app.getName(),
//     message: `123`
//   })
// })

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
