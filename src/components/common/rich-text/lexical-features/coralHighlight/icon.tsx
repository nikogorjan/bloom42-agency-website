'use client'

type Props = {
  size?: number // px
}

export const CoralIcon: React.FC<Props> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden role="img">
    {/* Coral background */}
    <rect x="2" y="3" width="16" height="14" rx="3" fill="#FD7247" />

    {/* Dark "A" */}
    <text
      x={10}
      y={13.5}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
      fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif"
      fill="#262423"
    >
      A
    </text>
  </svg>
)
