import { Vue, Component, Prop } from 'vue-property-decorator'
import InputStation from '../../vue/InputStation.vue'
import InputCalender from '../../vue/InputCalender.vue'
import Button from '../../vue/Button.vue'
import { Station } from './client'
import { getDate } from './util'

@Component({
  components: {
    InputStation,
    InputCalender,
    Button
  }
})
export default class extends Vue {
  from: string = ''
  to: string = ''
  goDate: string = getDate()
  @Prop({ default: [] }) stations: Station[]
}
