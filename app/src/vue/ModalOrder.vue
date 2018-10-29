<template>
<div class="modal-wrap flex-center" v-show="show">
  <div class="modal order-modal" :style="{ width: '600px' }">
    <div class="modal-header">订单</div>
    <div class="order-body">
      <div class="passenger">
        <span
          v-for="p in passengers"
          :key="p.passenger_id_no"
          class="passenger-item"
          :class="{ active: selectedPassengers.indexOf(p) !== -1 }"
          @click="selectPassenger(p)">{{p.passenger_name}}</span>
      </div>
      <div class="content">
        <div class="modal-body">
          <div>车次：{{train ? train.code : ''}}</div>
          <div>出发时间：{{goDate + ' ' + (train ? train.fromTime : '')}}</div>
          <div>时长：{{(train ? train.duration : '')}}</div>
          <div>到达时刻：{{(train ? train.toTime : '')}}</div>

          <table class="seat-table" cellspacing="0" border="0">
            <tr>
              <td v-for="seatType in seatTypeMap" :key="seatType.code" v-if="train && train[seatType.code]">{{seatType.name}}</td>
              <td v-if="train && train.wz">无座</td>
            </tr>
            <tr>
              <td v-for="seatType in seatTypeMap" :key="seatType.code" v-if="train && train[seatType.code]">{{(train ? train[seatType.code] : '')}}</td>
              <td v-if="train && train.wz">{{(train ? train.wz : '')}}</td>
            </tr>
          </table>

        </div>
        <div class="passenger-list">
          <div class="passenger-line" v-for="p in selectedPassengers" :key="p.passenger_id_no">
            <span style="flex: 2">{{p.passenger_name}}</span>
            <select style="flex: 5; outline: none" v-model="p.seatType">
              <option v-for="(seatType, code) in seatTypeMap" :key="seatType.code" v-if="train && train[seatType.code]" :value="code">{{seatType.name}}</option>
            </select>
            <div style="flex: 3" class="text-center"><span class="remove-btn" @click="removePassenger(p)">×</span></div>
          </div>
        </div>
        <div class="modal-footer flex-around">
          <Button color="orange" @click.native="watch">监控</Button>
          <Button @click.native="close">关闭</Button>
          <Button color="orange" @click.native="submit">提交订单</Button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-modal-order.ts">
</script>

<style scoped>
/* .order-modal {
  height: 
} */
.order-body {
  display: flex;

}
.order-body .passenger {
  flex: 2;
  height: 400px;
  padding: 10px;
  overflow: auto;
  border-right: 2px solid rgb(102, 200, 232);
}
.order-body .passenger .passenger-item {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  display: block;
  cursor: pointer;
}
.order-body .passenger .passenger-item.active {
  background: #26a306;
  color: #fff;
}
.order-body .content {
  flex: 8;
}
.order-body .seat-table {
  border-top: 1px solid rgb(102, 200, 232);
  border-left: 1px solid rgb(102, 200, 232);
}
.order-body .seat-table td {
  border-right: 1px solid rgb(102, 200, 232);
  border-bottom: 1px solid rgb(102, 200, 232);
  padding: 0 5px;
  text-align: center;
}
.order-body .passenger-list {
  margin-top: 5px;
  height: calc(100% - 189px);
  padding: 0 20px;
  overflow: auto;
}
.order-body .passenger-line {
  display: flex;
  margin-bottom: 5px;
}
.order-body .remove-btn {
  display: inline-block;
  user-select: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: red;
  color: #fff;
}
</style>
