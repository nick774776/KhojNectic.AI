"use client"

import { MeshGradient } from "@paper-design/shaders-react"

interface AnimatedBackgroundProps {
  /** Array of 4 hex colors for the mesh gradient */
  colors?: [string, string, string, string]
  /** Animation speed multiplier */
  speed?: number
  /** Additional CSS classes */
  className?: string
}

export function AnimatedBackground({
  colors = ["#000000", "#1a1a1a", "#333333", "#ffffff"],
  speed = 1.0,
  className = "",
}: AnimatedBackgroundProps) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <MeshGradient
        className="w-full h-full"
        colors={colors}
        speed={speed}
        backgroundColor="#000000"
      />

      {/* Lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${3 / speed}s` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: `${2 / speed}s`, animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/5 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
