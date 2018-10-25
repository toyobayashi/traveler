import { Vue, Component } from 'vue-property-decorator'
import { getDays } from './util'

@Component
export default class extends Vue {
  year: number = Number(this.getStoreState('goDate').split('-')[0]) // new Date().getFullYear()
  month: number = Number(this.getStoreState('goDate').split('-')[1]) // new Date().getFullYear()
  date: number = Number(this.getStoreState('goDate').split('-')[2]) // new Date().getFullYear()
  calenderShow: boolean = false

  get goDate () {
    return this.getStoreState('goDate')
  }

  get yearAndMonth () {
    return `${this.year}年${this.month}月`
  }

  get days () {
    return getDays(`${this.year}-${this.month}`)
  }

  get firstDay () {
    return new Date(this.year, this.month - 1, 1).getDay()
  }

  dateClicked (date: number) {
    this.date = date
    this.bus.$emit('setTableData', [])
    this.$store.commit('changeGoDate', `${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.date < 10 ? '0' + this.date : this.date}`)
    this.calenderShow = false
  }

  inputClicked () {
    if (!this.calenderShow) this.calenderShow = true
  }

  prev () {
    if (this.month !== 1) {
      --this.month
    } else {
      --this.year
      this.month = 12
    }
  }

  next () {
    if (this.month !== 12) {
      ++this.month
    } else {
      ++this.year
      this.month = 1
    }
  }

  mounted () {
    this.$nextTick(() => {
      document.addEventListener('click', (ev) => {
        if (!this.$el.contains(ev.target as any)) {
          this.calenderShow = false
        }
      }, false)
    })
  }
}
