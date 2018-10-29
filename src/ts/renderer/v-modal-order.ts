import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'
import InputText from '../../vue/InputText.vue'
import { seatTypeMap, getDate } from './util'

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
    if (!this.train) {
      this.alert('车次信息错误')
      console.log(this.train)
      return
    }

    this.showLoading()
    const orderResult = await this.client.placeOrder(this.train, this.goDate, getDate(), this.selectedPassengers, {
      preSubmitOrderRequest: () => this.changeStatus('提交订单请求中'),
      preGetTokenDC: () => this.changeStatus('正在获取token'),
      preCheckOrderResult: () => this.changeStatus('正在检查订单'),
      preGetQueueCount: () => this.changeStatus('正在获取队列信息'),
      preConfirmSingleForQueue: () => this.changeStatus('正在确认订单'),
      preQueryOrderWaitTime: () => this.changeStatus('正在等待出票'),
      onQueryOrderWaitTime: (leftTime) => this.changeStatus('出票处理中：大约剩余' + leftTime + '秒。'),
      preResultOrderForDcQueue: () => this.changeStatus('正在获取出票结果')
    })
    this.hideLoading()
    if (orderResult.err) {
      this.alert(orderResult.err.toString())
      this.changeStatus(orderResult.err.toString())
      return
    }

    this.changeStatus('出票成功')
    this.alert('出票成功，订单号为' + orderResult.data + '，请迅速前往官方网站或使用手机APP付款')
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
