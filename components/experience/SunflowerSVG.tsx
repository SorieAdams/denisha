
import React from "react"

interface Props {
  size?: number
  color?: string
  className?: string
}

export default function SunflowerSVG({ size = 80, color = "#9b2335", className = "" }: Props) {
  // Minimal line-art sunflower: petals + center circle
  const petals = 12
  const cx = 50, cy = 50, r = 14, petalLen = 20, petalW = 5
  const petalPaths = Array.from({ length: petals }, (_, i) => {
    const angle = (i * 360) / petals
    const rad = (angle * Math.PI) / 180
    const x1 = cx + Math.cos(rad) * (r + 2)
    const y1 = cy + Math.sin(rad) * (r + 2)
    const x2 = cx + Math.cos(rad) * (r + petalLen)
    const y2 = cy + Math.sin(rad) * (r + petalLen)
    // perpendicular for width
    const px = Math.sin(rad) * petalW
    const py = Math.cos(rad) * petalW
    return `M${(x1 + px).toFixed(1)},${(y1 - py).toFixed(1)} Q${(x2 + px / 2).toFixed(1)},${(y2 - py / 2).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} Q${(x2 - px / 2).toFixed(1)},${(y2 + py / 2).toFixed(1)} ${(x1 - px).toFixed(1)},${(y1 + py).toFixed(1)} Z`
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      className={`sunflower-svg ${className}`}
      aria-hidden
    >
      {petalPaths.map((d, i) => (
        <path key={i} d={d} strokeLinejoin="round" />
      ))}
      {/* Center */}
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.55} strokeDasharray="2 2" />
    </svg>
  )
}
