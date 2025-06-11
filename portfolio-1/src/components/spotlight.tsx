"use client"

import { useEffect, useState } from "react"

export function Spotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      {/* Main spotlight */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-5 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background:
            "radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, rgba(251, 146, 60, 0.03) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Secondary spotlight */}
      <div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-5 transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, transparent 60%)",
          filter: "blur(30px)",
        }}
      />
    </>
  )
}
