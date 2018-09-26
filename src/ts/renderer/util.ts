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
