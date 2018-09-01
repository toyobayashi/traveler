import { Vue, Component, Prop } from 'vue-property-decorator'
import Button from '../../vue/Button.vue'
import { User } from './client'

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  loginBtnDisabled: boolean = false
  logoutBtnDisabled: boolean = false
  @Prop() status: string
  @Prop() user: User

  login () {
    this.bus.$emit('modal:login')
  }

  async logout () {
    this.logoutBtnDisabled = true
    this.changeStatus('退出登录中')
    const res = await this.client.logout()
    this.logoutBtnDisabled = false
    if (res.err) return this.changeStatus('退出登录失败，' + res.err.message)
    this.changeStatus('已就绪')
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('loginBtn', (disabled: boolean) => {
        this.loginBtnDisabled = disabled
      })
    })
  }
}
