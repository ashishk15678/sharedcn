"use client"

import { useState, useEffect } from "react"

export function InteractiveOrb() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("orb-container")?.getBoundingClientRect()
      if (rect) {
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const container = document.getElementById("orb-container")
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div id="orb-container" className="fixed inset-0 pointer-events-none z-0">
      <div
        className={`absolute w-96 h-96 rounded-full transition-all duration-300 ${
          isHovered ? "scale-150" : "scale-100"
        }`}
        style={{
          left: position.x - 192,
          top: position.y - 192,
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  )
}
