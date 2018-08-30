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

  username: string = ''
  password: string = ''
  point: string[] = []
  ctx: CanvasRenderingContext2D

  async captchaImage () {
    this.point = []
    const res = await this.client.captchaImage()
    if (res.data) {
      this.ctx.clearRect(0, 0, 293, 190)

      const img = new Image()
      img.src = `data:image/jpeg;base64,${res.data.toString('base64')}`
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0)
      }
      img.onerror = (e) => {
        console.log(e)
      }
    } else {
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
    const res = await this.client.verify(this.username, this.password, this.point.join(','))
    if (res.err) {
      console.log(res.err)
      this.changeStatus(res.err.message)
      return this.captchaImage()
    } else {
      console.log(res.data)
      this.changeStatus('已就绪')
      this.close()
      this.captchaImage()
    }
  }

  mounted () {
    this.$nextTick(() => {
      this.ctx = (this.$refs.verify as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
      this.captchaImage()
      this.bus.$on('modal:login', () => {
        this.show = true
      })
    })
  }
}
