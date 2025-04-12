"use client"

interface SocialButtonProps {
  provider: "facebook" | "google"
  onClick?: () => void
}

export function SocialButton({ provider, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 rounded-lg text-sm"
    >
      {provider === "facebook" ? (
        <span className="text-blue-600 font-bold">f</span>
      ) : (
        <span className="text-red-500 font-bold">G</span>
      )}
      <span>{provider === "facebook" ? "Facebook" : "Google"}</span>
    </button>
  )
}
