export function toLocalDate(date: string | Date) {
  if (date instanceof Date) {
    const copy = new Date(date)
    copy.setHours(12, 0, 0, 0)
    return copy
  }

  return new Date(`${date}T12:00:00`)
}

export function daysBetween(date: string | Date, today = new Date()) {
  const target = toLocalDate(date)
  const current = toLocalDate(today)
  return Math.round((target.getTime() - current.getTime()) / 86_400_000)
}

export function isSameMonth(date: string, base = new Date()) {
  const current = toLocalDate(date)
  return current.getMonth() === base.getMonth() && current.getFullYear() === base.getFullYear()
}

export function endOfCurrentMonth(today = new Date()) {
  return new Date(today.getFullYear(), today.getMonth() + 1, 0, 12, 0, 0, 0)
}

export function nextFriday(today = new Date()) {
  const current = toLocalDate(today)
  const day = current.getDay()
  const diff = (5 - day + 7) % 7
  current.setDate(current.getDate() + diff)
  return current
}

export function monthLabel(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date)
}
