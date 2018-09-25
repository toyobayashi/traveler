import { Vue, Component, Prop } from 'vue-property-decorator'
import InputStation from '../../vue/InputStation.vue'
import InputCalender from '../../vue/InputCalender.vue'
import Button from '../../vue/Button.vue'
import { Station } from './client'
import { getDate } from './util'

@Component({
  components: {
    InputStation,
    InputCalender,
    Button
  }
})
export default class extends Vue {
  from: string = ''
  to: string = ''
  goDate: string = getDate()
  queryBtnDisabled: boolean = false
  @Prop({ default: [] }) stations: Station[]

  async query () {
    let fromCode: string = ''
    let toCode: string = ''
    for (let i = 0; i < this.stations.length; i++) {
      if (fromCode && toCode) break
      if (this.stations[i].name === this.from) fromCode = this.stations[i].code
      if (this.stations[i].name === this.to) toCode = this.stations[i].code
    }

    // const trainDate = this.goDate.split('/').map((v, i) => {
    //   if (i === 0) return v
    //   return v.length > 1 ? v : '0' + v
    // }).join('-')

    this.queryBtnDisabled = true
    this.changeStatus('查询余票中')
    let res = await this.client.leftTicket(fromCode, toCode, this.goDate)
    this.queryBtnDisabled = false
    if (res.err) {
      this.changeStatus('查询余票失败')
      this.bus.$emit('setTableData', [])
      console.log(res.err)
    } else {
      this.changeStatus('已就绪')
      this.bus.$emit('setTableData', res.data)
      console.log(res.data)
    }
  }
}
