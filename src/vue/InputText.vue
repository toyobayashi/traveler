<template>
<input :type="type" :value="value" :placeholder="placeholder" @input="input($event.target.value)" class="input-text" :style="{ color: value === '' ? 'rgb(153, 153, 153)' : void 0 }" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
@Component
export default class extends Vue {

  @Prop({ default: 'text' }) type: string
  @Prop({ default: '' }) value: string
  @Prop({ default: '' }) placeholder: string
  @Emit() input (_value: string) {
    console.log(_value)
  }
}
</script>

<style scoped>
.input-text {
  display: block;
  height: 30px;
  line-height: 30px;
  color: rgb(51, 51, 51);
  box-sizing: border-box;
  font-size: 12px;
  padding: 5px 0 5px 5px;
}
.input-text:focus {
  outline: none;
}
</style>