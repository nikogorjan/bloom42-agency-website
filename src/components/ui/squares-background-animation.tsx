import React, { useRef, useEffect } from 'react'

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern
type CanvasFillStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed?: number
  borderColor?: CanvasStrokeStyle
  squareSize?: number
  hoverFillColor?: CanvasFillStyle | 'transparent'
  /** Set a solid canvas background. Omit/undefined = transparent (let parent bg show through). */
  backgroundFill?: CanvasFillStyle
  /** Toggle the corner shading/vignette. Default false for a clean grid. */
  vignette?: boolean
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = 'transparent',
  backgroundFill,
  vignette = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const numSquaresX = useRef<number>(0)
  const numSquaresY = useRef<number>(0)
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 })
  const hoveredSquareRef = useRef<GridOffset | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      // handle HiDPI for crisper lines
      const dpr = window.devicePixelRatio || 1
      const { offsetWidth, offsetHeight } = canvas
      canvas.width = Math.floor(offsetWidth * dpr)
      canvas.height = Math.floor(offsetHeight * dpr)
      canvas.style.width = `${offsetWidth}px`
      canvas.style.height = `${offsetHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      numSquaresX.current = Math.ceil(offsetWidth / squareSize) + 1
      numSquaresY.current = Math.ceil(offsetHeight / squareSize) + 1
    }

    window.addEventListener('resize', resizeCanvas, { passive: true })
    resizeCanvas()

    const drawGrid = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      // background: solid fill OR keep transparent
      if (backgroundFill) {
        ctx.fillStyle = backgroundFill
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.clearRect(0, 0, width, height)
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      ctx.lineWidth = 1

      for (let x = startX; x < width + squareSize; x += squareSize) {
        for (let y = startY; y < height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)

          if (
            hoverFillColor !== 'transparent' &&
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor
            ctx.fillRect(squareX, squareY, squareSize, squareSize)
          }

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1)
        }
      }

      if (vignette) {
        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.sqrt(width ** 2 + height ** 2) / 2,
        )
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(1, 'rgba(6, 0, 16, 1)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
      }

      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    // --- KEY CHANGE: listen on window, not canvas, so overlaying content doesn't block hover ---
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      // Only react while mouse is over the canvas area
      if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
        hoveredSquareRef.current = null
        return
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize)
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize)

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY }
      }
    }

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    requestRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize, backgroundFill, vignette])

  // Important: canvas should not block clicks on content above it
  return <canvas ref={canvasRef} className="w-full h-full border-none block pointer-events-none" />
}

export default Squares
