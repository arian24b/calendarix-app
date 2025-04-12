"use client"

interface TimePickerProps {
  value: { hour: number; minute: number; period: "AM" | "PM" }
  onChange: (value: { hour: number; minute: number; period: "AM" | "PM" }) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const prevHour = value.hour === 1 ? 12 : value.hour - 1
  const nextHour = value.hour === 12 ? 1 : value.hour + 1

  const prevMinute = value.minute === 0 ? 59 : value.minute - 1
  const nextMinute = value.minute === 59 ? 0 : value.minute + 1

  const handleHourClick = (direction: "up" | "down") => {
    let newHour = value.hour
    if (direction === "up") {
      newHour = value.hour === 12 ? 1 : value.hour + 1
    } else {
      newHour = value.hour === 1 ? 12 : value.hour - 1
    }
    onChange({ ...value, hour: newHour })
  }

  const handleMinuteClick = (direction: "up" | "down") => {
    let newMinute = value.minute
    if (direction === "up") {
      newMinute = value.minute === 59 ? 0 : value.minute + 1
    } else {
      newMinute = value.minute === 0 ? 59 : value.minute - 1
    }
    onChange({ ...value, minute: newMinute })
  }

  const togglePeriod = () => {
    onChange({ ...value, period: value.period === "AM" ? "PM" : "AM" })
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center">
        {/* Hour */}
        <div className="flex flex-col items-center w-24">
          <button
            className="text-4xl text-[#8291ae] opacity-50 w-full h-16 flex items-center justify-center"
            onClick={() => handleHourClick("down")}
          >
            {prevHour}
          </button>
          <div className="text-7xl font-bold my-2">{value.hour}</div>
          <button
            className="text-4xl text-[#8291ae] opacity-50 w-full h-16 flex items-center justify-center"
            onClick={() => handleHourClick("up")}
          >
            {nextHour}
          </button>
        </div>

        {/* Colon */}
        <div className="text-6xl font-bold mx-2">:</div>

        {/* Minute */}
        <div className="flex flex-col items-center w-24">
          <button
            className="text-4xl text-[#8291ae] opacity-50 w-full h-16 flex items-center justify-center"
            onClick={() => handleMinuteClick("down")}
          >
            {prevMinute.toString().padStart(2, "0")}
          </button>
          <div className="text-7xl font-bold my-2">{value.minute.toString().padStart(2, "0")}</div>
          <button
            className="text-4xl text-[#8291ae] opacity-50 w-full h-16 flex items-center justify-center"
            onClick={() => handleMinuteClick("up")}
          >
            {nextMinute.toString().padStart(2, "0")}
          </button>
        </div>

        {/* AM/PM */}
        <button className="text-6xl font-bold ml-4" onClick={togglePeriod}>
          {value.period}
        </button>
      </div>
    </div>
  )
}

