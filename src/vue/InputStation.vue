<template>
<div class="input-station">
  <InputText 
    :value="value"
    @input="onInput"
    @click.native="inputClicked" />
  
  <div v-show="stations.length > 0" class="list" ref="list">
    <ul>
      <li v-for="station in stations.slice(page * numberPerPage, (page + 1) * numberPerPage)" :key="station.code" @click="stationClicked(station)">{{station.name}}</li>
    </ul>
    <div class="flex-between pagination">
      <span @click="prev">上一页</span>
      <span>{{(page + 1) + ' / ' + totalPage}}</span>
      <span @click="next">下一页</span>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-input-station">
</script>

<style scoped>
.input-station {
  position: relative;
}
.input-station .list {
  position: absolute;
  top: 30px;
  width: 100%;
  border: 1px solid rgb(127, 157, 185);
  box-sizing: border-box;
  font-size: 12px;
  background: #fff;
  z-index: 1000;
}
.input-station .list ul {
  list-style: none;
}
.input-station .list ul > li {
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  padding-left: 5px;
}
.input-station .list ul > li:hover {
  border-top: 1px solid rgb(104, 167, 246);
  border-bottom: 1px solid rgb(104, 167, 246);
  background: rgb(200, 227, 252);
}
.input-station .pagination > span:nth-child(odd) {
  border: 1px solid #333;
  cursor: pointer;
  padding: 0 5px;
}
</style>

