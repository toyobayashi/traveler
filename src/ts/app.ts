import { Vue, Component } from 'vue-property-decorator'
import Login from '../vue/login.vue'

@Component({
  components: {
    Login
  }
})
export default class extends Vue {
  mounted () {
    // this.$nextTick(() => {

    // })
  }
}
