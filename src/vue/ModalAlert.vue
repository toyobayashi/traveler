<template>
<Modal :show="show" :width="400">
  <span slot="header">{{title}}</span>
  {{text}}
  <div slot="footer" class="flex-around">
    <Button @click.native="close">确定</Button>
  </div>
</Modal>
</template>

<script lang="ts" src="../ts/renderer/v-modal-alert.ts">
</script>
