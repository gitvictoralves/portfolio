'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import {
  MapPin,
  Briefcase,
  Languages,
  CalendarCheck,
  GitBranch,
  ExternalLink,
  Mail,
  Brain,
  Wifi,
  Clock,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

interface AvailabilitySlot {
  date: string   // ISO string
  label: string
}

interface IdentityCardData {
  availability: AvailabilitySlot | null
}

/* ─────────────────────────────────────────────────────────────
   Static data — tudo que não vem de API
───────────────────────────────────────────────────────────── */

const STATIC = {
  name: 'Victor M. S. S. Alves',
  role: 'Frontend Engineer',
  location: 'Salvador, Bahia — BR',
  focus: 'Interfaces responsivas, acessibilidade e performance.',
  mbti: 'INTJ-A',
  languages: ['PT Nativo', 'EN B1'],
  stack: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  email: 'contato@victormssalves.com',
  github: 'github.com/gitvictoralves',
  linkedin: 'linkedin.com/in/victormssalves',
  calLink: 'contato@victormssalves.com',
  status: 'available' as const,
  timezone: 'BRT (UTC-3)',
} as const

/* ─────────────────────────────────────────────────────────────
   Hook — busca disponibilidade Cal.com + estrelas GitHub
   (em produção, isso viria via Server Component / route handler
    com ISR. Aqui está como client-side fallback demo.)
───────────────────────────────────────────────────────────── */

function useIdentityData(): IdentityCardData {
  const [data, setData] = useState<IdentityCardData>({
    availability: null,
  })

  useEffect(() => {
    // Simula fetch (em produção: /api/identity)
    const timer = setTimeout(() => {
      setData({
        availability: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          label: 'Próxima disponibilidade: em 3 dias',
        },
      })
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return data
}

/* ─────────────────────────────────────────────────────────────
   Sub-component — Pulse dot (status online)
───────────────────────────────────────────────────────────── */

function PulseDot({ status }: { status: 'available' | 'busy' | 'away' }) {
  const color =
    status === 'available'
      ? 'var(--color-success)'
      : status === 'busy'
        ? 'var(--color-error)'
        : 'var(--color-warning)'

  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sub-component — Badge / chip
───────────────────────────────────────────────────────────── */

function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-sm text-xs font-medium border"
      style={
        accent
          ? {
              background: 'rgb(79 53 214 / 0.15)',
              color: 'var(--color-accent-300)',
              borderColor: 'rgb(79 53 214 / 0.25)',
            }
          : {
              background: 'rgb(255 255 255 / 0.08)',
              color: 'var(--color-neutral-300)',
              borderColor: 'rgb(255 255 255 / 0.10)',
            }
      }
    >
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sub-component — Row de informação
───────────────────────────────────────────────────────────── */

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        size={14}
        strokeWidth={1.5}
        aria-hidden="true"
        style={{ color: 'var(--color-accent-400)', marginTop: 2, flexShrink: 0 }}
      />
      <span
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-neutral-300)' }}
      >
        {children}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sub-component — Botão de link social
───────────────────────────────────────────────────────────── */

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-8 h-8 rounded-md border transition-all"
      style={{
        background: 'rgb(255 255 255 / 0.05)',
        borderColor: 'rgb(255 255 255 / 0.10)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'rgb(255 255 255 / 0.10)'
        el.style.borderColor = 'rgb(255 255 255 / 0.18)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'rgb(255 255 255 / 0.05)'
        el.style.borderColor = 'rgb(255 255 255 / 0.10)'
      }}
    >
      <Icon size={14} strokeWidth={1.5} aria-hidden="true" style={{ color: 'var(--color-neutral-300)' }} />
    </a>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */

export function IdentityCard() {
  const shouldReduceMotion = useReducedMotion()
  const { availability } = useIdentityData()
  const cardRef = useRef<HTMLDivElement>(null)

  /* 3-D tilt — motion values */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springConfig = { stiffness: 200, damping: 30 }
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), springConfig)

  /* Spotlight position */
  const spotX = useSpring(useTransform(rawX, [-0.5, 0.5], [20, 80]), springConfig)
  const spotY = useSpring(useTransform(rawY, [-0.5, 0.5], [20, 80]), springConfig)
  const spotOpacity = useMotionValue(0)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(x)
    rawY.set(y)
    spotOpacity.set(0.15)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
    spotOpacity.set(0)
  }

  /* Formatted availability label */
  const availLabel = availability?.label ?? 'Verificando disponibilidade…'

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        boxShadow: 'var(--glow-accent), var(--shadow-lg)',
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      className="glass-3 relative rounded-2xl overflow-hidden max-w-md w-full"
      aria-label="Cartão de identidade — Victor Alves"
    >
      {/* Spotlight overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: spotOpacity,
          background: `radial-gradient(circle at ${spotX.get()}% ${spotY.get()}%, rgb(122 98 232 / 0.4), transparent 60%)`,
        }}
      />

      {/* Accent top-edge gradient */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(122 98 232 / 0.5), transparent)',
        }}
      />

      <div className="relative p-6 flex flex-col gap-5">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-700), var(--color-accent-500))',
                color: 'var(--color-accent-100)',
                boxShadow: 'var(--glow-accent)',
              }}
              aria-hidden="true"
            >
              VA
            </div>
            {/* Status dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: 'var(--color-neutral-800)', border: '1.5px solid var(--color-neutral-700)' }}
              aria-label="Status: disponível"
            >
              <PulseDot status={STATIC.status} />
            </span>
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-gradient text-xl font-semibold leading-tight truncate"
              aria-label="Victor Alves"
            >
              {STATIC.name}
            </h3>
            <p
              className="text-sm mt-0.5"
              style={{ color: 'var(--color-accent-400)' }}
            >
              {STATIC.role}
            </p>
          </div>

          {/* MBTI badge */}
          <Chip label={STATIC.mbti} />
        </div>

        {/* ── Info rows ──────────────────────────────────────── */}
        <div className="flex flex-col gap-2.5">
          <InfoRow icon={MapPin}>
            {STATIC.location}
          </InfoRow>
          <InfoRow icon={Briefcase}>
            {STATIC.focus}
          </InfoRow>
          <InfoRow icon={Clock}>
            {STATIC.timezone}
          </InfoRow>
          <InfoRow icon={Languages}>
            {STATIC.languages.join(' · ')}
          </InfoRow>
          <InfoRow icon={Brain}>
            MBTI {STATIC.mbti} — Arquiteto, estratégico e introvertido.
          </InfoRow>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.10), transparent)' }}
        />

        {/* ── Stack chips ────────────────────────────────────── */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            Stack principal
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATIC.stack.map((tech) => (
              <Chip key={tech} label={tech} accent />
            ))}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          {/* Social links */}
          <div className="flex gap-2">
            <SocialLink
              href={`https://${STATIC.github}`}
              icon={GitBranch}
              label="GitHub de Victor Alves"
            />
            <SocialLink
              href={`https://${STATIC.linkedin}`}
              icon={ExternalLink}
              label="LinkedIn de Victor Alves"
            />
            <SocialLink
              href={`mailto:${STATIC.email}`}
              icon={Mail}
              label="Enviar e-mail para Victor Alves"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}