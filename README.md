# 妥拉别喇

## 怎么跑

1. 安装 [Git](https://git-scm.com/)
2. 安装 [Node.js](https://nodejs.org/en/)
3. 拉代码
    ``` bash
    $ git clone https://github.com/toyobayashi/traveler.git
    $ cd traveler
    ```
4. 运行 npm 脚本
    ``` bash
    # 设置某宝镜像
    $ npm config set registry http://registry.npm.taobao.org/
    $ npm config set electron_mirror https://npm.taobao.org/mirrors/electron/

    # 安装依赖
    $ npm install

    # 启动开发环境
    $ npm run dev

    # 打包生产环境代码
    $ npm run prod

    # 启动应用
    $ npm start
    ```
