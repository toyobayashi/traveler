import { Vue, Component, Prop } from 'vue-property-decorator'
import { Station } from './client'

@Component
export default class extends Vue {

  @Prop({ default: [] }) stations: Station[]
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

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('setTableData', (data: any[]) => {
        this.data = data
      })
    })
  }
}
