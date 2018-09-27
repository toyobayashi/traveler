import request from './request'
import { sleep } from './util'

export interface ResponseData {
  result_code: string | number
  result_message: string
}

export interface PassengerDTO {
  address: string
  born_date: string
  code: string
  country_code: string
  email: string
  first_letter: string
  index_id: string
  mobile_no: string
  passenger_flag: string
  passenger_id_no: string
  passenger_id_type_code: string
  passenger_id_type_name: string
  passenger_name: string
  passenger_type: string
  passenger_type_name: string
  phone_no: string
  postalcode: string
  recordCount: string
  sex_code: string
  sex_name: string
  total_times: string
  seatType?: string
}

export interface HttpResponse {
  httpstatus: number
  status: boolean
  validateMessages: any
  validateMessagesShowId: string
  messages: any[]
  data: any
}

export interface PassengerResponse extends HttpResponse {
  data: {
    dj_passengers: any[] | null
    exMsg: string
    isExist: boolean
    noLogin?: string
    normal_passengers: PassengerDTO[] | null
    other_isOpenClick?: string[]
    two_isOpenClick?: string[]
  }
}

export interface SubmitOrderResponse extends HttpResponse {
  data: any
}

export interface CheckOrderInfoResponse extends HttpResponse {
  data: {
    ifShowPassCode: string
    ifShowPassCodeTime: string
    canChooseBeds: string
    canChooseSeats: string
    choose_Seats: string
    isCanChooseMid: string
    submitStatus: boolean
    smokeStr: string
    errMsg?: string
  }
}

export interface GetQueueCountResponse extends HttpResponse {
  data: {
    count: string
    ticket: string
    op_2: string // 排队人数 是否大于 剩余票数
    countT: string // 排队人数
    op_1: string
  }
}

export interface ConfirmSingleForQueueResponse extends HttpResponse {
  data: {
    submitStatus: boolean
    errMsg?: string
  }
}

export interface QueryOrderWaitTimeResponse extends HttpResponse {
  data: {
    queryOrderWaitTimeStatus: boolean
    count: number
    waitTime: number
    requestId: number
    waitCount: number
    tourFlag: string
    orderId: string | null
    errMsg?: string
  }
}

export interface ResultOrderForDcQueueResponse extends HttpResponse {
  data: {
    submitStatus: boolean
    errMsg?: string
  }
}

export interface QueryMyOrderNoComleteResponse extends HttpResponse {
  data: {
    orderDBList: Array<{
      [x: string]: any
      array_passser_name_page: string[]
      arrive_time_page: string
      canOffLinePay: string
      cancel_flag: string
      come_go_traveller_order_page: string
      confirm_flag: string
      from_station_name_page: string[]
      if_deliver: string
      if_show_resigning_info: string
      insure_query_no: string
      isNeedSendMailAndMsg: string
      order_date: string
      pay_flag: string
      pay_resign_flag: string
      print_eticket_flag: string
      recordCount: string
      reserve_flag_query: string
      resign_flag: string
      return_flag: string
      sequence_no: string // 订单号
      start_time_page: string
      start_train_date_page: string
      ticket_price_all: number
      ticket_total_price_page: string
      ticket_totalnum: number
      tickets: Array<{
        [x: string]: any
        amount_char: number
        batch_no: string
        cancel_flag: string
        coach_name: string
        coach_no: string
        column_nine_msg: string
        come_go_traveller_ticket_page: string
        confirm_flag: string
        deliver_fee_char: string
        dynamicProp: string
        fee_char: string
        insure_query_no: string
        integral_pay_flag: string
        is_deliver: string
        is_need_alert_flag: false
        lc_flag: string
        limit_time: string
        lose_time: string
        passengerDTO: PassengerDTO
        pay_limit_time: string
        pay_mode_code: string
        print_eticket_flag: string
        reserve_time: string
        resign_flag: string
        return_deliver_flag: string
        return_flag: string
        seat_flag: string
        seat_name: string
        seat_no: string
        seat_type_code: string
        seat_type_name: string
        sequence_no: string
        start_train_date_page: string
        stationTrainDTO: {
          [x: string]: any
          arrive_time: string
          distance: string
          from_station_name: string
          from_station_telecode: string
          start_time: string
          station_train_code: string
          to_station_name: string
          to_station_telecode: string
          trainDTO: {
            [x: string]: any
            train_no: string
          }
        }
        str_ticket_price_page: string
        ticket_no: string // 票号
        ticket_price: number
        ticket_status_code: string
        ticket_status_name: string
        ticket_type_code: string
        ticket_type_name: string
        trade_mode: string
        train_date: string
      }>
      to_station_name_page: string[]
      train_code_page: string
    }>
    to_page: string
  }
}

