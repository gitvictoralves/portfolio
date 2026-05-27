'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { ArrowUpRight, MapPin, Code2, Sparkles } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

type EaseArray = [number, number, number, number]

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const EASE_OUT: EaseArray = [0.0, 0, 0.2, 1]
const EASE_SPRING: EaseArray = [0.34, 1.56, 0.64, 1]

/* ─────────────────────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: EASE_OUT,
      delay,
    },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_SPRING, delay },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.25 },
  },
}

const wordVariant = {
  hidden: {
    opacity: 0,
    y: 28,
    rotateX: -18,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

/* ─────────────────────────────────────────────────────────────
   Spotlight — mouse-reactive radial gradient
───────────────────────────────────────────────────────────── */

function Spotlight() {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  )
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  )

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22 })

  const bgX = useTransform(springX, (v) => `${v}px`)
  const bgY = useTransform(springY, (v) => `${v}px`)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    },
    [mouseX, mouseY],
  )

  useEffect(() => {
    if (shouldReduceMotion) return
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [shouldReduceMotion, handleMouseMove])

  if (shouldReduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10"
        style={{
          width: 900,
          height: 900,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgb(79 53 214 / 0.08) 0%, transparent 65%)',
          x: bgX,
          y: bgY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Noise texture overlay (purely decorative)
───────────────────────────────────────────────────────────── */

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   Decorative grid lines
───────────────────────────────────────────────────────────── */

function HeroGridLines() {
  const shouldReduceMotion = useReducedMotion()

  const lines = [15, 45, 75]
  const vertLines = ['8%', '92%']

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {lines.map((top) => (
        <motion.div
          key={top}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.4, delay: 0.1, ease: EASE_OUT }
          }
          style={{ top: `${top}%` }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent origin-left"
        />
      ))}

      {vertLines.map((left, i) => (
        <motion.div
          key={left}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.6, delay: 0.2 + i * 0.1, ease: EASE_OUT }
          }
          style={{ left }}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent origin-top"
        />
      ))}

      {/* Accent vertical — left-side accent */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 1.8, delay: 0.4, ease: EASE_OUT }
        }
        className="absolute top-0 bottom-0 w-px origin-top"
        style={{
          left: '14%',
          background:
            'linear-gradient(to bottom, transparent 0%, rgb(79 53 214 / 0.15) 40%, rgb(122 98 232 / 0.08) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   AnimatedHeadline — sub-components
───────────────────────────────────────────────────────────── */

function IdeBreadcrumb() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
      className="mb-7 flex items-center gap-1.5 font-mono text-[11px] tracking-wide"
      aria-hidden="true"
    >
      <span style={{ color: 'var(--color-accent-500)' }}>export default</span>
      <span style={{ color: 'var(--color-accent-400)' }}>function</span>
      <span style={{ color: 'var(--color-neutral-300)' }}>HeroSection</span>
      <span style={{ color: 'var(--color-neutral-500)' }}>()</span>
      <span style={{ color: 'var(--color-neutral-400)', margin: '0 4px' }}>/</span>
      <span style={{ color: 'var(--color-neutral-400)' }}>hero.tsx:1</span>
    </motion.div>
  )
}

