import { Vue, Component, Prop } from 'vue-property-decorator'
import { seatTypeMap } from './util'
import { User } from './client'

@Component
export default class extends Vue {
  show: boolean = false
  taskList: TaskObject[] = getTaskListFromLocalStorage()
  orderList: UncompletedOrder[] = []
  activeTab: 'watch' | 'order' = 'watch'
  orderStatus: string = ''

  get time () {
    return (this.getStoreState('config').time as number) || 1000
  }

  @Prop() user: User

  toggle () {
    this.show = !this.show
    if (this.show) {
      document.addEventListener('click', this.toggleListener, false)
    } else {
      document.removeEventListener('click', this.toggleListener, false)
    }
  }

  tabWatchClicked () {
    this.activeTab = 'watch'
  }

  tabUncompletedOrderClicked () {
    this.activeTab = 'order'
    if (this.client.getUser()) {
      this.orderStatus = '正在查询未完成订单'
      this.client.queryMyOrderNoComlete().then((res) => {
        if (res.data) {
          this.orderList = res.data
          this.orderStatus = '无未完成订单'
        } else {
          console.log(res.err)
          this.orderStatus = '' + res.err
        }
      })
    } else {
      this.orderStatus = '未登录'
    }
  }

  removeTask (task: TaskObject) {
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].id === task.id) {
        window.clearTimeout(task.timer)
        this.taskList.splice(i, 1)
        break
      }
    }
  }

  pauseTask (task: TaskObject) {
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].id === task.id) {
        if (task.status === 0) {
          task.timer = window.setTimeout(this.createWatchHandler(task), 0)
          task.status = 1
        } else {
          window.clearTimeout(task.timer)
          task.status = 0
          task.statusString = '已停止'
        }
        break
      }
    }
  }

  toggleListener (ev: MouseEvent) {
    if (!this.$el.contains(ev.target as any)) {
      if (this.show) this.show = false
    }
  }

  createWatchHandler (task: TaskObject) {
    const _this = this
    return async function watchHandler () {
      if (!_this.client.getUser()) {
        task.statusString = '请先登录'
        task.status = 0
        return
      }
      const res = await _this.client.leftTicket(task.train.fromCode, task.train.toCode, task.trainDate)
      if (res.data) {
        let tr: Train | null = null
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].code === task.train.code) {
            tr = res.data[i]
          }
        }
        if (tr) {
          const seatCount: any = {}
          for (let i = 0; i < task.passengers.length; i++) {
            if (!seatCount[task.passengers[i].seatType as string]) {
              seatCount[task.passengers[i].seatType as string] = 1
            } else {
              seatCount[task.passengers[i].seatType as string]++
            }
          }
          let valid = true
          for (let seatType in seatCount) {
            if (seatType === '1') {
              if (tr.yz === '无' || tr.yz === '--' || tr.yz === '' || Number(tr.yz) < seatCount[seatType]) {
                if (tr.wz === '无' || tr.wz === '--' || tr.wz === '' || Number(tr.wz) < seatCount[seatType]) {
                  valid = false
                }
              }
            } else {
              if (tr[seatTypeMap[seatType].code] === '无' || tr[seatTypeMap[seatType].code] === '--' || tr[seatTypeMap[seatType].code] === '' || Number(tr[seatTypeMap[seatType].code]) < seatCount[seatType]) {
                valid = false
              }
            }
          }
          if (valid) {
            task.status = -1
            if (process.env.NODE_ENV === 'production') {
              const orderResult = await _this.client.placeOrder(task.train, task.trainDate, task.backTrainDate, task.passengers, {
                preSubmitOrderRequest: () => task.statusString = '提交订单请求中',
                preGetTokenDC: () => task.statusString = '正在获取token',
                preCheckOrderResult: () => task.statusString = '正在检查订单',
                preGetQueueCount: () => task.statusString = '正在获取队列信息',
                preConfirmSingleForQueue: () => task.statusString = '正在确认订单',
                preQueryOrderWaitTime: () => task.statusString = '正在等待出票',
                onQueryOrderWaitTime: (leftTime) => task.statusString = '出票处理中：大约剩余' + leftTime + '秒。',
                preResultOrderForDcQueue: () => task.statusString = '正在获取出票结果'
              })

              if (orderResult.err) {
                task.statusString = orderResult.err.toString()
                task.status = 0
                task.timer = window.setTimeout(watchHandler, _this.time)
                return
              }
              task.statusString = '出票成功，订单号为' + orderResult.data + '，请在半小时内前往官方网站或使用APP付款'
            } else {
              task.statusString = '订单已提交，请在半小时内前往官网或手机APP付款'
            }

            let myNotification = new Notification(task.train.code, {
              body: '订单已提交，请在半小时内前往官网或手机APP付款'
            })

            myNotification.onclick = () => {
              _this.electron.shell.openExternal('https://kyfw.12306.cn/otn/login/init')
            }
          } else {
            task.statusString = `已监控${++task.count}次`
            task.timer = window.setTimeout(watchHandler, _this.time)
          }
        } else {
          task.statusString = `已监控${++task.count}次`
          task.timer = window.setTimeout(watchHandler, _this.time)
        }
      } else {
        console.log(res.err)
        task.statusString = `已监控${++task.count}次`
        task.timer = window.setTimeout(watchHandler, _this.time)
      }
    }
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('getTaskList', (callback: (taskList: TaskObject[]) => void) => {
        callback(this.taskList)
      })
      this.bus.$on('addTask', (task: TaskObject) => {
        task.timer = window.setTimeout(this.createWatchHandler(task), 0)
        this.taskList.push(task)
      })
      this.bus.$on('saveTask', () => {
        localStorage.setItem('travelerTaskList', JSON.stringify(this.taskList))
      })
    })
  }
}

function getTaskListFromLocalStorage (): TaskObject[] {
  const ls = localStorage.getItem('travelerTaskList')
  if (!ls) return []
  const taskList = JSON.parse(ls)
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].status !== -1) {
      taskList[i].statusString = '已停止'
      taskList[i].status = 0
    }
  }
  return taskList
}

export interface TaskObject {
  train: Train
  trainDate: string
  backTrainDate: string
  passengers: PassengerDTO[]
  passengersString: string
  status: -1 | 0 | 1
  statusString: string
  count: number
  timer: number
  id: string
}
