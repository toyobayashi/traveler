import { Vue, Component } from 'vue-property-decorator'
import TheHeader from '../vue/TheHeader.vue'
import ModalLogin from '../vue/ModalLogin.vue'
import Client, { Station } from './client'

@Component({
  components: {
    TheHeader,
    ModalLogin
  }
})
export default class extends Vue {
  client: Client = this.client
  status: string = '已就绪'
  stationName: Station[] = []
  mounted () {
    this.$nextTick(() => {
      this.status = '正在获取车站'
      this.client.stationName().then(({ err, data }) => {
        if (err) {
          this.status = '获取车站失败。' + err.message
          return
        }
        this.stationName = data || []
        this.status = '已就绪'
      })
      this.bus.$on('status', (status: string) => {
        this.status = status
      })
    })
  }
}
