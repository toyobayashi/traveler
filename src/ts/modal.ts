import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  show: boolean = false
  @Prop({ default: 500, required: false }) width: number

  close () {
    this.show = false
  }
}
