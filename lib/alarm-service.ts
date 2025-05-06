// Since there's no alarm API in the OpenAPI spec, we'll use localStorage
// In a real app, you would create a custom API endpoint for alarms

// Type definitions
export interface Alarm {
  id: string
  time: string
  label: string
  isActive: boolean
  repeat: string[]
  sound: string
}

const ALARMS_STORAGE_KEY = "timesync_alarms"

// Get all alarms from localStorage
export function getAlarms(): Alarm[] {
  if (typeof window === "undefined") return []

  const storedAlarms = localStorage.getItem(ALARMS_STORAGE_KEY)
  return storedAlarms ? JSON.parse(storedAlarms) : []
}

// Save alarms to localStorage
export function saveAlarms(alarms: Alarm[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms))
}

// Add a new alarm
export function addAlarm(alarm: Alarm): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = [...alarms, alarm]
  saveAlarms(updatedAlarms)
  return updatedAlarms
}

// Update an existing alarm
export function updateAlarm(id: string, updatedAlarm: Partial<Alarm>): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, ...updatedAlarm } : alarm))
  saveAlarms(updatedAlarms)
  return updatedAlarms
}

// Delete an alarm
export function deleteAlarm(id: string): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.filter((alarm) => alarm.id !== id)
  saveAlarms(updatedAlarms)
  return updatedAlarms
}

// Toggle alarm active state
export function toggleAlarm(id: string): Alarm[] {
  const alarms = getAlarms()
  const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm))
  saveAlarms(updatedAlarms)
  return updatedAlarms
}
