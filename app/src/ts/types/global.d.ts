interface ResponseData {
  result_code: string | number
  result_message: string
}

interface PassengerDTO {
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

interface HttpResponse {
  httpstatus: number
  status: boolean
  validateMessages: any
  validateMessagesShowId: string
  messages: any[]
  data: any
}

interface PassengerResponse extends HttpResponse {
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

interface SubmitOrderResponse extends HttpResponse {
  data: string
}

interface CheckOrderInfoResponse extends HttpResponse {
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

interface GetQueueCountResponse extends HttpResponse {
  data: {
    count: string
    ticket: string
    op_2: string // 排队人数 是否大于 剩余票数
    countT: string // 排队人数
    op_1: string
  }
}

interface ConfirmSingleForQueueResponse extends HttpResponse {
  data: {
    submitStatus: boolean
    errMsg?: string
  }
}

interface QueryOrderWaitTimeResponse extends HttpResponse {
  data: {
    queryOrderWaitTimeStatus: boolean
    count: number
    waitTime: number
    requestId: number
    waitCount: number
    tourFlag: string
    orderId: string | null
    msg?: string
  }
}

interface ResultOrderForDcQueueResponse extends HttpResponse {
  data: {
    submitStatus: boolean
    errMsg?: string
  }
}

interface QueryTicketPriceResponse extends HttpResponse {
  data: {
    OT: any[]
    train_no: string
    WZ?: string
    '1'?: string
    '3'?: string
    '4'?: string
    A1?: string
    A3?: string
    A4?: string
    [x: string]: any
  }
}

interface UncompletedOrder {
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
}

interface QueryMyOrderNoComleteResponse extends HttpResponse {
  data: {
    orderDBList: Array<UncompletedOrder>
    to_page: string
  }
}

interface Station {
  name: string
  code: string
  fullSpelling: string
  initialSpelling: string
  index: number
}

interface Train {
  secret: string
  code: string
  seatTypes: string
  type: string
  trainNo: string
  fromCode: string
  fromName: string
  toCode: string
  toName: string
  fromTime: string
  toTime: string
  duration: string
  canWebBuy: boolean
  ypInfo: string
  locationCode: string
  remark: string
  fromStationNo: string
  toStationNo: string
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
