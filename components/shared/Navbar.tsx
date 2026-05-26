'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   TYPES & CONFIG
───────────────────────────────────────────────────────────── */

interface NavLink {
  label: string
  href: string
  section: string
  /** Ambient hue emitido quando esta seção está ativa (do style guide) */
  hue: number
}

const NAV_LINKS: NavLink[] = [
  { label: 'Sobre',      href: '#identity',  section: 'identity',  hue: 260 },
  { label: 'Stack',      href: '#orbit',     section: 'orbit',     hue: 210 },
  { label: 'Trajetória', href: '#timeline',  section: 'timeline',  hue: 180 },
  { label: 'Projetos',   href: '#projects',  section: 'projects',  hue: 250 },
  { label: 'Dashboard',  href: '#dashboard', section: 'dashboard', hue: 200 },
]

const HERO_HUE = 240

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────── */

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [threshold])
  return scrolled
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const fn = () => {
      const { scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      setP(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return p
}

function useActiveSection(): { section: string; hue: number } {
  const [active, setActive] = useState({ section: 'hero', hue: HERO_HUE })

  useEffect(() => {
    const entries = new Map<string, number>()

    const observers: IntersectionObserver[] = []

    const allSections = [
      { section: 'hero', hue: HERO_HUE },
      ...NAV_LINKS.map(({ section, hue }) => ({ section, hue })),
    ]

    allSections.forEach(({ section, hue }) => {
      const el = document.getElementById(section)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          entries.set(section, entry.intersectionRatio)
          // pick highest ratio
          let best = { section: 'hero', hue: HERO_HUE, ratio: 0 }
          allSections.forEach(({ section: s, hue: h }) => {
            const r = entries.get(s) ?? 0
            if (r > best.ratio) best = { section: s, hue: h, ratio: r }
          })
          setActive({ section: best.section, hue: best.hue })
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return active
}

function useScrollTo(reduceMotion: boolean | null) {
  return useCallback(
    (href: string, cb?: () => void) => {
      const el = document.getElementById(href.replace('#', ''))
      el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      cb?.()
    },
    [reduceMotion]
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: AnimatedChar — letra por letra no hover
───────────────────────────────────────────────────────────── */

function AnimatedWord({
  text,
  isActive,
}: {
  text: string
  isActive: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return <span>{text}</span>

  return (
    <span className="flex" aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          whileHover={{
            y: -2,
            transition: { delay: i * 0.018, type: 'spring', stiffness: 600, damping: 20 },
          }}
          animate={
            isActive
              ? { color: 'var(--color-neutral-50, #f5f5f8)' }
              : { color: 'var(--color-neutral-400, #6b6c75)' }
          }
          transition={{ duration: 0.18 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: NavPill — o indicador de seção ativa
───────────────────────────────────────────────────────────── */

function NavPill({ hue }: { hue: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.span
      layoutId="nav-pill-v3"
      className="absolute inset-0 rounded-lg"
      style={{ zIndex: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }
      }
    >
      {/* Base glass */}
      <span
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'rgb(255 255 255 / 0.06)',
          border: '1px solid rgb(255 255 255 / 0.09)',
        }}
      />
      {/* Ambient color seep */}
      <motion.span
        className="absolute inset-0 rounded-lg"
        animate={{ opacity: [0, 0.6, 0.35] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: `radial-gradient(ellipse at 50% 100%, hsl(${hue} 70% 55% / 0.18) 0%, transparent 70%)`,
        }}
      />
      {/* Bottom edge glow */}
      <motion.span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px"
        animate={{ opacity: [0, 0.8, 0.45], width: ['30%', '80%', '60%'] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: `hsl(${hue} 80% 70% / 0.7)`,
          boxShadow: `0 0 8px 1px hsl(${hue} 80% 65% / 0.4)`,
          borderRadius: '9999px',
        }}
      />
    </motion.span>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: Logo / Monogram
───────────────────────────────────────────────────────────── */

function Logo({
  onClick,
  hue,
}: {
  onClick: () => void
  hue: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const [scanLine, setScanLine] = useState(0)

  // Micro scanner animation inside monogram
  useEffect(() => {
    if (shouldReduceMotion) return
    const id = setInterval(() => {
      setScanLine((v) => (v + 1) % 3)
    }, 1800)
    return () => clearInterval(id)
  }, [shouldReduceMotion])

  return (
    <a
      href="#hero"
      onClick={(e) => { e.preventDefault(); onClick() }}
      aria-label="Voltar ao topo — Victor Alves"
      className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
    >
      {/* Monogram box */}
      <motion.span
        className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden select-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, hsl(${hue} 60% 45% / 0.22), rgba(8,9,10,0.9))`,
          border: `1px solid hsl(${hue} 60% 60% / 0.28)`,
          boxShadow: `0 0 0 0 hsl(${hue} 60% 55% / 0)`,
          transition: 'background 0.8s ease, border-color 0.8s ease',
        }}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                boxShadow: `0 0 20px hsl(${hue} 60% 55% / 0.35), 0 0 0 1px hsl(${hue} 60% 55% / 0.2)`,
                scale: 1.04,
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        aria-hidden="true"
      >
        {/* Dot grid texture */}
        <span
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '5px 5px',
          }}
        />

        {/* Scanner line */}
        {!shouldReduceMotion && (
          <motion.span
            className="absolute left-0 right-0 h-px pointer-events-none"
            animate={{ top: [`${20 + scanLine * 20}%`] }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              background: `hsl(${hue} 80% 70% / 0.5)`,
              boxShadow: `0 0 4px hsl(${hue} 80% 70% / 0.6)`,
            }}
          />
        )}

        {/* Initials */}
        <span
          className="relative z-10 text-[11px] font-bold tracking-[0.12em]"
          style={{ color: `hsl(${hue} 80% 80% / 0.95)`, transition: 'color 0.8s ease' }}
        >
          VA
        </span>

        {/* Corner accent */}
        <span
          className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
          style={{
            background: `hsl(${hue} 80% 70% / 0.7)`,
            boxShadow: `0 0 4px hsl(${hue} 80% 70% / 0.5)`,
          }}
        />
      </motion.span>

      {/* Name */}
      <span className="hidden sm:flex flex-col leading-none gap-0.5">
        <span
          className="text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-700"
          style={{ color: `hsl(${hue} 50% 65% / 0.8)` }}
        >
          Portfolio
        </span>
        <span
          className="text-sm font-semibold transition-colors duration-200"
          style={{ color: 'var(--color-neutral-100, #e8e9ee)' }}
        >
          Victor Alves
        </span>
      </span>
    </a>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: CTA Button
───────────────────────────────────────────────────────────── */

function CTAButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      href="mailto:contato@victormssalves.com"
      className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${fullWidth ? 'w-full justify-center' : ''}`}
      style={{
        background: 'var(--color-accent-500, #4f35d6)',
        color: '#fff',
      }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {/* Shine sweep on hover */}
      {!shouldReduceMotion && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
          }}
        />
      )}

      <span className="relative z-10">Contato</span>
      <ArrowUpRight
        size={13}
        strokeWidth={1.5}
        aria-hidden="true"
        className="relative z-10 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </motion.a>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: Ambient backdrop stripe
   — faixa de cor ambiente que "vaza" da seção ativa para o navbar
───────────────────────────────────────────────────────────── */

function AmbientStripe({ hue, visible }: { hue: number; visible: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        background: `radial-gradient(ellipse 60% 80% at 50% 0%, hsl(${hue} 60% 30% / 0.12) 0%, transparent 70%)`,
        transition: 'background 0.8s ease',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: Scroll Progress
───────────────────────────────────────────────────────────── */

function ScrollProgress({ progress, hue }: { progress: number; hue: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-px origin-left"
      style={{
        scaleX: progress,
        background: `linear-gradient(90deg, hsl(${hue} 80% 60% / 0.9), hsl(${hue} 70% 75% / 0.7))`,
        boxShadow: `0 0 6px 1px hsl(${hue} 70% 60% / 0.4)`,
        width: '100%',
        transformOrigin: 'left',
        transition: 'background 0.8s ease, box-shadow 0.8s ease',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: Mobile Menu
───────────────────────────────────────────────────────────── */

function MobileMenu({
  open,
  activeSection,
  activeHue,
  onClose,
  scrollTo,
}: {
  open: boolean
  activeSection: string
  activeHue: number
  onClose: () => void
  scrollTo: (href: string, cb?: () => void) => void
}) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Scrim */}
      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(8,9,10,0.65)', backdropFilter: 'blur(3px)' }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Navegação"
            aria-modal="true"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 360, damping: 30, mass: 0.9 }
            }
            className="fixed left-3 right-3 z-40 md:hidden rounded-2xl overflow-hidden"
            style={{
              top: 'calc(68px + 6px)',
              background: 'rgba(13, 14, 16, 0.97)',
              border: '1px solid rgb(255 255 255 / 0.08)',
              boxShadow: `0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgb(255 255 255 / 0.04), inset 0 1px 0 rgb(255 255 255 / 0.06)`,
              backdropFilter: 'blur(28px)',
            }}
          >
            {/* Ambient top glow inside panel */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 100% at 50% 0%, hsl(${activeHue} 60% 40% / 0.16), transparent)`,
                transition: 'background 0.8s ease',
              }}
            />

            {/* Links */}
            <nav aria-label="Navegação mobile" className="relative p-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.section
                return (
                  <motion.a
                    key={link.section}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href, onClose) }}
                    aria-current={isActive ? 'page' : undefined}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: open ? i * 0.04 : 0,
                      type: 'spring',
                      stiffness: 400,
                      damping: 28,
                    }}
                    className="relative flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] overflow-hidden"
                    style={{
                      color: isActive
                        ? 'var(--color-neutral-50, #f5f5f8)'
                        : 'var(--color-neutral-300, #9a9ba6)',
                    }}
                  >
                    {/* Active bg */}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, hsl(${link.hue} 50% 40% / 0.15), transparent)`,
                          border: `1px solid hsl(${link.hue} 50% 60% / 0.16)`,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <span className="relative z-10 font-medium">{link.label}</span>

                    <span className="relative z-10 flex items-center gap-2">
                      {isActive && (
                        <motion.span
                          layoutId="mobile-dot"
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: `hsl(${link.hue} 80% 70%)`,
                            boxShadow: `0 0 6px hsl(${link.hue} 80% 65% / 0.7)`,
                          }}
                        />
                      )}
                    </span>
                  </motion.a>
                )
              })}
            </nav>

            {/* Divider */}
            <span
              className="block mx-4"
              style={{ height: '1px', background: 'rgb(255 255 255 / 0.06)' }}
            />

            {/* CTA */}
            <div className="p-3">
              <CTAButton fullWidth />
            </div>

            {/* Section label */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--color-neutral-600, #26272d)' }}
              >
                Seção ativa
              </span>
              <motion.span
                key={activeSection}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-medium"
                style={{ color: `hsl(${activeHue} 70% 65%)` }}
              >
                {NAV_LINKS.find(l => l.section === activeSection)?.label ?? 'Início'}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT — Navbar v3.0
───────────────────────────────────────────────────────────── */

export function Navbar() {
  const scrolled = useScrolled()
  const progress = useScrollProgress()
  const { section: activeSection, hue: activeHue } = useActiveSection()
  const [mobileOpen, setMobileOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const scrollTo = useScrollTo(shouldReduceMotion ?? false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: scrolled ? '10px' : '20px',
          paddingBottom: scrolled ? '10px' : '20px',
          transition: 'padding 350ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Layer 1: base backdrop ──────────────────── */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{
            background: scrolled
              ? 'rgba(10, 11, 13, 0.85)'
              : 'rgba(10, 11, 13, 0)',
            backdropFilter: scrolled ? 'blur(22px) saturate(160%)' : 'blur(0px)',
            borderBottomColor: scrolled ? 'rgb(255 255 255 / 0.06)' : 'rgb(255 255 255 / 0)',
          }}
          style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* ── Layer 2: ambient color from active section ─ */}
        <AmbientStripe hue={activeHue} visible={scrolled} />

        {/* ── Layer 3: scroll progress ─────────────────── */}
        <ScrollProgress progress={progress} hue={activeHue} />

        {/* ── Content ──────────────────────────────────── */}
        <div className="relative mx-auto max-w-screen-xl px-5 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Logo onClick={() => scrollTo('#hero')} hue={activeHue} />

          {/* Desktop nav */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-0.5"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section
              return (
                <a
                  key={link.section}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                  aria-current={isActive ? 'page' : undefined}
                  className="group relative px-4 py-2 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Animated pill */}
                  {isActive && <NavPill hue={link.hue} />}

                  {/* Hover bg (non-active) */}
                  {!isActive && (
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ background: 'rgb(255 255 255 / 0.04)' }}
                    />
                  )}

                  {/* Label with per-char animation */}
                  <span className="relative z-10">
                    <AnimatedWord text={link.label} isActive={isActive} />
                  </span>
                </a>
              )
            })}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Active section indicator */}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSection}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] uppercase tracking-widest"
                style={{ color: `hsl(${activeHue} 60% 65%)` }}
                aria-live="polite"
                aria-label={`Seção atual: ${NAV_LINKS.find(l => l.section === activeSection)?.label ?? 'Início'}`}
              >
                {NAV_LINKS.find(l => l.section === activeSection)?.label ?? 'Início'}
              </motion.span>
            </AnimatePresence>

            {/* Separator */}
            <span
              className="w-px h-4"
              style={{ background: 'rgb(255 255 255 / 0.10)' }}
              aria-hidden="true"
            />

            <CTAButton />
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
            style={{
              background: mobileOpen
                ? `hsl(${activeHue} 40% 35% / 0.20)`
                : 'rgb(255 255 255 / 0.05)',
              border: `1px solid ${mobileOpen ? `hsl(${activeHue} 50% 55% / 0.25)` : 'rgb(255 255 255 / 0.08)'}`,
              color: mobileOpen
                ? `hsl(${activeHue} 70% 72%)`
                : 'var(--color-neutral-400, #6b6c75)',
              transition: 'background 250ms ease, border-color 250ms ease, color 250ms ease',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={shouldReduceMotion ? {} : { opacity: 0, rotate: -60, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, rotate: 60, scale: 0.6 }}
                  transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
                >
                  <X size={17} strokeWidth={1.5} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={shouldReduceMotion ? {} : { opacity: 0, rotate: 60, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, rotate: -60, scale: 0.6 }}
                  transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
                >
                  <Menu size={17} strokeWidth={1.5} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileOpen}
        activeSection={activeSection}
        activeHue={activeHue}
        onClose={closeMobile}
        scrollTo={scrollTo}
      />
    </>
  )
}

export default Navbar