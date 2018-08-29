<template>
<div class="root" id="root">
  <TheHeader :user="client.getUser()" :status="status"/>
  <ModalLogin :width="400" />
  <!-- <Login /> -->
</div>
</template>

<script lang="ts" src="../ts/app.ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.root {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Microsoft YaHei';
}

button, input {
  font-family: 'Microsoft YaHei';
}

.modal-wrap {
  position: absolute;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
}

.modal-wrap > .modal {
  background-color: rgb(238, 241,248);
  border: 1px solid rgb(22, 120, 290);
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.modal-wrap .modal-header {
  height: 30px;
  line-height: 30px;
  background: linear-gradient(rgb(56, 156, 216), rgb(22, 120, 290));
  border-bottom: 2px solid rgb(102, 200, 232);
  padding-left: 20px;
  color: rgb(229, 248, 255);
}

.modal-wrap .modal-body {
  padding: 10px 20px;
}

.modal-wrap .modal-footer {
  margin-bottom: 10px;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
}

.flex-around {
  display: flex;
  justify-content: space-around;
}

.text-center {
  text-align: center;
}
</style>
