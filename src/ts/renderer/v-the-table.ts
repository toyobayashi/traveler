import { Vue, Component, Prop } from 'vue-property-decorator'
import Button from '../../vue/Button.vue'
import { Station, Train } from './client'
import { getDate } from './util'

@Component({
  components: {
    Button
  }
})
export default class extends Vue {

  @Prop({ default: [] }) stations: Station[]
  @Prop({ default: getDate() }) goDate: string
  data: any[] = []

  getStationName (code: string) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].code === code) return this.stations[i].name
    }
    return ''
  }

  getClass (property: any) {
    if (property) {
      if (property === '有') {
        return ['ok']
      } else {
        return ['bold', 'black']
      }
    } else return []
  }

  doOrder (train: Train) {
    const user = this.client.getUser()
    if (!user) {
      this.bus.$emit('modal:login')
      return
    }
    if (!this.stations.length) {
      return this.changeStatus('未获取到站名列表无法预定车票')
    }
    // TODO
    this.changeStatus('暂时不支持下单功能')
    // TEST
    let passengers = user.passengers.filter(p => p.passenger_name === 'xxx' || p.passenger_name === 'yyy')
    passengers = passengers.map(p => {
      p.seatType = '1' // 硬座
      return p
    })

    let testPassengers = passengers
    console.log(train, this.goDate, getDate(), testPassengers)

    // this.client.doOrder(train, this.goDate, getDate(), testPassengers).then(res => console.log(res)).catch(err => console.log(err))
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('setTableData', (data: any[]) => {
        this.data = data
      })
    })
  }
}
