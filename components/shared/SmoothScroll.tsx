'use client'

import { useEffect, useRef } from 'react'
import { createLenis } from '@/lib/lenis'
import type Lenis from 'lenis'

export let lenisInstance: Lenis | null = null

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafId = useRef<number>(0)

  useEffect(() => {
    const lenis = createLenis()
    lenisInstance = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }
    rafId.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId.current)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}