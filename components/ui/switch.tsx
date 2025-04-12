"use client"

import type * as React from "react"

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onClick?: (e: React.MouseEvent) => void
}

export function Switch({ checked, onCheckedChange, onClick }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        if (onClick) onClick(e)
        onCheckedChange(!checked)
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-[#414ba4]" : "bg-[#d7dfee]"
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}
