<template>
<Modal :show="show" :width="400">
  <span slot="header">设置</span>
  
  <div>
    <div class="line"><span style="flex: 1" class="flex-center">监控间隔</span><InputText style="flex: 3" v-model="time" /></div>
  </div>

  <div slot="footer" class="flex-around">
    <Button @click.native="save">保存</Button>
    <Button @click.native="close">取消</Button>
  </div>
</Modal>
</template>

<script lang="ts" src="../ts/renderer/v-modal-setting.ts">
</script>

<style scoped>
.line {
  display: flex;
}
</style>
