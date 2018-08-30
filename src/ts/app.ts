import { Vue, Component } from 'vue-property-decorator'
import TheHeader from '../vue/TheHeader.vue'
import ModalLogin from '../vue/ModalLogin.vue'
import Client from './client'

@Component({
  components: {
    TheHeader,
    ModalLogin
  }
})
export default class extends Vue {
  client: Client = this.client
  status: string = '已就绪'
  mounted () {
    this.$nextTick(() => {
      this.bus.$on('status', (status: string) => {
        this.status = status
      })
    })
  }
}
