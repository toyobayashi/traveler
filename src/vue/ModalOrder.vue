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
}
.order-body .passenger .passenger-item.active {
  background: #26a306;
  color: #fff;
}
.order-body .content {
  flex: 8;
}
</style>
