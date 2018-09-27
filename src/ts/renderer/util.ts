import { Station, Train } from './client'

export function getDate (t?: Date): string {
  if (!t) t = new Date()
  const y = t.getFullYear()
  const m = t.getMonth() + 1
  const d = t.getDate()
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
}

export function getDays (yearAndMonth: string): number {
  const [year, month] = yearAndMonth.split('-')
  return new Date(Number(year), Number(month), 0).getDate()
}

export function sleep (ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

export function parseStationName (stationNameString: string) {
  const stringStations = stationNameString.split('@').slice(1)
  const objectStasions: Station[] = []
  for (let i = 0; i < stringStations.length; i++) {
    const [, name, code, fullSpelling, initialSpelling, index] = stringStations[i].split('|')
    objectStasions[i] = { name, code, fullSpelling, initialSpelling, index: Number(index) }
  }
  return objectStasions
}

export type SeatType = 'A' | 'F' | '9' | 'P' | 'S' | 'M' | 'O' | '6' | '4' | '3' | '2' | '1'

export const seatTypeMap: {
  [key: string]: {
    name: string
    code: keyof Train
    index: number
  }
} = {
  'A': {
    name: '高级动卧',
    code: 'gjdw',
    index: 20
  },
  'F': {
    name: '动卧',
    code: 'dw',
    index: 33
  },
  '9': {
    name: '商务座',
    code: 'swz',
    index: 32
  },
  'P': {
    name: '特等座',
    code: 'tdz',
    index: 25
  },
  'S': {
    name: '一等包座',
    code: 'ydbz',
    index: 27
  },
  'M': {
    name: '一等座',
    code: 'ydz',
    index: 31
  },
  'O': {
    name: '二等座',
    code: 'edz',
    index: 30
  },
  '6': {
    name: '高级软卧',
    code: 'gjrw',
    index: 21
  },
  '4': {
    name: '软卧',
    code: 'rw',
    index: 23
  },
  '3': {
    name: '硬卧',
    code: 'yw',
    index: 28
  },
  '2': {
    name: '软座',
    code: 'rz',
    index: 24
  },
  '1': {
    name: '硬座',
    code: 'yz',
    index: 29
  }
}
