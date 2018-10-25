import request from './request'
import { sleep, parseStationName, seatTypeMap } from './util'

export interface StationObject {
  stations: Station[]
  stationMap: {
    [key: string]: string
  }
}

export type User = {
  username: string,
  name: string,
  passengers: PassengerDTO[]
} | null

function res (err: Error, data?: null): { err: Error; data: null }
function res<T = any> (err: null, data: T): { err: null; data: T }

function res (err: Error | null, data = null) {
  return { err, data }
}

class Client {
  // 初始化页面，用于获取查票地址
  private static readonly INIT = '/otn/leftTicket/init'
  // 验证码图片
  private static readonly CAPTCHA_IMAGE = () => `/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&${Math.random()}`
  // 验证码校验
  private static readonly CAPTCHA_CHECK = '/passport/captcha/captcha-check'
  // 登录
  private static readonly LOGIN = '/passport/web/login'
  // 获取token
  private static readonly AUTH_UAMTK = '/passport/web/auth/uamtk'
  // 验证登录
  private static readonly AUTH_CLIENT = '/otn/uamauthclient'
  // 退出登录
  private static readonly LOGOUT = '/otn/login/loginOut'
  // 获取联系人
  private static readonly GET_PASSENGER = '/otn/confirmPassenger/getPassengerDTOs'
  // 获取所有站名
  private static readonly STATION_NAME = '/otn/resources/js/framework/station_name.js'
  // 查询余票
  private static leftTicketQuery = ''
  // 订单的提交请求
  private static readonly SUBMIT_ORDER_REQUEST = '/otn/leftTicket/submitOrderRequest'
  // 获取单程票key
  private static readonly INIT_DC = '/otn/confirmPassenger/initDc'
  // 检查订单
  private static readonly CHECK_ORDER_INFO = '/otn/confirmPassenger/checkOrderInfo'
  // 获取队列和余票信息
  private static readonly GET_QUEUE_COUNT = '/otn/confirmPassenger/getQueueCount'
  // 确认订单
  private static readonly CONFIRM_SINGLE_FOR_QUEUE = '/otn/confirmPassenger/confirmSingleForQueue'
  // 轮询等待时间
  private static readonly QUERY_ORDER_WAIT_TIME = '/otn/confirmPassenger/queryOrderWaitTime'
  // 单程票订单结果
  private static readonly RESULT_ORDER_FOR_DC_QUEUE = '/otn/confirmPassenger/resultOrderForDcQueue'
  // 获取未完成订单
  private static readonly QUERY_MY_ORDER_NO_COMPLETE = '/otn/queryOrder/queryMyOrderNoComplete'
  // 取消未完成订单
  private static readonly CANCEL_NO_COMPLETE_MY_ORDER = '/otn/queryOrder/cancelNoCompleteMyOrder'
  // 查询票价
  private static readonly QUERY_TICKET_PRICE = '/otn/leftTicket/queryTicketPrice'

  private _user: User = null
  private _stationObject: StationObject = {
    stations: [],
    stationMap: {}
  }

  public getUser () {
    return this._user
  }

  public getStations () {
    return this._stationObject
  }

  public async captchaImage () {
    try {
      const { data } = await request<Buffer>({
        method: 'GET',
        encoding: null,
        url: Client.CAPTCHA_IMAGE()
      })
      return res(null, data)
    } catch (err) {
      return res(err)
    }
  }

  private _captchaCheck (answer: string) {
    return request<ResponseData>({
      method: 'POST',
      url: Client.CAPTCHA_CHECK,
      form: {
        answer,
        login_site: 'E',
        rand: 'sjrand'
      }
    })
  }

  private _login (username: string, password: string) {
    return request<{ uamtk?: string } & ResponseData>({
      method: 'POST',
      url: Client.LOGIN,
      form: {
        appid: 'otn',
        username,
        password
      }
    })
  }

  private _authUAMTK () {
    return request<{ apptk?: string | null; newapptk?: string } & ResponseData>({
      method: 'POST',
      url: Client.AUTH_UAMTK,
      form: {
        appid: 'otn'
      }
    })
  }

  private _authClient (tk: string) {
    return request<{ apptk?: string; username?: string } & ResponseData>({
      method: 'POST',
      url: Client.AUTH_CLIENT,
      form: {
        tk
      }
    })
  }

