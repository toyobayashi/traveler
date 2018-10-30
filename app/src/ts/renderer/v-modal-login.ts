import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'
import InputText from '../../vue/InputText.vue'

let ctx: CanvasRenderingContext2D

@Component({
  components: {
    Modal,
    Button,
    InputText
  },
  directives: {
    focus: {
      componentUpdated (el, binding) {
        if (binding.value && binding.oldValue !== binding.value) {
          if ((el as HTMLInputElement).value) {
            setTimeout(() => {
              el.parentElement && el.parentElement.nextElementSibling && (el.parentElement.nextElementSibling.childNodes[1] as HTMLInputElement).focus()
            }, 0)
          } else {
            setTimeout(() => {
              el.focus()
            }, 0)
          }
        }
      }
    },
    canvasInit: {
      inserted (el) {
        ctx = (el as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
      }
    }
  }
})
export default class extends Vue {

  show: boolean = false
  username: string = localStorage.getItem('trUser') || ''
  password: string = ''
  point: string[] = []
  loading: boolean = false

  keyboardListener = (ev: KeyboardEvent) => {
    if (ev.keyCode === 13) {
      this.verify()
    } else if (ev.keyCode === 27) {
      this.close()
    }
  }

  close () {
    window.removeEventListener('keydown', this.keyboardListener)
    this.show = false
  }

  async captchaImage () {
    ctx.clearRect(0, 0, 293, 190)
    this.loading = true
    this.point = []
    const res = await this.client.captchaImage()
    if (res.data) {
      const img = new Image()
      img.src = `data:image/jpeg;base64,${res.data.toString('base64')}`
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        this.loading = false
      }
      img.onerror = (e) => {
        this.loading = false
        console.log(e)
      }
    } else {
      this.loading = false
      console.log(res.err)
    }
  }

  verifyClick (e: MouseEvent) {
    if (this.loading) return
    const pos = `${e.offsetX},${e.offsetY - 30}`
    this.point.push(pos)
    console.log(this.point)
  }

  removeMark (p: string) {
    for (let i = 0; i < this.point.length; i++) {
      if (p === this.point[i]) {
        this.point.splice(i, 1)
        break
      }
    }
  }

  async verify () {
    this.changeStatus('登录中')
    this.close()
    this.bus.$emit('loginBtn', true)
    const res = await this.client.verify(this.username, this.password, this.point.join(','))
    this.bus.$emit('loginBtn', false)

    if (res.err) {
      console.log(res.err)
      this.changeStatus(res.err.message)
      this.bus.$emit('modal:login')
      return
    }
    localStorage.setItem('trUser', this.username)

    console.log(res.data)

    // while (true) {
    //   this.changeStatus('正在获取乘客信息')
    //   const psgRes = await this.client.getPassenger()
    //   if (!psgRes.err) {
    //     break
    //   }
    //   this.changeStatus('获取乘客信息失败。' + psgRes.err.message)
    //   await sleep(1000)
    // }
    // if (psgRes.err) return this.changeStatus('获取乘客信息失败。' + psgRes.err.message)
    this.changeStatus('正在获取乘客信息')
    const psgRes = await this.client.getPassenger()
    if (psgRes.err) {
      this.changeStatus('获取乘客信息失败。' + psgRes.err.message)
    }
    console.log(this.client.getUser())
    this.changeStatus('已就绪')

  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('modal:login', () => {
        const hour = new Date().getHours() // 中国时间
        if (hour >= 23 || hour < 6) this.alert('12306维护时间不能登录')
        this.show = true
        this.captchaImage()
        window.addEventListener('keydown', this.keyboardListener)
      })
    })
  }
}
