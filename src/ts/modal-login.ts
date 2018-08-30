import { Component } from 'vue-property-decorator'
import Modal from './modal'
import Button from '../vue/Button.vue'
import InputText from '../vue/InputText.vue'

@Component({
  components: {
    Button,
    InputText
  }
})
export default class extends Modal {

  username: string = localStorage.getItem('trUser') || ''
  password: string = ''
  point: string[] = []
  loading: boolean = false
  ctx: CanvasRenderingContext2D

  keyboardListener = (ev: KeyboardEvent) => {
    if (ev.keyCode === 13) {
      this.verify()
    } else if (ev.keyCode === 27) {
      this._close()
    }
  }

  _close () {
    this.close()
    window.removeEventListener('keydown', this.keyboardListener)
  }

  async captchaImage () {
    this.ctx.clearRect(0, 0, 293, 190)
    this.loading = true
    this.point = []
    const res = await this.client.captchaImage()
    if (res.data) {
      const img = new Image()
      img.src = `data:image/jpeg;base64,${res.data.toString('base64')}`
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0)
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
    this._close()
    this.bus.$emit('loginBtn', true)
    const res = await this.client.verify(this.username, this.password, this.point.join(','))
    this.bus.$emit('loginBtn', false)

    if (res.err) {
      console.log(res.err)
      this.changeStatus(res.err.message)
      return this.bus.$emit('modal:login')
    }
    localStorage.setItem('trUser', this.username)

    console.log(res.data)
    this.changeStatus('正在获取乘客信息')
    const psgRes = await this.client.getPassenger()
    if (psgRes.err) return this.changeStatus('获取乘客信息失败。' + psgRes.err.message)
    console.log(this.client.getUser())
    this.changeStatus('已就绪')

  }

  mounted () {
    this.$nextTick(() => {
      this.ctx = (this.$refs.verify as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D

      this.bus.$on('modal:login', () => {
        this.open()
        this.captchaImage()
        if (this.username !== '') {
          const inputEl = (this.$refs.password as any).$el
          setTimeout(() => inputEl.focus(), 0)
        } else {
          const inputEl = (this.$refs.username as any).$el
          setTimeout(() => inputEl.focus(), 0)
        }
        window.addEventListener('keydown', this.keyboardListener)
      })
    })
  }
}