  public async auth () {
    try {
      const uamtkResult = (await this._authUAMTK()).data
      if (uamtkResult.result_code !== 0) {
        this._user = null
        return res(new Error(uamtkResult.result_message))
      }
      const authClientResult = (await this._authClient(uamtkResult.newapptk as string)).data
      if (authClientResult.result_code !== 0) {
        this._user = null
        return res(new Error(authClientResult.result_message))
      }
      return res(null, {
        apptk: authClientResult.apptk as string,
        username: authClientResult.username as string
      })
    } catch (err) {
      return res(err)
    }
  }

  public async verify (username: string, password: string, answer: string) {
    try {
      const checkResult = (await this._captchaCheck(answer)).data
      if (checkResult.result_code !== '4') return res(new Error(checkResult.result_message))
      const loginResult = (await this._login(username, password)).data
      if (loginResult.result_code !== 0) return res(new Error(loginResult.result_message))
      const authResult = await this.auth()
      if (authResult.data) {
        this._user = {
          username: username,
          name: authResult.data.username,
          passengers: []
        }
      }
      return authResult
    } catch (err) {
      return res(err)
    }
  }

  public logout () {
    return request({
      method: 'GET',
      url: Client.LOGOUT
    }).then(() => {
      this._user = null
      return this._authUAMTK()
    }).then(({ data }) => {
      if (data.result_code === 3) {
        return res(null, data)
      } else {
        return res(new Error(data.result_message))
      }
    }).catch(err => {
      return res(err)
    })
  }

  public async getPassenger (passengerName?: string) {
    try {
      const passengerResult = (await request<PassengerResponse>({
        method: 'POST',
        url: Client.GET_PASSENGER,
        form: {
          pageIndex: 1,
          pageSize: 999,
          'passengerDTO.passenger_name': passengerName
        }
      })).data
      if (typeof passengerResult.data !== 'object') return res(new Error('获取乘客失败'))
      if (!passengerResult.data.normal_passengers) {
        return res(new Error(passengerResult.data.exMsg))
      } else {
        if (this._user) this._user.passengers = passengerResult.data.normal_passengers
        return res(null, passengerResult.data.normal_passengers)
      }
    } catch (err) {
      return res(err)
    }
  }