export interface Station {
  name: string
  code: string
  fullSpelling: string
  initialSpelling: string
  index: number
}

export interface Train {
  secret: string
  code: string
  seatTypes: string
  type: string
  trainNo: string
  fromCode: string
  toCode: string
  fromTime: string
  toTime: string
  duration: string
  status: boolean
  ypInfo: string
  locationCode: string
  remark: string
  gjdw?: string
  dw?: string
  swz?: string
  tdz?: string
  ydbz?: string
  ydz?: string
  edz?: string
  gjrw?: string
  rw?: string
  yw?: string
  rz?: string
  yz?: string
  wz?: string
  qt?: string
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
  private static readonly CAPTCHA_IMAGE = () => `/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&${Math.random()}`
  private static readonly CAPTCHA_CHECK = '/passport/captcha/captcha-check'
  private static readonly LOGIN = '/passport/web/login'
  private static readonly AUTH_UAMTK = '/passport/web/auth/uamtk'
  private static readonly AUTH_CLIENT = '/otn/uamauthclient'
  private static readonly LOGOUT = '/otn/login/loginOut'
  private static readonly GET_PASSENGER = '/otn/confirmPassenger/getPassengerDTOs'
  private static readonly STATION_NAME = '/otn/resources/js/framework/station_name.js'
  private static readonly LEFT_TICKET = '/otn/leftTicket/queryA'
  private static readonly SUBMIT_ORDER_REQUEST = '/otn/leftTicket/submitOrderRequest'
  private static readonly INIT_DC = '/otn/confirmPassenger/initDc'
  private static readonly CHECK_ORDER_INFO = '/otn/confirmPassenger/checkOrderInfo'
  private static readonly GET_QUEUE_COUNT = '/otn/confirmPassenger/getQueueCount'
  private static readonly CONFIRM_SINGLE_FOR_QUEUE = '/otn/confirmPassenger/confirmSingleForQueue'
  private static readonly QUERY_ORDER_WAIT_TIME = '/otn/confirmPassenger/queryOrderWaitTime'
  private static readonly RESULT_ORDER_FOR_DC_QUEUE = '/otn/confirmPassenger/resultOrderForDcQueue'
  private static readonly QUERY_MY_ORDER_NO_COMPLETE = '/otn/queryOrder/queryMyOrderNoComplete'
  private static readonly CANCEL_NO_COMPLETE_MY_ORDER = '/otn/queryOrder/cancelNoCompleteMyOrder'

  private _user: User = null
  private _stationName: Station[] = []

  public getUser () {
    return this._user
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

  private _parseStationName (stationNameString: string) {
    const stringStations = stationNameString.split('@').slice(1)
    const objectStasions: Station[] = []
    for (let i = 0; i < stringStations.length; i++) {
      const [, name, code, fullSpelling, initialSpelling, index] = stringStations[i].split('|')
      objectStasions[i] = { name, code, fullSpelling, initialSpelling, index: Number(index) }
    }
    return objectStasions
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

      const objectStasions = this._parseStationName(jsString)

      this._stationName = objectStasions
      return res(null, objectStasions)
    } catch (err) {
      return res(err)
    }
  }

  public getStationName () {
    const travelerStationName = localStorage.getItem('travelerStationName')
    if (travelerStationName) {
      const objectStasions = this._parseStationName(travelerStationName)
      if (!this._stationName.length) this._stationName = objectStasions
      return Promise.resolve(res(null, objectStasions))
    }

    return this.updateStationName()
  }

