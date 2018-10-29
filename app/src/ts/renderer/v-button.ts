import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 'default' }) color: string
  @Prop({ default: 90 }) width: number
  get colorClass () {
    return `tr-btn-${this.color}`
  }
}
