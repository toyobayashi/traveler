<template>
<button :class="['tr-btn', colorClass]" :style="{ width: width + 'px' }"><slot></slot></button>
</template>

<script lang="ts" src="../ts/renderer/v-button.ts">
</script>


<style scoped>
.tr-btn {
  border: none;
  outline: none;
  border-radius: 3px;
  padding: 5px 10px;
  color: #fff;
  cursor: pointer;
}
.tr-btn-orange:hover {
  background-color: rgb(247, 146, 9);
}
.tr-btn-orange:active {
  background-color: rgb(194, 117, 9);
}
.tr-btn-orange {
  background-color: rgb(255, 128, 0);
}

.tr-btn-default:hover {
  background-color: rgb(32, 143, 255);
}
.tr-btn-default:active {
  background-color: rgb(24, 98, 172);
}
.tr-btn-default {
  background-color: rgb(0, 128, 255);
}

.tr-btn[disabled] {
  background-color: rgb(237, 235, 235) !important;
  color: #000;
  cursor: not-allowed;
}
</style>
