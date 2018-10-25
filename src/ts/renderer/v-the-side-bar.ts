import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  show: boolean = false
  toggle () {
    this.show = !this.show
  }
}
