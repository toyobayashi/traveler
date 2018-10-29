<template>
<div class="side-bar" :class="{ show: show }">
  <div class="toggle-button" @click="toggle"><span>任</span><span>务</span></div>
  <div class="content">
    <div class="task" v-for="task in taskList" :key="task.id">
      <div class="line"><span>车次：</span><span>{{task.train.code + ' ' + task.train.fromName + ' - ' + task.train.toName}}</span></div>
      <div class="line"><span>出发：</span><span>{{task.trainDate + ' ' + task.train.fromTime}}</span></div>
      <div class="line"><span>乘客：</span><span>{{task.passengersString}}</span></div>
      <div class="line"><span>状态：</span><span>{{task.status}}</span></div>
      <div class="remove-btn" @click="removeTask(task)"></div>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/renderer/v-the-side-bar.ts">
</script>

<style scoped>
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
.side-bar .content {
  width: 100%;
  height: 100%;
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
