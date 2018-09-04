<template>
<div class="search-bar">
  <div><div class="flex-around"><span class="title">出发地</span><InputStation v-model="from" :stations-all="stations"/></div></div>
  <div><div class="flex-around"><span class="title">目的地</span><InputStation v-model="to" :stations-all="stations"/></div></div>
  <div>3</div>
  <div>4</div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-the-search-bar.ts">
</script>

<style scoped>
.search-bar {
  width: 100%;
  height: 65px;
  background: linear-gradient(rgb(255, 255, 255), rgb(225, 225, 225));
  border-bottom: 2px solid rgb(71, 141, 205);
  display: flex;
  align-items: center;
}
.search-bar > div {
  flex: 2;
}
.search-bar > div:nth-last-child(1) {
  flex: 1;
}
.search-bar .title {
  font-size: 12px;
  line-height: 30px;
}
</style>
