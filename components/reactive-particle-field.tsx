"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  angle: number
  drift: number
  depth: number
  accent: boolean
}

const CONNECTION_DISTANCE = 112
const POINTER_RADIUS = 190

export default function ReactiveParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, pulse: 0, active: false }

    let width = 0
    let height = 0
    let pixelRatio = 1
    let particles: Particle[] = []
    let foreground = "0 0% 96%"
    let primary = "12 100% 65%"
    let frameId = 0
    let running = false
    let visible = true
    let lastScrollY = window.scrollY

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement)
      foreground = styles.getPropertyValue("--foreground").trim() || foreground
      primary = styles.getPropertyValue("--primary").trim() || primary
    }

    const color = (value: string, alpha: number) => `hsl(${value} / ${alpha})`

    const seedParticles = () => {
      const density = Math.floor((width * height) / 15_000)
      const limit = width < 640 ? 46 : 82
      const count = Math.min(limit, Math.max(30, density))

      particles = Array.from({ length: count }, (_, index) => {
        const angle = Math.random() * Math.PI * 2
        const depth = 0.45 + Math.random() * 0.55
        const speed = (0.06 + Math.random() * 0.22) * depth

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 0.7 + Math.random() * 1.25,
          angle,
          drift: 0.002 + Math.random() * 0.006,
          depth,
          accent: index % 8 === 0,
        }
      })
    }

    const updateParticles = () => {
      for (const particle of particles) {
        particle.angle += particle.drift
        particle.vx += Math.cos(particle.angle) * 0.0025 * particle.depth
        particle.vy += Math.sin(particle.angle) * 0.0025 * particle.depth

        if (pointer.active) {
          const dx = pointer.x - particle.x
          const dy = pointer.y - particle.y
          const distance = Math.hypot(dx, dy)

          if (distance > 0.01 && distance < POINTER_RADIUS) {
            const influence = 1 - distance / POINTER_RADIUS
            const radialForce = distance < 44 ? -0.052 : 0.03
            const tangentForce = 0.021

            particle.vx +=
              (dx / distance) * influence * radialForce +
              (-dy / distance) * influence * tangentForce +
              pointer.vx * influence * 0.0018
            particle.vy +=
              (dy / distance) * influence * radialForce +
              (dx / distance) * influence * tangentForce +
              pointer.vy * influence * 0.0018
          }
        }

        particle.vx *= 0.987
        particle.vy *= 0.987

        const speed = Math.hypot(particle.vx, particle.vy)
        if (speed > 1.65) {
          particle.vx = (particle.vx / speed) * 1.65
          particle.vy = (particle.vy / speed) * 1.65
        }

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -8) particle.x = width + 8
        if (particle.x > width + 8) particle.x = -8
        if (particle.y < -8) particle.y = height + 8
        if (particle.y > height + 8) particle.y = -8
      }

      pointer.vx *= 0.84
      pointer.vy *= 0.84
      pointer.pulse *= 0.93
    }

    const draw = (advance: boolean) => {
      if (advance) updateParticles()

      context.clearRect(0, 0, width, height)
      context.lineCap = "round"

      if (pointer.active) {
        const halo = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          POINTER_RADIUS,
        )
        halo.addColorStop(0, color(primary, 0.055))
        halo.addColorStop(0.45, color(primary, 0.018))
        halo.addColorStop(1, color(primary, 0))
        context.fillStyle = halo
        context.fillRect(
          pointer.x - POINTER_RADIUS,
          pointer.y - POINTER_RADIUS,
          POINTER_RADIUS * 2,
          POINTER_RADIUS * 2,
        )

        context.beginPath()
        context.arc(pointer.x, pointer.y, 30, -0.35, Math.PI * 1.15)
        context.strokeStyle = color(primary, 0.22)
        context.lineWidth = 0.7
        context.stroke()

        if (pointer.pulse > 0.02) {
          context.beginPath()
          context.arc(pointer.x, pointer.y, 32 + (1 - pointer.pulse) * 78, 0, Math.PI * 2)
          context.strokeStyle = color(primary, pointer.pulse * 0.24)
          context.lineWidth = 0.8
          context.stroke()
        }
      }

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        const first = particles[firstIndex]

        for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
          const second = particles[secondIndex]
          const distance = Math.hypot(first.x - second.x, first.y - second.y)

          if (distance >= CONNECTION_DISTANCE) continue

          const strength = 1 - distance / CONNECTION_DISTANCE
          context.beginPath()
          context.moveTo(first.x, first.y)
          context.lineTo(second.x, second.y)
          context.strokeStyle = color(
            first.accent || second.accent ? primary : foreground,
            strength * 0.11,
          )
          context.lineWidth = 0.55
          context.stroke()
        }
      }

      for (const particle of particles) {
        const speed = Math.hypot(particle.vx, particle.vy)
        const directionX = speed > 0.01 ? particle.vx / speed : Math.cos(particle.angle)
        const directionY = speed > 0.01 ? particle.vy / speed : Math.sin(particle.angle)
        const trail = 7 + speed * 9
        const particleColor = particle.accent ? primary : foreground

        if (pointer.active) {
          const pointerDistance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y)

          if (pointerDistance < POINTER_RADIUS) {
            context.beginPath()
            context.moveTo(pointer.x, pointer.y)
            context.lineTo(particle.x, particle.y)
            context.strokeStyle = color(primary, (1 - pointerDistance / POINTER_RADIUS) * 0.11)
            context.lineWidth = 0.5
            context.stroke()
          }
        }

        context.beginPath()
        context.moveTo(particle.x - directionX * trail, particle.y - directionY * trail)
        context.quadraticCurveTo(
          particle.x - directionY * 2.5,
          particle.y + directionX * 2.5,
          particle.x + directionX * 2,
          particle.y + directionY * 2,
        )
        context.strokeStyle = color(
          particleColor,
          (particle.accent ? 0.58 : 0.25) * particle.depth,
        )
        context.lineWidth = (particle.accent ? 1.2 : 0.75) * particle.depth
        context.stroke()

        context.beginPath()
        context.arc(particle.x, particle.y, particle.size * particle.depth, 0, Math.PI * 2)
        context.fillStyle = color(
          particleColor,
          (particle.accent ? 0.92 : 0.58) * particle.depth,
        )
        context.fill()
      }
    }

    const tick = () => {
      if (!running) return
      draw(true)
      frameId = window.requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frameId)
    }

    const syncAnimation = () => {
      const shouldRun = visible && !document.hidden && !reducedMotion.matches

      if (shouldRun && !running) {
        running = true
        frameId = window.requestAnimationFrame(tick)
      } else if (!shouldRun) {
        stop()
        draw(false)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      readColors()
      seedParticles()
      draw(false)
    }

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      const nextX = event.clientX - rect.left
      const nextY = event.clientY - rect.top

      pointer.active = inside
      pointer.vx = Math.max(-24, Math.min(24, nextX - pointer.x))
      pointer.vy = Math.max(-24, Math.min(24, nextY - pointer.y))
      pointer.x = nextX
      pointer.y = nextY
    }

    const activatePulse = (event: PointerEvent) => {
      updatePointer(event)
      pointer.pulse = 1
    }

    const clearTouchPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.active = false
    }

    const clearPointer = () => {
      pointer.active = false
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) clearPointer()
    }

    const handleScroll = () => {
      const nextScrollY = window.scrollY
      const delta = Math.max(-80, Math.min(80, nextScrollY - lastScrollY))
      lastScrollY = nextScrollY

      for (const particle of particles) {
        particle.y -= delta * 0.025 * particle.depth
        if (particle.y < -8) particle.y = height + 8
        if (particle.y > height + 8) particle.y = -8
      }
    }

    const handleThemeChange = () => {
      readColors()
      if (!running) draw(false)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        syncAnimation()
      },
      { rootMargin: "120px" },
    )
    const themeObserver = new MutationObserver(handleThemeChange)

    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    window.addEventListener("pointermove", updatePointer, { passive: true })
    window.addEventListener("pointerdown", activatePulse, { passive: true })
    window.addEventListener("pointerup", clearTouchPointer, { passive: true })
    window.addEventListener("pointerout", handlePointerOut, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("blur", clearPointer)
    document.addEventListener("visibilitychange", syncAnimation)
    reducedMotion.addEventListener("change", syncAnimation)

    resize()
    syncAnimation()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener("pointermove", updatePointer)
      window.removeEventListener("pointerdown", activatePulse)
      window.removeEventListener("pointerup", clearTouchPointer)
      window.removeEventListener("pointerout", handlePointerOut)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("blur", clearPointer)
      document.removeEventListener("visibilitychange", syncAnimation)
      reducedMotion.removeEventListener("change", syncAnimation)
    }
  }, [])

  return <canvas ref={canvasRef} className="reactive-particle-field" aria-hidden="true" />
}
