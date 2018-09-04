<template>
<input
  :type="type"
  :value="value"
  :placeholder="placeholder"
  @input="input($event.target.value)"
  class="input-text"
  :style="{ color: value === '' ? 'rgb(153, 153, 153)' : void 0 }" />
</template>

<script lang="ts" src="../ts/renderer/v-input-text.ts">
</script>

<style scoped>
.input-text {
  display: block;
  height: 30px;
  line-height: 30px;
  color: rgb(51, 51, 51);
  font-size: 12px;
  padding: 5px 0 5px 5px;
  width: 100%;
}
.input-text:focus {
  outline: none;
}
</style>