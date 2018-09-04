import { Vue, Component, Prop } from 'vue-property-decorator'
import InputStation from '../../vue/InputStation.vue'
import { Station } from './client'

@Component({
  components: {
    InputStation
  }
})
export default class extends Vue {
  from: string = ''
  to: string = ''
  @Prop({ default: [] }) stations: Station[]
}
