import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'
import InputText from '../../vue/InputText.vue'

@Component({
  components: {
    Modal,
    Button,
    InputText
  }
})
export default class extends Vue {

  show: boolean = false
  train: Train | null = null
  goDate: string = ''
  passengers: PassengerDTO[] = []
  selectedPassengers: PassengerDTO[] = []

  close () {
    this.train = null
    this.goDate = ''
    this.show = false
  }

  watch () {
    // TODO
    this.alert('还没做')
  }

  submit () {
    // TODO
    this.alert('还没做')
  }

  selectPassenger (passenger: PassengerDTO) {
    let exists = false
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      if (this.selectedPassengers[i].passenger_id_no === passenger.passenger_id_no) {
        exists = true
        this.selectedPassengers.splice(i, 1)
        break
      }
    }
    if (!exists) {
      this.selectedPassengers.push(passenger)
    }
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('modal:order', (train: Train, goDate: string) => {
        const user = this.client.getUser()
        if (user) this.passengers = user.passengers

        this.show = true
        this.train = train
        this.goDate = goDate
      })
    })
  }
}