  public async updateStationName () {
    try {
      const jsCode = (await request<string>({
        method: 'GET',
        url: Client.STATION_NAME
      })).data

      const matchResult = jsCode.match(/=\s*['"](.*)['"]/)
      if (!matchResult) return res(new Error('获取站名失败'))
      const jsString = matchResult[1]
      localStorage.setItem('travelerStationName', jsString)

      const objectStations = parseStationName(jsString)

      this._stationObject = objectStations
      return res(null, objectStations)
    } catch (err) {
      return res(err)
    }
  }

  public getStationName () {
    const travelerStationName = localStorage.getItem('travelerStationName')
    if (travelerStationName) {
      const objectStasions = parseStationName(travelerStationName)
      if (!this._stationObject.stations.length) this._stationObject = objectStasions
      return Promise.resolve(res(null, objectStasions))
    }

    return this.updateStationName()
  }

  public async leftTicket (fromStation: string, toStation: string, trainDate: string, purposeCodes?: string) {
    try {
      if (Client.leftTicketQuery === '') {
        const htmlStr: string = (await request<any>({
          method: 'GET',
          url: Client.INIT
        })).data

        const urlMatchArr = htmlStr.match(/CLeftTicketUrl\s*=\s*'(.*)'/) || []
        Client.leftTicketQuery = urlMatchArr.length ? '/otn/' + urlMatchArr[1] : ''
        if (Client.leftTicketQuery === '') {
          return res(new Error('查询余票失败。未找到余票查询地址。'))
        }
      }
      const leftTicketResult = (await request<any>({
        method: 'GET',
        url: Client.leftTicketQuery,
        qs: {
          'leftTicketDTO.train_date': trainDate,
          'leftTicketDTO.from_station': fromStation,
          'leftTicketDTO.to_station': toStation,
          'purpose_codes': purposeCodes || 'ADULT'
        }
      })).data

      if (typeof leftTicketResult === 'string') {
        return res(new Error('查询余票失败'))
      }

      if (leftTicketResult.data.flag !== '1') {
        return res(new Error('查询余票失败。flag = ' + leftTicketResult.data.flag))
      }

      if (!leftTicketResult.data.result || !leftTicketResult.data.result.length) return res(null, [])

      const result: Train[] = []
      for (let i = 0; i < leftTicketResult.data.result.length; i++) {
        const dataArr = leftTicketResult.data.result[i].split('|')
        const code = dataArr[3]
        const seatTypes = dataArr[35]

        const train: Train = {
          secret: dataArr[0],
          code,
          seatTypes,
          type: code[0],
          trainNo: dataArr[2],
          fromCode: dataArr[6],
          toCode: dataArr[7],
          fromTime: dataArr[8],
          toTime: dataArr[9],
          duration: dataArr[10],
          canWebBuy: dataArr[11] === 'Y',
          ypInfo: dataArr[12],
          locationCode: dataArr[15],
          remark: dataArr[1],
          fromStationNo: dataArr[16],
          toStationNo: dataArr[17]
        }

        for (let j = 0; j < seatTypes.length; j++) {
          let type = seatTypes[j]
          if (seatTypeMap[type]) {
            if (type === '1') {
              if (!train.yz) train.yz = dataArr[29]
              else train.wz = dataArr[26]
            } else {
              let code = seatTypeMap[type].code
              if (!train[code]) {
                train[code] = dataArr[seatTypeMap[type].index]
              }
            }
          } else {
            if (!train.qt) train.qt = dataArr[22]
          }
        }

        result.push(train)
      }

      return res(null, result)
    } catch (err) {
      return res(err)
    }
  }

  /**
   * 请求下单
   * @param secretStr decodeURIComponent(车次[0])
   * @param trainDate 出发日期 格式：2018-09-26
   * @param backTrainDate 当前查询日期或返程日期
   * @param queryFromStationName 出发站中文名
   * @param queryToStationName 到达站中文名
   * @param purposeCodes 默认成人票ADULT，学生票0X00
   * @param tourFlag 默认单程dc，往返wc
   */
  private _submitOrderRequest (secretStr: string,
                               trainDate: string,
                               backTrainDate: string,
                               queryFromStationName: string,
                               queryToStationName: string,
                               purposeCodes: string = 'ADULT',
                               tourFlag: string = 'dc') {
    return request<SubmitOrderResponse>({
      method: 'POST',
      url: Client.SUBMIT_ORDER_REQUEST,
      form: {
        secretStr,
        train_date: trainDate,
        back_train_date: backTrainDate,
        tour_flag: tourFlag,
        purpose_codes: purposeCodes,
        query_from_station_name: queryFromStationName,
        query_to_station_name: queryToStationName
      }
    })
  }

  public async submitOrderRequest (secretStr: string,
                                   trainDate: string,
                                   backTrainDate: string,
                                   queryFromStationName: string,
                                   queryToStationName: string) {
    try {
      const response = await this._submitOrderRequest(secretStr, trainDate, backTrainDate, queryFromStationName, queryToStationName)
      if (response.res.statusCode === 302) {
        this._user = null
        return res(new Error('请重新登录'))
      }
      const submitOrderRequestResult = response.data
      if (!submitOrderRequestResult.status) {
        const message = submitOrderRequestResult.messages[0]
        if (-1 !== message.indexOf('未处理')) {
          return res(new Error('提交订单请求失败。您还有未处理的订单，请先前往官网或手机APP处理'))
        }
        return res(new Error('提交订单请求失败。' + submitOrderRequestResult.messages[0]))
      }
      return res(null, submitOrderRequestResult.data)
    } catch (err) {
      return res(err)
    }
  }

  private async _getTokenDC () {
    const htmlStr = (await request<string>({
      method: 'GET',
      url: Client.INIT_DC
    })).data

    // console.log(htmlStr)
    const matchGlobalRepeatSubmitToken = htmlStr.match(/globalRepeatSubmitToken\s*=\s*['"](.*)['"]/)
    const matchTicketInfoForPassengerForm = htmlStr.match(/ticketInfoForPassengerForm\s*=\s*({.*})\s*;/)
    console.log({ matchGlobalRepeatSubmitToken, matchTicketInfoForPassengerForm })
    if (!matchGlobalRepeatSubmitToken || !matchTicketInfoForPassengerForm) throw new Error('获取token失败，请检查是否登录或稍后重试')

    const globalRepeatSubmitToken = matchGlobalRepeatSubmitToken[1]
    const keyCheckIsChange: string = JSON.parse(matchTicketInfoForPassengerForm[1].replace(/'/g, '"')).key_check_isChange
    return { globalRepeatSubmitToken, keyCheckIsChange }
  }

  public async getTokenDC () {
    try {
      const { globalRepeatSubmitToken, keyCheckIsChange } = await this._getTokenDC()
      return res(null, { globalRepeatSubmitToken, keyCheckIsChange })
    } catch (err) {
      return res(err)
    }
  }

  private _checkOrderInfo (repeatSubmitToken: string,
                           passengerTicketStr: string,
                           oldPassengerStr: string,
                           tourFlag: string = 'dc',
                           randCode: string = '',
                           jsonAtt: string = '',
                           cancelFlag: any = '2',
                           bedLevelOrderNum: string = '000000000000000000000000000000') {
    return request<CheckOrderInfoResponse>({
      method: 'POST',
      url: Client.CHECK_ORDER_INFO,
      form: {
        cancel_flag: cancelFlag,
        bed_level_order_num: bedLevelOrderNum,
        passengerTicketStr,
        oldPassengerStr,
        tour_flag: tourFlag,
        randCode,
        _json_att: jsonAtt,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken,
        whatsSelect: '1'
      }
    })
  }

  public async checkOrderInfo (repeatSubmitToken: string, passengerTicketStr: string, oldPassengerStr: string) {
    try {
      const checkOrderInfoResult = (await this._checkOrderInfo(repeatSubmitToken, passengerTicketStr, oldPassengerStr)).data
      if (!checkOrderInfoResult.status) return res(new Error('检查订单失败。' + checkOrderInfoResult.messages[0]))
      if (!checkOrderInfoResult.data.submitStatus) return res(new Error(checkOrderInfoResult.data.errMsg))
      if (checkOrderInfoResult.data.ifShowPassCode === 'Y') return res(new Error('需要验证码，暂时不支持'))

      return res(null, checkOrderInfoResult.data)
    } catch (err) {
      return res(err)
    }
  }

  private _getQueueCount (repeatSubmitToken: string, train: Train, trainDate: string, seatType: string, purposeCodes: string = '00', jsonAtt: string = '') {
    const currentDate = new Date()
    const arrDate = trainDate.split('-')

    currentDate.setFullYear(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]))

    return request<GetQueueCountResponse>({
      method: 'POST',
      url: Client.GET_QUEUE_COUNT,
      form: {
        train_date: currentDate.toString(),
        train_no: train.trainNo,
        stationTrainCode: train.code,
        seatType: seatType,
        fromStationTelecode: train.fromCode,
        toStationTelecode: train.toCode,
        leftTicket: train.ypInfo,
        train_location: train.locationCode,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken,
        purpose_codes: purposeCodes,
        _json_att: jsonAtt
      }
    })
  }

  public async getQueueCount (repeatSubmitToken: string, train: Train, trainDate: string, seatType: string) {
    try {
      const getQueueCountResult = (await this._getQueueCount(repeatSubmitToken, train, trainDate, seatType)).data
      if (!getQueueCountResult.status) return res(new Error('获取剩余票数失败。' + getQueueCountResult.messages[0]))
      if (getQueueCountResult.data.op_2 === 'true') return res(new Error(`排队人数${getQueueCountResult.data.countT}超过剩余票数`))
      return res(null, getQueueCountResult.data)
    } catch (err) {
      return res(err)
    }
  }

  private _confirmSingleForQueue (repeatSubmitToken: string,
                                  train: Train,
                                  passengerTicketStr: string,
                                  oldPassengerStr: string,
                                  key: string,
                                  chooseSeats: string = '',
                                  randCode: string = '',
                                  purposeCodes: string = '00',
                                  jsonAtt: string = '') {
    return request<ConfirmSingleForQueueResponse>({
      method: 'POST',
      url: Client.CONFIRM_SINGLE_FOR_QUEUE,
      form: {
        passengerTicketStr: passengerTicketStr,
        oldPassengerStr: oldPassengerStr,
        randCode: randCode,
        purpose_codes: purposeCodes,
        key_check_isChange: key,
        leftTicketStr: train.ypInfo,
        train_location: train.locationCode,
        choose_seats: chooseSeats,
        seatDetailType: '',
        whatsSelect: '1',
        roomType: '00',
        dwAll: 'N',
        _json_att: jsonAtt,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken
      }
    })
  }

  public async confirmSingleForQueue (repeatSubmitToken: string, train: Train, passengerTicketStr: string, oldPassengerStr: string, key: string) {
    try {
      const confirmSingleForQueueResult = (await this._confirmSingleForQueue(repeatSubmitToken, train, passengerTicketStr, oldPassengerStr, key)).data
      if (!confirmSingleForQueueResult.status) return res(new Error('确认订单失败。' + confirmSingleForQueueResult.messages[0]))
      if (!confirmSingleForQueueResult.data.submitStatus) return res(new Error(confirmSingleForQueueResult.data.errMsg))
      return res(null, confirmSingleForQueueResult.data)
    } catch (err) {
      return res(err)
    }
  }

  private _queryOrderWaitTime (repeatSubmitToken: string, tourFlag: string = 'dc', jsonAtt: string = '') {
    return request<QueryOrderWaitTimeResponse>({
      method: 'GET',
      url: Client.QUERY_ORDER_WAIT_TIME,
      qs: {
        random: (new Date()).getTime().toString(),
        tourFlag,
        _json_att: jsonAtt,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken
      }
    })
  }

  public async queryOrderWaitTime (repeatSubmitToken: string) {
    try {
      const queryOrderWaitTimeResult = (await this._queryOrderWaitTime(repeatSubmitToken)).data
      if (!queryOrderWaitTimeResult.status) return res(new Error('获取等待时间失败。' + queryOrderWaitTimeResult.messages[0]))
      return res(null, queryOrderWaitTimeResult.data)
    } catch (err) {
      return res(err)
    }
  }

  private _resultOrderForDcQueue (repeatSubmitToken: string, orderId: string, jsonAtt: string = '') {
    return request<ResultOrderForDcQueueResponse>({
      method: 'POST',
      url: Client.RESULT_ORDER_FOR_DC_QUEUE,
      form: {
        orderSequence_no: orderId,
        _json_att: jsonAtt,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken
      }
    })
  }

  public async resultOrderForDcQueue (repeatSubmitToken: string, orderId: string) {
    try {
      const resultOrderForDcQueueResult = (await this._resultOrderForDcQueue(repeatSubmitToken, orderId)).data
      if (!resultOrderForDcQueueResult.status) return res(new Error('订单结果获取失败。' + resultOrderForDcQueueResult.messages[0]))
      if (!resultOrderForDcQueueResult.data.submitStatus) return res(new Error('订单结果获取失败。' + resultOrderForDcQueueResult.data.errMsg))
      return res(null, resultOrderForDcQueueResult.data)
    } catch (err) {
      return res(err)
    }
  }

  public async queryMyOrderNoComlete (jsonAtt: string = '') {
    try {
      const queryMyOrderNoComleteResult = (await request<QueryMyOrderNoComleteResponse>({
        method: 'POST',
        url: Client.QUERY_MY_ORDER_NO_COMPLETE,
        form: {
          _json_att: jsonAtt
        }
      })).data

      if (!queryMyOrderNoComleteResult.status) return res(new Error(queryMyOrderNoComleteResult.messages[0]))
      return res(null, queryMyOrderNoComleteResult.data.orderDBList)

    } catch (err) {
      return res(err)
    }
  }

  public async cancelNoCompleteMyOrder (orderId: string, cancelFlag: string = 'cancel_order', jsonAtt: string = '') {
    try {
      const cancelNoCompleteMyOrderResult = (await request<any>({
        method: 'POST',
        url: Client.CANCEL_NO_COMPLETE_MY_ORDER,
        form: {
          sequence_no: orderId,
          cancel_flag: cancelFlag,
          _json_att: jsonAtt
        }
      })).data

      if (!cancelNoCompleteMyOrderResult.status) return res(new Error(cancelNoCompleteMyOrderResult.messages[0]))
      return res(null, true)

    } catch (err) {
      return res(err)
    }
  }

  public async queryTicketPrice (train: Train, goDate: string) {
    try {
      const queryTicketPriceResult = (await request<QueryTicketPriceResponse>({
        method: 'GET',
        url: Client.QUERY_TICKET_PRICE,
        qs: {
          train_no: train.trainNo,
          from_station_no: train.fromStationNo,
          to_station_no: train.toStationNo,
          seat_types: train.seatTypes,
          train_date: goDate
        }
      })).data

      if (!queryTicketPriceResult.status) return res(new Error(queryTicketPriceResult.messages[0]))
      return res(null, queryTicketPriceResult.data)
    } catch (err) {
      return res(err)
    }
  }

  /**
   * 下单
   * @param train 车次对象
   * @param trainDate 出发日期字符串
   * @param backTrainDate 当前查询日期或返程日期
   * @param passengers 乘车人数组
   */
  public async doOrder (train: Train, trainDate: string, backTrainDate: string, passengers: PassengerDTO[]) {

    let fromName: string = this._stationObject.stationMap[train.fromCode]
    let toName: string = this._stationObject.stationMap[train.toCode]

    let submitOrderResult: SubmitOrderResponse
    try {
      let tmp = await this._submitOrderRequest(decodeURIComponent(train.secret), trainDate, backTrainDate, fromName, toName)
      submitOrderResult = tmp.data
    } catch (err) {
      return res(err)
    }
    console.log('SubmitOrder')
    console.log(submitOrderResult)

    if (!submitOrderResult.status) return res(new Error('提交订单请求失败。' + submitOrderResult.messages[0]))

    let globalRepeatSubmitToken: string = ''
    let keyCheckIsChange: string = ''

    try {
      const tokens = await this._getTokenDC()
      globalRepeatSubmitToken = tokens.globalRepeatSubmitToken
      keyCheckIsChange = tokens.keyCheckIsChange
    } catch (err) {
      return res(err)
    }

    let passengerTicketStr: string[] = []
    let oldPassengerStr: string[] = []
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i]
      passengerTicketStr.push(
        `${passenger.seatType
        },0,${passenger.passenger_type
        },${passenger.passenger_name
        },${passenger.passenger_id_type_code
        },${passenger.passenger_id_no
        },${passenger.mobile_no},N`
      )
      oldPassengerStr.push(
        `${passenger.passenger_name
        },${passenger.passenger_id_type_code
        },${passenger.passenger_id_no
        },${passenger.passenger_type}_`
      )
    }

    let checkOrderInfoResult: CheckOrderInfoResponse
    try {
      checkOrderInfoResult = (await this._checkOrderInfo(globalRepeatSubmitToken, passengerTicketStr.join('_'), oldPassengerStr.join(''))).data
    } catch (err) {
      return res(err)
    }
    if (!checkOrderInfoResult.status) return res(new Error('提交订单请求失败。' + checkOrderInfoResult.messages[0]))
    if (!checkOrderInfoResult.data.submitStatus) return res(new Error(checkOrderInfoResult.data.errMsg))
    console.log('CheckOrderInfo')
    console.log(checkOrderInfoResult)

    let getQueueCountResult: GetQueueCountResponse
    try {
      getQueueCountResult = (await this._getQueueCount(globalRepeatSubmitToken, train, trainDate, passengers[0].seatType || '1')).data
    } catch (err) {
      return res(err)
    }
    console.log('GetQueueCount')
    console.log(getQueueCountResult)

    let confirmSingleForQueueResult: ConfirmSingleForQueueResponse
    try {
      confirmSingleForQueueResult = (await this._confirmSingleForQueue(globalRepeatSubmitToken, train, passengerTicketStr.join('_'), oldPassengerStr.join(''), keyCheckIsChange)).data
    } catch (err) {
      return res(err)
    }
    if (!confirmSingleForQueueResult.status) return res(new Error('提交订单请求失败。' + confirmSingleForQueueResult.messages[0]))
    if (!confirmSingleForQueueResult.data.submitStatus) return res(new Error(confirmSingleForQueueResult.data.errMsg))
    console.log('ConfirmSingleForQueue')
    console.log(confirmSingleForQueueResult)

    let orderId = ''
    while (true) {
      let queryOrderWaitTimeResule: QueryOrderWaitTimeResponse
      try {
        queryOrderWaitTimeResule = (await this._queryOrderWaitTime(globalRepeatSubmitToken)).data
      } catch (err) {
        console.log(err)
        await sleep(3000)
        continue
      }
      console.log('QueryOrderWaitTime')
      console.log(queryOrderWaitTimeResule)

      if (!queryOrderWaitTimeResule.status) {
        await sleep(3000)
        continue
      }
      if (!queryOrderWaitTimeResule.data.orderId) {
        await sleep(3000)
        continue
      } else {
        orderId = queryOrderWaitTimeResule.data.orderId
        break
      }
    }

    let resultOrderForDcQueueResult: ResultOrderForDcQueueResponse
    try {
      resultOrderForDcQueueResult = (await this._resultOrderForDcQueue(globalRepeatSubmitToken, orderId)).data
    } catch (err) {
      return res(err)
    }
    if (!resultOrderForDcQueueResult.status) return res(new Error('订单确认失败'))
    if (!resultOrderForDcQueueResult.data.submitStatus) return res(new Error('订单确认失败。' + resultOrderForDcQueueResult.data.errMsg))
    return res(null, orderId)
  }
}

export default Client
