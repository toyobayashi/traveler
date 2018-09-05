<template>
<div class="input-calender">
  <input
    type="text"
    :value="value"
    readonly
    class="input-text"
    :style="{ color: value === '' ? 'rgb(153, 153, 153)' : void 0 }" />
  <div class="calender" v-show="false">
    <div>{{value}}</div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-input-calender.ts">
</script>


<style scoped>
.input-calender {
  position: relative;
}
.calender {
  position: absolute;
  top: 30px;
  width: 100%;
  border: 1px solid rgb(127, 157, 185);
  box-sizing: border-box;
  font-size: 12px;
  background: #fff;
}
</style>

