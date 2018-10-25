<template>
<div class="input-calender">
  <input
    type="text"
    :value="goDate"
    @click="inputClicked"
    readonly
    class="input-text"
    :style="{ color: goDate === '' ? 'rgb(153, 153, 153)' : void 0 }" />
  <div class="calender" v-show="calenderShow">
    <div class="flex-between pagination">
      <span @click="prev">上一月</span>
      <span>{{yearAndMonth}}</span>
      <span @click="next">下一月</span>
    </div>
    <div class="flex-between week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
    <div class="date">
      <span v-for="blank in firstDay" :key="blank + 40"></span>
      <span
        v-for="d in days"
        :key="d"
        @click="dateClicked(d)"
        :class="{
          active: goDate.split('-')[0] == year && goDate.split('-')[1] == month && goDate.split('-')[2] == d
        }">{{d}}</span>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-input-calender.ts">
</script>


<style scoped>
.input-calender {
  position: relative;
}
.input-calender .calender {
  position: absolute;
  top: 30px;
  width: 200px;
  border: 1px solid rgb(127, 157, 185);
  box-sizing: border-box;
  font-size: 12px;
  background: #fff;
  z-index: 1000;
}
.input-calender .pagination > span:nth-child(odd) {
  border: 1px solid #333;
  cursor: pointer;
  padding: 0 5px;
}
.input-calender .week {
  background-color: rgb(189, 235, 239);
}
.input-calender .week > span {
  display: block;
  width: 14.28%;
  text-align: center;
}
.input-calender .date {
  display: flex;
  flex-wrap: wrap;
}
.input-calender .date > span {
  display: block;
  width: 14.28%;
  text-align: center;
  height: 18px;
  cursor: pointer;
}
.input-calender .date > span.active {
  background-color: rgb(193, 217, 259);
  border: 1px solid rgb(165, 185, 218);
}
</style>

