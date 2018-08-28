import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  username: string = ''
  password: string = ''
  point: string[] = []
  ctx: CanvasRenderingContext2D

  verifyClick (e: MouseEvent) {
    const pos = `${e.offsetX},${e.offsetY - 30}`
    this.point.push(pos)
    console.log(this.point)
  }

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

  async auth () {
    console.log(await this.client.auth())
    console.log(this.client.getUser())
  }

  async logout () {
    console.log(await this.client.logout())
    console.log(this.client.getUser())
  }

  async verify () {
    const res = await this.client.verify(this.username, this.password, this.point.join(','))
    if (res.err) {
      console.log(res.err)
      return this.captchaImage()
    } else {
      console.log(res.data)
    }
  }

  async getPassenger (name?: string) {
    console.log(await this.client.getPassenger(name))
  }

  mounted () {
    this.$nextTick(() => {
      this.ctx = (this.$refs.verify as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
      this.captchaImage()
    })
  }
}
