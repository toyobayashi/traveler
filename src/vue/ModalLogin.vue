<template>
<Modal :show="show" :width="400">
  <span slot="header">登录</span>
  <div>
    <div class="flex-between input-line"><span>登录名：</span><InputText style="width: 230px" v-focus="show" v-model="username" placeholder="用户名 / 邮箱 / 手机号" /></div>
    <div class="flex-between input-line"><span>密码：</span><InputText style="width: 230px" type="password" v-model="password" /></div>
  </div>
  <div class="text-center">
    <div class="canvas-wrap">
      <canvas
        v-canvas-init
        class="verify"
        ref="verify"
        width="293px"
        height="190px"
        @click="verifyClick"></canvas>
      <img src="../../res/loading.gif" class="loading" v-show="loading" />
      <img
        class="mark"
        src="../../res/mark.png"
        v-for="p in point"
        :key="p"
        @click="removeMark(p)"
        :style="{
          top: (Number(p.split(',')[1]) + 17 + 2) + 'px',
          left: (Number(p.split(',')[0]) - 13 + 2) + 'px'
        }" />
    </div>
  </div>
  <div slot="footer" class="flex-around">
    <Button @click.native="captchaImage">换一张</Button>
    <Button @click.native="close">关闭</Button>
    <Button color="orange" @click.native="verify">登录</Button>
  </div>
</Modal>
</template>

<script lang="ts" src="../ts/renderer/v-modal-login.ts">
</script>

<style scoped>
.verify {
  border: 2px solid rgb(227, 225, 222);
}
.input-line {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  margin: 0 32px 10px 32px;
}
.canvas-wrap {
  position: relative;
  display: inline-block;
}
.canvas-wrap > .mark {
  position: absolute;
  display: block;
}
.canvas-wrap > .loading {
  display: block;
  width: 48px;
  height: 48px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
