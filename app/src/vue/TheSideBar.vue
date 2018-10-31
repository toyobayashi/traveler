<template>
<div class="side-bar" :class="{ show: show }">
  <div class="toggle-button" @click="toggle"><span>任</span><span>务</span></div>
  <div class="tab">
    <div :class="{ active: activeTab === 'watch' }" @click="tabWatchClicked">余票监控</div>
    <div :class="{ active: activeTab === 'order' }" @click="tabUncompletedOrderClicked">未完成订单</div>
  </div>
  <div class="content" v-show="activeTab === 'watch'">
    <div v-if="!taskList.length" class="center">无监控任务</div>
    <div v-else class="task" v-for="task in taskList" :key="task.id">
      <div class="line"><span>车次：</span><span>{{task.train.code + ' ' + task.train.fromName + ' - ' + task.train.toName}}</span></div>
      <div class="line"><span>出发：</span><span>{{task.trainDate + ' ' + task.train.fromTime}}</span></div>
      <div class="line"><span>乘客：</span><span>{{task.passengersString}}</span></div>
      <div class="line"><span>状态：</span><span>{{task.statusString}}</span></div>
      <div class="pause-btn" :class="{ active: task.status === 0 }" v-if="task.status !== -1" @click="pauseTask(task)"></div>
      <div class="remove-btn" @click="removeTask(task)"></div>
    </div>
  </div>
  <div class="content" v-show="activeTab === 'order'">
    <div v-if="!user" class="center">未登录</div>
    <div v-else-if="!orderList.length" class="center">{{orderStatus}}</div>
    <div v-else class="task" v-for="order in orderList" :key="order.sequence_no">
      <div class="line"><span>订单号：</span><span style="flex: 2">{{order.sequence_no}}</span></div>
      <div class="line"><span>下单时间：</span><span style="flex: 2">{{order.order_date}}</span></div>
      <div class="line"><span>总价：</span><span style="flex: 2">{{order.ticket_total_price_page}}元</span></div>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-the-side-bar.ts">
</script>

<style scoped>
.center {
  color: #fff;
  text-align: center;
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.side-bar {
  height: 100%;
  width: 213px;
  position: absolute;
  right: -213px;
  top: 0;
  transition: right cubic-bezier(0, 0, 0, 1) 0.3s;
}
.side-bar.show {
  right: 0;
}
.side-bar .tab {
  height: 30px;
  display: flex;
  color: #fff;
  font-size: 14px;
}
.side-bar .tab > div {
  height: 30px;
  flex: 1;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  background: rgb(80, 123, 165);
}
.side-bar .tab > div.active {
  background: rgb(255, 128, 0);
}
.side-bar .content {
  width: 100%;
  height: calc(100% - 30px);
  background: rgb(71, 141, 205);
  padding: 10px 10px 0 10px;
  overflow: auto;
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
.side-bar .content > .task {
  width: 100%;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  padding-bottom: 5px;
  position: relative;
}
.side-bar .content > .task > .remove-btn {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: -5px;
  right: -5px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.side-bar .content > .task > .remove-btn::before {
  content: "\2716";
}
.side-bar .content > .task > .pause-btn {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 50%;
  background: rgb(98, 233, 104);
  position: absolute;
  top: 25px;
  right: -5px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.side-bar .content > .task > .pause-btn::before {
  content: "\25a0";
}
.side-bar .content > .task > .pause-btn.active::before {
  content: "\25b6";
}
.side-bar .content > .task > .line {
  display: flex;
  padding: 5px 5px 0 5px;
}
.side-bar .content > .task > .line > span:nth-child(1) {
  flex: 1
}
.side-bar .content > .task > .line > span:nth-child(2) {
  flex: 3
}
</style>
