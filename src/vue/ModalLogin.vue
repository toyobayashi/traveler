<template>
<div class="modal-wrap flex-center" v-show="show">
  <div class="modal" :style="{ width: width + 'px' }">
    <div class="modal-header">登录</div>
    <div class="modal-body">
      <div>
        <div class="flex-between input-line"><span>登录名：</span><InputText style="width: 230px" v-model="username" placeholder="用户名 / 邮箱 / 手机号" /></div>
        <div class="flex-between input-line"><span>密码：</span><InputText style="width: 230px" type="password" v-model="password" /></div>
      </div>
      <div class="text-center">
        <div class="canvas-wrap">
          <canvas
            class="verify"
            ref="verify"
            width="293px"
            height="190px"
            @click="verifyClick"></canvas>
          <img 
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
    </div>
    <div class="modal-footer flex-around">
      <Button @click.native="captchaImage">换一张</Button>
      <Button @click.native="close">关闭</Button>
      <Button color="orange" @click.native="verify">登录</Button>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="../ts/modal-login.ts">
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
.canvas-wrap > img {
  position: absolute;
  display: block;
}
</style>
