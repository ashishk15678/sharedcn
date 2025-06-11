import type React from "react"

interface MarkerTextProps {
  children: React.ReactNode
  color?: "orange" | "yellow" | "red"
}

export function MarkerText({ children, color = "orange" }: MarkerTextProps) {
  const colors = {
    orange: "bg-orange-500/30",
    yellow: "bg-yellow-500/30",
    red: "bg-red-500/30",
  }

  return (
    <span className="relative inline-block">
      {children}
      <span
        className={`absolute bottom-0 left-0 w-full h-2 ${colors[color]} -z-10 transform -skew-x-12`}
        style={{
          clipPath: "polygon(0 20%, 100% 0%, 100% 100%, 0% 80%)",
        }}
      />
    </span>
  )
}
