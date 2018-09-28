<template>
<div class="train-table">
  <div class="table-header">
    <span style="flex: 90" class="flex-center bold">车次</span>
    <span style="flex: 100" class="flex-center bold">出发站<br/>到达站</span>
    <span style="flex: 82" class="flex-center bold">出发时间<br/>到达时间</span>
    <span style="flex: 82" class="flex-center bold">历时</span>
    <span style="flex: 49" class="flex-center bold">商务座<br/>特等座</span>
    <span style="flex: 49" class="flex-center bold">一等座</span>
    <span style="flex: 49" class="flex-center bold">二等座</span>
    <span style="flex: 49" class="flex-center bold">高级软卧</span>
    <span style="flex: 49" class="flex-center bold">软卧</span>
    <span style="flex: 49" class="flex-center bold">动卧</span>
    <span style="flex: 49" class="flex-center bold">硬卧</span>
    <span style="flex: 49" class="flex-center bold">软座</span>
    <span style="flex: 49" class="flex-center bold">硬座</span>
    <span style="flex: 49" class="flex-center bold">无座</span>
    <span style="flex: 49" class="flex-center bold">其他</span>
    <span style="flex: 85" class="flex-center bold">备注</span>
  </div>
  <div class="table-body">
    <div class="table-line" v-for="train in data" :key="train.code">
      <span style="flex: 90;font-size: 16px" class=" black bold">{{train.code}}</span>
      <span style="flex: 100" class="black bold"
        ><div><div class="black">{{getClientStationObject().stationMap[train.fromCode]}}</div
        ><div>{{getClientStationObject().stationMap[train.toCode]}}</div></div></span>
      <span style="flex: 82;font-size: 14px" class=" bold"
        ><div><div class="black">{{train.fromTime}}</div
        ><div>{{train.toTime}}</div></div></span>
      <span style="flex: 82" class="bold black">{{train.duration}}</span>
      <span style="flex: 49" :class="getClass(train.swz)"
        ><div><div>{{train.swz || '--'}}</div
        ><div>{{train.tdz}}</div></div></span>
      <span style="flex: 49" :class="getClass(train.ydz)">{{train.ydz || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.edz)">{{train.edz || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.gjrw)">{{train.gjrw || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.rw)">{{train.rw || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.dw)">{{train.dw || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.yw)">{{train.yw || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.rz)">{{train.rz || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.yz)">{{train.yz || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.wz)">{{train.wz || '--'}}</span>
      <span style="flex: 49" :class="getClass(train.qt)">{{train.qt || '--'}}</span>
      <span style="flex: 85"><Button color="default" @click.native="doOrder(train)">{{train.remark}}</Button></span>
    </div>
  </div>

</div>
</template>

<script lang="ts" src="../ts/renderer/v-the-table.ts">
</script>

<style scoped>
.train-table {
  font-size: 12px;
  width: 100%;
  height: calc(100% - 65px);
}
.train-table .table-header {
  background: linear-gradient(rgb(56, 156, 216), rgb(24, 122, 191));
  color: #fff;
  height: 52px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}
.train-table .table-body {
  max-height: calc(100% - 52px);
  overflow: auto;
  color: #999;
}
.train-table .table-body .table-line {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}
.train-table .table-body .table-line:nth-child(odd) {
  background: #eef1f8;
}
.train-table .table-body .table-line:nth-child(even) {
  background: #fff;
}
.train-table .table-body .table-line:nth-child(1) > span {
  border-top: 1px solid rgb(176, 206, 221);
}
.train-table .table-body .table-line > span:nth-child(1) {
  border-left: 1px solid rgb(176, 206, 221);
}
.train-table .table-body .table-line > span {
  height: 41px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid rgb(176, 206, 221);
  border-bottom: 1px solid rgb(176, 206, 221);
}
</style>
