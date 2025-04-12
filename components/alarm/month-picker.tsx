"use client"

interface MonthPickerProps {
  value: { month: string; year: number }
  onChange: (value: { month: string; year: number }) => void
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const months = [
    { short: "JAN", full: "January" },
    { short: "FEB", full: "February" },
    { short: "MAR", full: "March" },
    { short: "APR", full: "April" },
    { short: "MAY", full: "May" },
    { short: "JUN", full: "June" },
    { short: "JUL", full: "July" },
    { short: "AUG", full: "August" },
    { short: "SEP", full: "September" },
    { short: "OCT", full: "October" },
    { short: "NOV", full: "November" },
    { short: "DEC", full: "December" },
  ]

  const handleMonthSelect = (month: string) => {
    onChange({ ...value, month })
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid grid-cols-1 gap-4 w-full">
        {["AUG", "SEP", "OCT"].map((month, index) => {
          const isSelected = month === "SEP"
          return (
            <button
              key={month}
              onClick={() => handleMonthSelect(month)}
              className={`py-4 flex items-center justify-between ${
                isSelected ? "text-primary font-bold" : "text-[#8291ae]"
              }`}
            >
              <span className="text-xl">{month}</span>
              <span className="text-xl">{index === 1 ? "02" : index === 0 ? "01" : "03"}</span>
              <span className="text-xl">{value.year}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
