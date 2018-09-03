import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {

  @Prop({ default: 'text' }) type: string
  @Prop({ default: '' }) value: string
  @Prop({ default: '' }) placeholder: string
  @Emit() input (_value: string) {
    // this.$emit(_value)
  }
}
