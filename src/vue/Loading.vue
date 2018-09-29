<template>
<div class="modal-wrap flex-center" style="flex-direction: column" v-if="show">
  <div><img src="../../res/loading.gif" /></div>
  <div style="color: #fff">{{status}}</div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-loading.ts">
</script>
