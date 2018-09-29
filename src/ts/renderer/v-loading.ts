import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  show: boolean = true
  @Prop({ default: '' }) status: string
  mounted () {
    this.$nextTick(() => {
      this.bus.$on('loading', (flag: boolean) => {
        this.show = flag
      })
    })
  }
}
