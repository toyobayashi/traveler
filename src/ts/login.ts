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
    const { data } = await this.request({
      method: 'GET',
      encoding: null,
      url: this.route.CAPTCHA_IMAGE()
    })
    this.ctx.clearRect(0, 0, 293, 190)

    const img = new Image()
    img.src = `data:image/jpeg;base64,${data.toString('base64')}`
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0)
    }
    img.onerror = (e) => {
      console.log(e)
    }
  }

  async captchaCheck (): Promise<boolean> {
    let captchaCheckResult: any
    try {
      const { data } = await this.request({
        method: 'POST',
        url: this.route.CAPTCHA_CHECK,
        form: {
          answer: this.point.join(','),
          login_site: 'E',
          rand: 'sjrand'
        }
      })
      captchaCheckResult = data
    } catch (e) {
      console.log(e)
      return false
    }

    if (!captchaCheckResult || captchaCheckResult.result_code !== '4') {
      console.log(captchaCheckResult)
      return false
    }

    return true
  }

  async login (): Promise<boolean> {
    let loginResult: any
    try {
      const { data } = await this.request({
        method: 'POST',
        url: this.route.LOGIN,
        form: {
          appid: 'otn',
          username: this.username,
          password: this.password
        }
      })
      loginResult = data
    } catch (e) {
      console.log(e)
      return false
    }

    if (!loginResult || loginResult.result_code !== 0) {
      console.log(loginResult)
      return false
    }

    return true
  }

  async authUAMTK (): Promise<string> {
    let authResult: any
    try {
      const { data } = await this.request({
        method: 'POST',
        url: this.route.AUTH_UAMTK,
        form: {
          appid: 'otn'
        }
      })
      authResult = data
    } catch (e) {
      console.log(e)
      return ''
    }

    if (!authResult || authResult.result_code !== 0) {
      console.log(authResult)
      return ''
    }
    return authResult.newapptk
  }

  async authClient (apptk: string): Promise<{ apptk: string; username: string } | null> {
    let authClientResult: any
    try {
      const { data } = await this.request({
        method: 'POST',
        url: this.route.AUTH_CLIENT,
        form: {
          tk: apptk
        }
      })
      authClientResult = data
    } catch (e) {
      console.log(e)
      return null
    }

    if (!authClientResult || authClientResult.result_code !== 0) {
      console.log(authClientResult)
      return null
    }

    return {
      apptk: authClientResult.apptk,
      username: authClientResult.username
    }
  }

  async auth (): Promise<{ apptk: string; username: string } | null> {
    const newapptk = await this.authUAMTK()
    if (!newapptk) return null
    const authClientResult = await this.authClient(newapptk)
    console.log(authClientResult)
    return authClientResult
  }

  async logout () {
    const logoutResult = await this.request({
      method: 'GET',
      url: this.route.LOGOUT
    })
    console.log(logoutResult)
  }

  async verify () {
    const captchaCheckResult = await this.captchaCheck()
    if (!captchaCheckResult) return this.captchaImage()

    const loginResult = await this.login()
    if (!loginResult) return this.captchaImage()

    const authResult = await this.auth()
    if (!authResult) return this.captchaImage()
    console.log(authResult)
    return authResult
  }

  async getPassenger (name?: string): Promise<PassengerDTO[]> {
    let passengerResult: any
    try {
      const { data } = await this.request({
        method: 'POST',
        url: this.route.GET_PASSENGER,
        form: {
          pageIndex: 1,
          pageSize: 999,
          'passengerDTO.passenger_name': name
        }
      })
      passengerResult = data
    } catch (e) {
      console.log(e)
    }

    console.log(passengerResult.data.normal_passengers)
    return (passengerResult.data && passengerResult.data.normal_passengers) || []
  }

  mounted () {
    this.$nextTick(() => {
      this.ctx = (this.$refs.verify as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
      this.captchaImage()
    })
  }
}
