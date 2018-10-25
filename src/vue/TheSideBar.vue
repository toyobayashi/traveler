<template>
<div class="side-bar" :class="{ show: show }">
  <div class="toggle-button" @click="toggle"><span>任</span><span>务</span></div>
  <div class="content"></div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-the-side-bar.ts">
</script>

<style scoped>
.side-bar {
  height: 100%;
  width: 250px;
  position: absolute;
  right: -250px;
  top: 0;
  transition: right cubic-bezier(0, 0, 0, 1) 0.3s;
}
.side-bar.show {
  right: 0;
}
.side-bar .content {
  width: 100%;
  height: 100%;
  background: #fff;
}
.side-bar .toggle-button {
  position: absolute;
  left: -30px;
  bottom: 50px;
  width: 30px;
  height: 50px;
  border-radius: 7px 0 0 7px;
  background: linear-gradient(135deg, rgb(126, 171, 199), rgb(24, 122, 191));
  cursor: pointer;
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
