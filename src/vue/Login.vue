<template>
<div>
  <div>
    <div>用户名：<input type="text" v-model="username"/></div>
    <div>密码：<input type="password" v-model="password"/></div>
  </div>
  <div><canvas class="verify" ref="verify" width="293px" height="190px" @click="verifyClick"></canvas></div>
  <button @click="captchaImage">换一张</button>
  <button @click="verify">登录</button>
  <button @click="auth">检查</button>
  <button @click="logout">退出</button>
  <button @click="getPassenger">获取乘客</button>
</div>
</template>

<script lang="ts" src="../ts/login.ts">
</script>

<style scoped>
.verify {
  border: 1px solid #000;
}
</style>

