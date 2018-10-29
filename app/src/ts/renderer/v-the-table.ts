import { Vue, Component } from 'vue-property-decorator'
import Button from '../../vue/Button.vue'

@Component({
  components: {
    Button
  }
})
export default class extends Vue {

  get goDate () {
    return this.getStoreState('goDate')
  }
  data: any[] = []

  getClass (property: any) {
    if (property) {
      if (property === '有') {
        return ['ok']
      } else {
        return ['bold', 'black']
      }
    } else return []
  }

  getClientStationObject () {
    return this.client.getStations()
  }

  doOrder (train: Train) {
    const user = this.client.getUser()
    if (!user) {
      this.bus.$emit('modal:login')
      return
    }
    if (!this.getClientStationObject().stations.length) {
      return this.changeStatus('未获取到站名列表无法预定车票')
    }

    this.bus.$emit('modal:order', train, this.goDate)
    // TEST
    // let passengers = user.passengers.filter(p => p.passenger_name === 'xxx' || p.passenger_name === 'yyy')
    // passengers = passengers.map(p => {
    //   p.seatType = '1' // 硬座
    //   return p
    // })

    // let testPassengers = passengers
    // console.log(train, this.goDate, getDate(), testPassengers)

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
