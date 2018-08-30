<template>
<div class="header flex-between">
  <div>{{status}}</div>
  <div><span style="margin-right: 20px">{{(user && user.name) || '未登录'}}</span><Button color="orange" width="50" v-if="!user" @click.native="login" :disabled="loginBtnDisabled">登录</Button><Button v-else @click.native="logout" :disabled="logoutBtnDisabled">退出</Button></div>
</div>
</template>

<script lang="ts" src="../ts/the-header.ts">
</script>

<style scoped>
.header {
  background-color: rgb(71, 141, 205);
  height: 30px;
  width: calc(100% - 20px);
  position: absolute;
  top: 0;
  padding: 0 10px;
  color: rgb(229, 248, 255);
  line-height: 30px;
  font-size: 14px;
}
</style>
