interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
}

export function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const sizes = {
    sm: {
      container: "w-10 h-10",
      inner: "w-5 h-5",
    },
    md: {
      container: "w-16 h-16",
      inner: "w-8 h-8",
    },
    lg: {
      container: "w-24 h-24",
      inner: "w-12 h-12",
    },
  }

  const colors = {
    light: {
      container: "bg-white",
      inner: "bg-primary",
    },
    dark: {
      container: "bg-white border border-gray-200",
      inner: "bg-primary",
    },
  }

  return (
    <div
      className={`${sizes[size].container} ${colors[variant].container} rounded-xl flex items-center justify-center`}
    >
      <div className={`${sizes[size].inner} ${colors[variant].inner} rounded-md`}></div>
    </div>
  )
}