function BlinkingCursor() {
  return (
    <motion.span
      className="relative top-[-0.04em] ml-1.5 inline-block h-[0.78em] w-[3px] rounded-sm align-middle"
      style={{ background: 'var(--color-accent-400)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0] }}
      transition={{
        duration: 0.85,
        repeat: Infinity,
        repeatDelay: 0,
        ease: 'steps(1)',
        delay: 1.5,
        times: [0, 0.5, 0.5, 1, 1],
      }}
      aria-hidden="true"
    />
  )
}

function StringToken({ word }: { word: string }) {
  return (
    <motion.span
      variants={wordVariant}
      className="relative inline-block"
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* token background pill — fades in after word lands */}
      <motion.span
        className="absolute rounded-md"
        style={{
          inset: '-2px -10px',
          background: 'rgb(79 53 214 / 0.08)',
          border: '1px solid rgb(79 53 214 / 0.18)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.3, ease: [0, 0, 0.2, 1] }}
        aria-hidden="true"
      />

      {/* opening quote mark */}
      <motion.span
        className="relative z-10 font-mono"
        style={{
          fontSize: '0.58em',
          color: 'var(--color-accent-500)',
          lineHeight: 0,
          marginRight: 3,
          verticalAlign: 'super',
          position: 'relative',
          top: '0.18em',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.2 }}
        aria-hidden="true"
      >
        &quot;
      </motion.span>

      {/* word */}
      <span className="text-gradient-accent relative z-10">{word}</span>

      {/* closing quote mark */}
      <motion.span
        className="relative z-10 font-mono"
        style={{
          fontSize: '0.58em',
          color: 'var(--color-accent-500)',
          lineHeight: 0,
          marginLeft: 3,
          verticalAlign: 'super',
          position: 'relative',
          top: '0.18em',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.2 }}
        aria-hidden="true"
      >
        &quot;
      </motion.span>

      {/* underline — reveals left → right after landing */}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-300))',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0, 0, 0.2, 1] }}
        aria-hidden="true"
      />
    </motion.span>
  )
}

/* ─────────────────────────────────────────────────────────────
   AnimatedHeadline
───────────────────────────────────────────────────────────── */

function AnimatedHeadline() {
  const shouldReduceMotion = useReducedMotion()

  const headlineStyle: React.CSSProperties = {
    fontSize: 'clamp(38px, 5.5vw, 72px)',
  }

  if (shouldReduceMotion) {
    return (
      <div className="mb-6">
        <h1
          className="font-semibold leading-[1.05] tracking-tight"
          style={headlineStyle}
        >
          <span className="block">
            <span className="text-gradient">Interfaces que</span>
          </span>
          <span className="block">
            <span className="text-gradient-accent">encantam,</span>
          </span>
          <span className="flex items-center">
            <span className="text-gradient">código que dura.</span>
            <span
              className="ml-1.5 inline-block h-[0.78em] w-[3px] rounded-sm align-middle"
              style={{ background: 'var(--color-accent-400)' }}
              aria-hidden="true"
            />
          </span>
        </h1>
      </div>
    )
  }

  return (
    <div className="mb-6" style={{ perspective: '1400px' }}>
      <IdeBreadcrumb />

      {/* accessible label for screen readers */}
      <span className="sr-only">
        Interfaces que encantam, código que dura.
      </span>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="font-semibold leading-[1.05] tracking-tight"
        style={headlineStyle}
        aria-hidden="true"
        role="heading"
        aria-level={1}
      >
        {/* Line 1 — identifier tokens */}
        <div className="mb-[0.04em] flex flex-wrap gap-x-[0.25em]">
          {['Interfaces', 'que'].map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="text-gradient inline-block"
              style={{ transformOrigin: 'bottom center' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Line 2 — string token (accent) */}
        <div className="mb-[0.04em] flex flex-wrap items-baseline gap-x-[0.25em]">
          <StringToken word="encantam," />
        </div>

        {/* Line 3 — identifier tokens + blinking cursor */}
        <div className="flex flex-wrap items-center gap-x-[0.25em]">
          {['código', 'que', 'dura.'].map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="text-gradient inline-block"
              style={{ transformOrigin: 'bottom center' }}
            >
              {word}
            </motion.span>
          ))}

          <motion.span
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <BlinkingCursor />
          </motion.span>
        </div>
      </motion.div>

      {/* closing bracket — appears after all words land */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
        className="mt-6 font-mono text-xs"
        style={{ color: 'var(--color-neutral-400)' }}
        aria-hidden="true"
      >
        {'}'}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Stack pills row
───────────────────────────────────────────────────────────── */

const STACK = ['React', 'TypeScript', 'Next.js', 'Tailwind']

function StackPills() {
  return (
    <motion.div
      custom={0.55}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 mt-6"
    >
      {STACK.map((tech) => (
        <span
          key={tech}
          className="
            px-2.5 py-0.5 rounded-sm text-xs font-medium
            bg-white/[0.06] text-[var(--color-neutral-300)]
            border border-white/[0.09]
          "
        >
          {tech}
        </span>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   CTA buttons
───────────────────────────────────────────────────────────── */

function CTAButtons() {
  return (
    <motion.div
      custom={0.7}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3 mt-8"
    >
      {/* Primary */}
      <a
        href="#projects"
        className="
          group inline-flex items-center gap-2
          px-6 py-3 rounded-md
          bg-[var(--color-accent-500)] text-white font-medium text-sm
          hover:bg-[var(--color-accent-400)]
          transition-all duration-[var(--duration-fast)]
          focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-900)]
          shadow-[var(--glow-accent)] hover:shadow-[var(--glow-accent-strong)]
        "
      >
        Ver projetos
        <ArrowUpRight
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
          className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>

      {/* Secondary */}
      <a
        href="mailto:contato@victormssalves.com"
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-md
          bg-white/[0.04] border border-white/[0.10] text-[var(--color-neutral-200)] text-sm font-medium
          hover:bg-white/[0.07] hover:border-white/[0.16]
          transition-all duration-[var(--duration-fast)]
          focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-900)]
        "
      >
        Entrar em contato
      </a>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Meta strip
───────────────────────────────────────────────────────────── */

function MetaStrip() {
  return (
    <motion.div
      custom={0.85}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8"
    >
      <span className="flex items-center gap-1.5 text-xs text-[var(--color-neutral-400)]">
        <MapPin size={12} strokeWidth={1.5} aria-hidden="true" />
        Salvador, BA — Remoto
      </span>

      <span aria-hidden="true" className="text-[var(--color-neutral-400)] text-xs select-none">
        ·
      </span>

      <span className="flex items-center gap-1.5 text-xs text-[var(--color-neutral-400)]">
        <Code2 size={12} strokeWidth={1.5} aria-hidden="true" />
        Frontend Developer · Júnior
      </span>

      <span aria-hidden="true" className="text-[var(--color-neutral-400)] text-xs select-none">
        ·
      </span>

      <span className="flex items-center gap-1.5 text-xs text-[var(--color-neutral-400)]">
        <Sparkles size={12} strokeWidth={1.5} aria-hidden="true" />
        Inglês B1 · TOEFL 520
      </span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Scroll indicator
───────────────────────────────────────────────────────────── */

function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { delay: 1.6, duration: 0.7 }
      }
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)]">
        scroll
      </span>
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : { scaleY: [1, 0.6, 1], opacity: [0.5, 1, 0.5] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-px h-8 bg-gradient-to-b from-[var(--color-neutral-500)] to-transparent origin-top"
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Hero Photo — right column with 3D tilt
───────────────────────────────────────────────────────────── */

function HeroPhoto() {
  const shouldReduceMotion = useReducedMotion()

  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: 120, damping: 20 }
  const springRotX = useSpring(rotateX, springConfig)
  const springRotY = useSpring(rotateY, springConfig)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      rotateX.set(y * -10)
      rotateY.set(x * 10)
    },
    [rotateX, rotateY, shouldReduceMotion],
  )

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.9, ease: EASE_OUT, delay: 0.3 }
      }
      className="relative hidden lg:flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Atmospheric glow behind the photo */}
      <div
        className="absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 60%, rgb(79 53 214 / 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Tilt container */}
      <motion.div
        ref={cardRef}
        style={
          shouldReduceMotion
            ? { perspective: '1000px' }
            : {
                rotateX: springRotX,
                rotateY: springRotY,
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-default"
      >
        {/* Photo frame */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: 'min(360px, 36vw)',
            aspectRatio: '3 / 4',
            boxShadow:
              '0 0 0 1px rgb(255 255 255 / 0.07), 0 40px 80px rgb(0 0 0 / 0.55), var(--glow-accent)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-20"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgb(122 98 232 / 0.7) 50%, transparent 100%)',
            }}
          />

          {/*
            ─── INSTRUÇÃO DE USO ───────────────────────────────────
            Coloque sua foto em: /public/photo.webp
            Dimensões: 600×800px (portrait 3:4) ou superior
            Formato: WebP — melhor compressão + qualidade para Next.js
            ────────────────────────────────────────────────────────
          */}
          <Image
            src="/photo.webp"
            alt="Victor Manoel Soares Silva Alves — Frontend Developer"
            fill
            priority
            quality={92}
            className="object-cover object-top"
          />

          {/* Vignette + fade bottom */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgb(0 0 0 / 0) 55%, var(--color-neutral-900) 100%)',
            }}
          />

          {/* Subtle inner border shine */}
          <div
            className="absolute inset-0 z-10 rounded-2xl"
            style={{
              boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.08)',
            }}
          />
        </div>

        {/* Floating badge — bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.5, delay: 1.0, ease: EASE_SPRING }
          }
          className="absolute -bottom-4 -left-8 glass-2 rounded-xl px-4 py-3 flex items-center gap-3 z-30"
          style={{
            border: '1px solid rgb(255 255 255 / 0.09)',
            boxShadow: '0 8px 32px rgb(0 0 0 / 0.3)',
          }}
        >
          {/* Initials avatar */}
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold shrink-0 select-none"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent-700), var(--color-accent-500))',
              color: 'var(--color-accent-100)',
              boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.15)',
            }}
          >
            VA
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium text-[var(--color-neutral-100)]">
              Victor Alves
            </p>
            <p className="text-[11px] text-[var(--color-neutral-400)]">
              Frontend Developer
            </p>
          </div>
          {/* Online dot */}
          <span className="relative flex h-2 w-2 ml-1 shrink-0">
            {!shouldReduceMotion && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]" />
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Mobile photo strip — shown below lg breakpoint
───────────────────────────────────────────────────────────── */

