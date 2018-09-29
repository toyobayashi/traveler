import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'
import InputText from '../../vue/InputText.vue'
import { seatTypeMap } from './util'

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
  seatTypeMap: typeof seatTypeMap = seatTypeMap

  close () {
    this.train = null
    this.goDate = ''
    this.show = false
    for (let i = 0; i < this.selectedPassengers.length;) {
      this.selectedPassengers[i].seatType = void 0
      this.selectedPassengers.splice(i, 1)
    }
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

  removePassenger (passenger: PassengerDTO) {
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      if (this.selectedPassengers[i].passenger_id_no === passenger.passenger_id_no) {
        this.selectedPassengers.splice(i, 1)
        break
      }
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
