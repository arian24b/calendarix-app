// This is a local service since the API doesn't have alarm endpoints
// We'll use localStorage for now, but this could be replaced with API calls in the future

export interface Alarm {
  id: string
  time: string
  label: string
  isActive: boolean
  days: string[]
}

export function getAlarms(): Alarm[] {
  if (typeof window === "undefined") return []

  const savedAlarms = localStorage.getItem("alarms")
  if (savedAlarms) {
    return JSON.parse(savedAlarms)
  }

  // Default alarms
  const defaultAlarms: Alarm[] = [
    {
      id: "1",
      time: "6 : 00",
      label: "breakfast time!",
      isActive: true,
      days: ["Tomorrow-Thu,Sep 2"],
    },
    {
      id: "2",
      time: "6 : 00",
      label: "breakfast time!",
      isActive: true,
      days: ["Tomorrow-Thu,Sep 2"],
    },
  ]

  localStorage.setItem("alarms", JSON.stringify(defaultAlarms))
  return defaultAlarms
}

export function saveAlarm(alarm: Alarm): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = [...alarms, alarm]
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms))
  return updatedAlarms
}

export function updateAlarm(id: string, updates: Partial<Alarm>): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, ...updates } : alarm))
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms))
  return updatedAlarms
}

export function deleteAlarm(id: string): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.filter((alarm) => alarm.id !== id)
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms))
  return updatedAlarms
}

export function toggleAlarm(id: string): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm))
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms))
  return updatedAlarms
}
