# 妥拉别喇

12306非官方抢票桌面应用，仅供学习参考交流。

*开发中，暂不提供发布版。*

## 跑源码

### 环境准备

* [Git](https://git-scm.com/)
* [Node.js 8+](https://nodejs.org/en/)

### 快速开始

* 拉代码改镜像装依赖素质三连

    ``` bash
    $ git clone https://github.com/toyobayashi/traveler.git
    $ cd ./traveler/app

    $ npm config set registry http://registry.npm.taobao.org/
    $ npm config set electron_mirror https://npm.taobao.org/mirrors/electron/

    $ npm install
    ```

* 跑开发环境

    ``` bash
    $ npm run dev
    ```

* 打包生产环境代码

    ``` bash
    $ npm run prod
    ```

* 启动应用

    ``` bash
    $ npm start # 或使用 VSCode 打开 app 目录直接按 F5 启动
    ```
