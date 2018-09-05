import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Station } from './client'
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
  @Prop() stationsAll: Station[]
  @Prop({ default: '' }) value: string

  @Emit('input') onInput (_value: string) {
    this.stations = []
    this.page = 0
    if (_value) {
      for (let i = 0; i < this.stationsAll.length; i++) {
        if (this.stationsAll[i].name.includes(_value) || this.stationsAll[i].fullSpelling.includes(_value) || this.stationsAll[i].initialSpelling.includes(_value)) {
          this.stations.push(this.stationsAll[i])
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
        for (let i = 0; i < this.stationsAll.length; i++) {
          if (this.stationsAll[i].name.includes(_value) || this.stationsAll[i].fullSpelling.includes(_value) || this.stationsAll[i].initialSpelling.includes(_value)) {
            this.stations.push(this.stationsAll[i])
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
