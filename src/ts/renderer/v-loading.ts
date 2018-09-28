import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  show: boolean = true
  mounted () {
    this.$nextTick(() => {
      this.bus.$on('loading', (flag: boolean) => {
        this.show = flag
      })
    })
  }
}
