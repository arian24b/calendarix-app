"use client"
import { Switch } from "@/components/ui/switch"

interface Alarm {
  id: string
  time: string
  days: string[]
  enabled: boolean
}

interface AlarmListProps {
  alarms: Alarm[]
  onToggle: (id: string, enabled: boolean) => void
  onEdit: (id: string) => void
}

export function AlarmList({ alarms, onToggle, onEdit }: AlarmListProps) {
  return (
    <div className="space-y-4">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-[#f1f5f9]"
          onClick={() => onEdit(alarm.id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">{alarm.time}</p>
              <p className="text-sm text-[#64748b]">{alarm.days.join(", ")}</p>
            </div>
            <Switch
              checked={alarm.enabled}
              onCheckedChange={(checked) => onToggle(alarm.id, checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

