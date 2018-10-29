import { Vue, Component } from 'vue-property-decorator'
import { seatTypeMap } from './util'

@Component
export default class extends Vue {
  show: boolean = false
  taskList: TaskObject[] = []

  toggle () {
    this.show = !this.show
    if (this.show) {
      document.addEventListener('click', this.toggleListener, false)
    } else {
      document.removeEventListener('click', this.toggleListener, false)
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

  toggleListener (ev: MouseEvent) {
    if (!this.$el.contains(ev.target as any)) {
      if (this.show) this.show = false
    }
  }

  mounted () {
    this.$nextTick(() => {
      this.bus.$on('getTaskList', (callback: (taskList: TaskObject[]) => void) => {
        callback(this.taskList)
      })
      this.bus.$on('addTask', (task: TaskObject) => {
        const _this = this
        async function watchHandler () {
          if (!_this.client.getUser()) {
            task.status = '请先登录'
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
                task.status = '有票'
                // TODO
              } else {
                task.count++
                task.status = `已监控${task.count}次`
                task.timer = window.setTimeout(watchHandler, 3000)
              }
            } else {
              task.count++
              task.status = `已监控${task.count}次`
              task.timer = window.setTimeout(watchHandler, 3000)
            }
          } else {
            task.count++
            task.status = `已监控${task.count}次`
            task.timer = window.setTimeout(watchHandler, 3000)
          }
        }

        task.timer = window.setTimeout(watchHandler, 0)
        this.taskList.push(task)
      })
    })
  }
}

export interface TaskObject {
  train: Train
  trainDate: string
  backTrainDate: string
  passengers: PassengerDTO[]
  passengersString: string
  status: string
  count: number
  timer: number
  id: string
}
