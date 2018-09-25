import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { getDays } from './util'

@Component
export default class extends Vue {
  year: number = new Date().getFullYear()
  month: number = new Date().getMonth() + 1
  date: number = new Date().getDate()
  calenderShow: boolean = false

  // yearAndMonth: string = getDate().substring(0, getDate().lastIndexOf('/'))
  // numberPerPage: number = 10
  @Prop({ default: '' }) value: string

  @Emit('input') onInput (_value: string) {
    // this.$emit('input', _value)
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
    this.$emit('input', `${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.date < 10 ? '0' + this.date : this.date}`)
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
