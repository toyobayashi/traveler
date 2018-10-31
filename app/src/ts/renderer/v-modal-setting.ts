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
  time: any = ''

  get config () {
    return this.getStoreState('config')
  }

  close () {
    this.time = ''
    this.show = false
  }

  save () {
    if (isNaN(Number(this.time)) || Number(this.time) < 500) {
      this.alert('监控间隔应不小于500毫秒。')
      return
    }
    let newConfig = { ...this.config, time: Number(this.time) }
    this.$store.commit('changeConfig', newConfig)
    this.close()
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('modal:setting', () => {
        console.log(this.config)
        this.time = this.config.time
        this.show = true
      })
    })
  }
}
