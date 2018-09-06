export function getDate (): string {
  const t = new Date()
  const y = t.getFullYear()
  const m = t.getMonth() + 1
  const d = t.getDate()
  return `${y}/${m}/${d}`
}

export function getDays (yearAndMonth: string): number {
  const [year, month] = yearAndMonth.split('/')
  return new Date(Number(year), Number(month), 0).getDate()
}
