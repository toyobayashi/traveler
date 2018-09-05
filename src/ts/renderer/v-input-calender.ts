import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  page: number = 0
  numberPerPage: number = 10
  @Prop({ default: '' }) value: string

  @Emit('input') onInput (_value: string) {
    // this.$emit('input', _value)
  }

  // prev () {
  //   return this.page > 0 ? --this.page : this.page = this.totalPage - 1
  // }

  // next () {
  //   return this.page < this.totalPage - 1 ? ++this.page : this.page = 0
  // }

  mounted () {
    this.$nextTick(() => {
      // TODO
    })
  }
}
