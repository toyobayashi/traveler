import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import InputText from '../../vue/InputText.vue'

@Component({
  components: {
    InputText
  }
})
export default class extends Vue {
  stations: Station[] = []
  page: number = 0
  numberPerPage: number = 10

  @Prop({ default: '' }) value: string

  @Emit('input') onInput (_value: string) {
    this.stations = []
    this.page = 0
    if (_value) {
      const stationAll = this.client.getStations().stations
      for (let i = 0; i < stationAll.length; i++) {
        if (stationAll[i].name.includes(_value) || stationAll[i].fullSpelling.includes(_value) || stationAll[i].initialSpelling.includes(_value)) {
          this.stations.push(stationAll[i])
        }
      }
    }
    // this.$emit('input', _value)
  }

  inputClicked () {
    const _value = this.value
    if (_value) {
      if (!this.stations.length) {
        this.stations = []
        this.page = 0
        const stationAll = this.client.getStations().stations
        for (let i = 0; i < stationAll.length; i++) {
          if (stationAll[i].name.includes(_value) || stationAll[i].fullSpelling.includes(_value) || stationAll[i].initialSpelling.includes(_value)) {
            this.stations.push(stationAll[i])
          }
        }
      }
    }
  }

  stationClicked (station: Station) {
    this.$emit('input', station.name)
    this.stations = []
    this.page = 0
  }

  prev () {
    return this.page > 0 ? --this.page : this.page = this.totalPage - 1
  }

  next () {
    return this.page < this.totalPage - 1 ? ++this.page : this.page = 0
  }

  get totalPage () {
    return Math.ceil(this.stations.length / 10)
  }

  mounted () {
    this.$nextTick(() => {
      document.addEventListener('click', (ev) => {
        if (!this.$el.contains(ev.target as any)) {
          this.page = 0
          this.stations = []
        }
      }, false)
    })
  }
}
