import { Vue, Component } from 'vue-property-decorator'
import TheHeader from '../../vue/TheHeader.vue'
import ModalLogin from '../../vue/ModalLogin.vue'
import TheSearchBar from '../../vue/TheSearchBar.vue'
import TheTable from '../../vue/TheTable.vue'
import Loading from '../../vue/Loading.vue'
import Client from './client'
import { getDate } from './util'

@Component({
  components: {
    TheHeader,
    ModalLogin,
    TheSearchBar,
    TheTable,
    Loading
  }
})
export default class extends Vue {
  client: Client = this.client
  status: string = '已就绪'

  goDate: string = getDate()
  mounted () {
    this.$nextTick(() => {
      this.status = '正在获取车站'
      this.showLoading()
      this.client.getStationName().then(({ err }) => {
        this.hideLoading()
        if (err) {
          this.status = '获取车站失败。' + err.message
          return
        }

        this.status = '已就绪'
      })
      this.bus.$on('status', (status: string) => {
        this.status = status
      })
    })
  }
}
