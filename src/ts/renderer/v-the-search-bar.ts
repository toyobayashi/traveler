import { Vue, Component, Prop } from 'vue-property-decorator'
import InputStation from '../../vue/InputStation.vue'
import InputCalender from '../../vue/InputCalender.vue'
import Button from '../../vue/Button.vue'
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

  queryBtnDisabled: boolean = false
  @Prop({ default: getDate() }) value: string

  get goDate () {
    return this.value
  }

  goDateChange (value: string) {
    this.$emit('input', value)
    this.bus.$emit('setTableData', [])
  }

  async query () {
    const stationObject = this.client.getStations()
    let fromCode: string = stationObject.stationMap[this.from]
    let toCode: string = stationObject.stationMap[this.to]

    this.bus.$emit('setTableData', [])
    // this.queryBtnDisabled = true
    this.changeStatus('查询余票中')
    this.showLoading()
    let res = await this.client.leftTicket(fromCode, toCode, this.goDate)
    this.hideLoading()
    // this.queryBtnDisabled = false
    if (res.err) {
      this.changeStatus('查询余票失败。' + res.err.message)
      console.log(res.err)
    } else {
      this.changeStatus('已就绪')
      this.bus.$emit('setTableData', res.data)
      console.log(res.data)
    }
  }
}
