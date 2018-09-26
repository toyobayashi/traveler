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
      return this.changeStatus('未登录无法预订车票')
    }
    if (!this.stations.length) {
      return this.changeStatus('未获取到站名列表无法预定车票')
    }
    const passengers = user.passengers
    console.log(train, this.goDate, getDate(), passengers)
    // this.client.doOrder(train, this.goDate, getDate(), TODO)
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('setTableData', (data: any[]) => {
        this.data = data
      })
    })
  }
}
