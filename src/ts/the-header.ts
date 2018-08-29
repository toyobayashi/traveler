import { Vue, Component, Prop } from 'vue-property-decorator'
import Button from '../vue/Button.vue'

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  @Prop() status: string
  @Prop() user: {
    username: string,
    name: string
  } | null

  login () {
    this.bus.$emit('modal:login')
  }

  async logout () {
    this.changeStatus('退出登录中')
    const res = await this.client.logout()
    if (res.err) return this.changeStatus('退出登录失败，' + res.err.message)
    this.changeStatus('已就绪')
  }
}