  public async leftTicket (fromStation: string, toStation: string, trainDate: string, purposeCodes?: string) {
    try {
      const leftTicketResult = (await request<any>({
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
        url: Client.LEFT_TICKET,
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
          status: dataArr[11] === 'Y',
          ypInfo: dataArr[12],
          locationCode: dataArr[15],
          remark: dataArr[1]
        }

        for (let j = 0; j < seatTypes.length; j++) {
          switch (seatTypes[j]) {
            case 'A': // 高级动卧
              if (!train.gjdw) train.gjdw = dataArr[20]
              break
            case 'F': // 动卧
              if (!train.dw) train.dw = dataArr[33]
              break
            case '9': // 商务座
              if (!train.swz) train.swz = dataArr[32]
              break
            case 'P': // 特等座
              if (!train.tdz) train.tdz = dataArr[25]
              break
            case 'S': // 一等包座
              if (!train.ydbz) train.ydbz = dataArr[27]
              break
            case 'M': // 一等座
              if (!train.ydz) train.ydz = dataArr[31]
              break
            case 'O': // 二等座
              if (!train.edz) train.edz = dataArr[30]
              break
            case '6': // 高级软卧
              if (!train.gjrw) train.gjrw = dataArr[21]
              break
            case '4': // 软卧
              if (!train.rw) train.rw = dataArr[23]
              break
            case '3': // 硬卧
              if (!train.yw) train.yw = dataArr[28]
              break
            case '2': // 软座
              if (!train.rz) train.rz = dataArr[24]
              break
            case '1': // 硬座或无座
              if (!train.yz) train.yz = dataArr[29]
              else train.wz = dataArr[26]
              break
            default: // 其他
              if (!train.qt) train.qt = dataArr[22]
              break
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
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

  private async _getGlobalRepeatSubmitToken () {
    const htmlStr = (await request<string>({
      method: 'GET',
      url: Client.INIT_DC
    })).data

    // console.log(htmlStr)
    const matchGlobalRepeatSubmitToken = htmlStr.match(/globalRepeatSubmitToken\s*=\s*['"](.*)['"]/)
    const matchticketInfoForPassengerForm = htmlStr.match(/ticketInfoForPassengerForm\s*=\s*({.*})\s*;/)
    if (!matchGlobalRepeatSubmitToken || !matchticketInfoForPassengerForm) throw new Error('正则匹配失败，请检查是否登录')

    const globalRepeatSubmitToken = matchGlobalRepeatSubmitToken[1]
    const keyCheckIsChange = JSON.parse(matchticketInfoForPassengerForm[1].replace(/'/g, '"')).key_check_isChange
    return [globalRepeatSubmitToken, keyCheckIsChange]
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
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

  private _getQueueCount (repeatSubmitToken: string, train: Train, trainDate: string, seatType: string, purposeCodes: string = '00', jsonAtt: string = '') {
    const currentDate = new Date()
    const arrDate = trainDate.split('-')

    currentDate.setFullYear(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]))

    return request<GetQueueCountResponse>({
      method: 'POST',
      url: Client.GET_QUEUE_COUNT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
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

  private _resultOrderForDcQueue (repeatSubmitToken: string, orderId: string, jsonAtt: string = '') {
    return request<ResultOrderForDcQueueResponse>({
      method: 'POST',
      url: Client.RESULT_ORDER_FOR_DC_QUEUE,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      form: {
        orderSequence_no: orderId,
        _json_att: jsonAtt,
        REPEAT_SUBMIT_TOKEN: repeatSubmitToken
      }
    })
  }

  public async queryMyOrderNoComlete (jsonAtt: string = '') {
    try {
      const queryMyOrderNoComleteResult = (await request<QueryMyOrderNoComleteResponse>({
        method: 'POST',
        url: Client.QUERY_MY_ORDER_NO_COMPLETE,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
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
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
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

  /**
   * 下单
   * @param train 车次对象
   * @param trainDate 出发日期字符串
   * @param backTrainDate 当前查询日期或返程日期
   * @param passengers 乘车人数组
   */
  public async doOrder (train: Train, trainDate: string, backTrainDate: string, passengers: PassengerDTO[]) {

    let fromName: string = ''
    let toName: string = ''
    for (let i = 0; i < this._stationName.length; i++) {
      if (fromName && toName) break
      if (this._stationName[i].code === train.fromCode) fromName = this._stationName[i].name
      if (this._stationName[i].code === train.toCode) toName = this._stationName[i].name
    }

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
      [globalRepeatSubmitToken, keyCheckIsChange] = await this._getGlobalRepeatSubmitToken()
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
