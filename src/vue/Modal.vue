<template>
<div class="modal-wrap flex-center" v-show="show">
  <div class="modal" :style="{ width: width + 'px' }">
    <div class="modal-header"><slot name="header"></slot></div>
    <div class="modal-body"><slot></slot></div>
    <div class="modal-footer"><slot name="footer"></slot></div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-modal.ts">
</script>
