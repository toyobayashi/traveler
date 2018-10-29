import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  show: boolean = false

  toggle () {
    this.show = !this.show
    if (this.show) {
      document.addEventListener('click', this.toggleListener, false)
    } else {
      document.removeEventListener('click', this.toggleListener, false)
    }
  }

  toggleListener (ev: MouseEvent) {
    if (!this.$el.contains(ev.target as any)) {
      if (this.show) this.show = false
    }
  }

  mounted () {
    this.$nextTick(() => {
      // code
    })
  }
}
