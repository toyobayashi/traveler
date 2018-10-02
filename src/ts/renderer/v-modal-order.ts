import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'
import InputText from '../../vue/InputText.vue'
import { seatTypeMap, getDate, sleep } from './util'

@Component({
  components: {
    Modal,
    Button,
    InputText
  }
})
export default class extends Vue {

  show: boolean = false
  train: Train | null = null
  goDate: string = ''
  passengers: PassengerDTO[] = []
  selectedPassengers: PassengerDTO[] = []
  seatTypeMap: typeof seatTypeMap = seatTypeMap

  close () {
    this.train = null
    this.goDate = ''
    this.show = false
    for (let i = 0; i < this.selectedPassengers.length;) {
      this.selectedPassengers[i].seatType = void 0
      this.selectedPassengers.splice(i, 1)
    }
  }

  watch () {
    // TODO
    this.alert('还没做')
  }

  async submit () {
    // TODO
    // this.alert('还没做')
    if (!this.train) {
      this.alert('车次信息错误')
      return
    }

    const stationObject = this.client.getStations()
    let fromName: string = stationObject.stationMap[this.train.fromCode]
    let toName: string = stationObject.stationMap[this.train.toCode]

    this.showLoading()
    this.changeStatus('提交订单请求中')

    const submitOrderRequestResult = await this.client.submitOrderRequest(decodeURIComponent(this.train.secret), this.goDate, getDate(), fromName, toName)
    if (submitOrderRequestResult.err) {
      this.alert('提交订单请求失败。' + submitOrderRequestResult.err)
      this.changeStatus('提交订单请求失败。' + submitOrderRequestResult.err)
      this.hideLoading()
      return
    }
    // await sleep(500)

    this.changeStatus('正在获取token')
    const tokens = await this.client.getTokenDC()
    if (!tokens.data) {
      this.alert('获取token失败。' + tokens.err)
      this.changeStatus('获取token失败。' + tokens.err)
      this.hideLoading()
      return
    }

    let passengerTicketStr: string[] = []
    let oldPassengerStr: string[] = []
    const passengerType = '1'
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      const passenger = this.selectedPassengers[i]
      passengerTicketStr.push(
        `${passenger.seatType
        },0,${passengerType
        },${passenger.passenger_name
        },${passenger.passenger_id_type_code
        },${passenger.passenger_id_no
        },${passenger.mobile_no},N`
      )
      oldPassengerStr.push(
        `${passenger.passenger_name
        },${passenger.passenger_id_type_code
        },${passenger.passenger_id_no
        },${passengerType}_`
      )
    }

    // await sleep(500)

    this.changeStatus('正在检查订单')
    const checkOrderResult = await this.client.checkOrderInfo(tokens.data.globalRepeatSubmitToken, passengerTicketStr.join('_'), oldPassengerStr.join(''))
    if (checkOrderResult.err) {
      this.alert('检查订单失败。' + checkOrderResult.err)
      this.changeStatus('检查订单失败。' + checkOrderResult.err)
      this.hideLoading()
      return
    }

    // await sleep(500)

    this.changeStatus('正在获取队列信息')
    const queueResult = await this.client.getQueueCount(tokens.data.globalRepeatSubmitToken, this.train, this.goDate, this.selectedPassengers[0].seatType || '1')
    if (checkOrderResult.err) {
      this.alert('获取队列信息失败。' + queueResult.err)
      this.changeStatus('获取队列信息失败。' + queueResult.err)
      this.hideLoading()
      return
    }
    await sleep(500)

    this.changeStatus('正在确认订单')
    const confirmResult = await this.client.confirmSingleForQueue(tokens.data.globalRepeatSubmitToken, this.train, passengerTicketStr.join('_'), oldPassengerStr.join(''), tokens.data.keyCheckIsChange)
    if (confirmResult.err) {
      this.alert('确认订单失败。' + confirmResult.err)
      this.changeStatus('确认订单失败。' + confirmResult.err)
      this.hideLoading()
      return
    }
    await sleep(500)

    this.changeStatus('正在等待下单')
    let orderId = ''
    const maxRetry = 10
    let retry = -1
    while (true) {
      if (retry >= maxRetry) {
        this.changeStatus('等待下单失败')
        this.alert('等待下单失败')
        break
      }
      retry++
      const waitResult = await this.client.queryOrderWaitTime(tokens.data.globalRepeatSubmitToken)
      console.log(waitResult.data)
      if (!waitResult.data) {
        this.changeStatus('' + waitResult.err)
        this.alert('' + waitResult.err)
        break
      }

      if (waitResult.data.waitTime >= 0) {
        this.changeStatus('正在等待下单：大约剩余' + waitResult.data.waitTime + '秒。')
        await sleep(3000)
        continue
      } else {
        if (!waitResult.data.orderId) {
          this.changeStatus('等待下单错误：' + (waitResult.data.errMsg || (waitResult.data as any).msg) + '。3秒后重试')
          await sleep(3000)
          continue
        } else {
          orderId = waitResult.data.orderId
          break
        }
      }
    }

    if (!orderId) {
      this.hideLoading()
      return
    }

    this.changeStatus('正在获取下单结果')
    const result = await this.client.resultOrderForDcQueue(tokens.data.globalRepeatSubmitToken, orderId)
    if (result.err) {
      this.alert('获取下单结果失败。' + result.err)
      this.changeStatus('获取下单结果失败。' + result.err)
      this.hideLoading()
      return
    }

    this.hideLoading()
    this.alert('下单成功，订单号为' + orderId + '，请迅速前往官方网站或使用手机APP付款')
  }

  selectPassenger (passenger: PassengerDTO) {
    let exists = false
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      if (this.selectedPassengers[i].passenger_id_no === passenger.passenger_id_no) {
        exists = true
        this.selectedPassengers.splice(i, 1)
        break
      }
    }
    if (!exists) {
      this.selectedPassengers.push(passenger)
    }
  }

  removePassenger (passenger: PassengerDTO) {
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      if (this.selectedPassengers[i].passenger_id_no === passenger.passenger_id_no) {
        this.selectedPassengers.splice(i, 1)
        break
      }
    }
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('modal:order', (train: Train, goDate: string) => {
        const user = this.client.getUser()
        if (user) this.passengers = user.passengers

        this.show = true
        this.train = train
        this.goDate = goDate
      })
    })
  }
}