function MobilePhoto() {
  return (
    <motion.div
      custom={0.15}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex lg:hidden justify-center mb-8"
      aria-hidden="true"
    >
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: 96,
          height: 96,
          boxShadow: '0 0 0 1px rgb(255 255 255 / 0.10), var(--glow-accent)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(122 98 232 / 0.7), transparent)',
          }}
        />
        <Image
          src="/photo.webp"
          alt="Victor Alves"
          fill
          priority
          quality={85}
          className="object-cover object-top"
        />
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section
      data-section="hero"
      className="ambient-bg relative flex min-h-svh items-center overflow-hidden"
      aria-label="Seção principal — apresentação de Victor Alves"
    >
      {/* Global effects */}
      <Spotlight />
      <NoiseOverlay />

      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10"
      />

      {/* Decorative lines */}
      <HeroGridLines />

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="container mx-auto max-w-screen-xl px-6 pt-28 pb-36 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="max-w-2xl">
            {/* Mobile avatar */}
            <MobilePhoto />

            {/* Headline */}
            <AnimatedHeadline />

            {/* Description */}
            <motion.p
              custom={0.42}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-[var(--color-neutral-300)] text-lg leading-relaxed max-w-lg"
            >
              Desenvolvedor Front-end focado em experiências premium, acessíveis e
              orientadas ao produto. Da ideia ao deploy, cada detalhe importa.
            </motion.p>

            {/* Stack pills */}
            <StackPills />

            {/* CTAs */}
            <CTAButtons />

            {/* Meta */}
            <MetaStrip />
          </div>

          {/* ── Right column — photo ─────────────────────────────── */}
          <HeroPhoto />
        </div>
      </div>

      {/* Scroll cue */}
      <ScrollIndicator />

      {/* Bottom fade to next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 -z-10"
        style={{
          background:
            'linear-gradient(to top, var(--color-neutral-900), transparent)',
        }}
      />
    </section>
  )
}