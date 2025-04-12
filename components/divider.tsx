interface DividerProps {
  text?: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="relative flex items-center justify-center my-4">
      <div className="flex-grow border-t border-gray-200"></div>
      {text && <span className="flex-shrink mx-4 text-gray-400 text-sm">{text}</span>}
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
  )
}
