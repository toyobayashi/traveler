import { Vue, Component } from 'vue-property-decorator'
import TheHeader from '../../vue/TheHeader.vue'
import ModalLogin from '../../vue/ModalLogin.vue'
import ModalOrder from '../../vue/ModalOrder.vue'
import ModalAlert from '../../vue/ModalAlert.vue'
import ModalSetting from '../../vue/ModalSetting.vue'
import TheSearchBar from '../../vue/TheSearchBar.vue'
import TheTable from '../../vue/TheTable.vue'
import TheSideBar from '../../vue/TheSideBar.vue'
import Loading from '../../vue/Loading.vue'
import Client from './client'

@Component({
  components: {
    TheHeader,
    ModalLogin,
    ModalOrder,
    ModalAlert,
    ModalSetting,
    TheSearchBar,
    TheTable,
    TheSideBar,
    Loading
  }
})
export default class extends Vue {
  client: Client = this.client

  get status () {
    return this.getStoreState('status')
  }

  get goDate () {
    return this.getStoreState('goDate')
  }

  mounted () {
    this.$nextTick(() => {
      this.changeStatus('正在获取车站')
      this.showLoading()
      this.client.getStationName().then(({ err }) => {
        this.hideLoading()
        if (err) {
          this.changeStatus('获取车站失败。' + err.message)
          return
        }
        this.changeStatus('已就绪')
      })
    })
  }
}
