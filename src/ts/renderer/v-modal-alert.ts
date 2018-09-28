import { Component, Vue } from 'vue-property-decorator'
import Modal from '../../vue/Modal.vue'
import Button from '../../vue/Button.vue'

@Component({
  components: {
    Modal,
    Button
  }
})
export default class extends Vue {

  show: boolean = false
  title: string = '提示'
  text: string = ''

  close () {
    this.text = ''
    this.title = '提示'
    this.show = false
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('modal:alert', (text: string, title?: string) => {
        this.text = text
        if (title) this.title = title
        this.show = true
      })
    })
  }
}
