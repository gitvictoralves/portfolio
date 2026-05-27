'use client'

import {
  useEffect,
  useState,
  useCallback,
} from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   TYPES & CONFIG
───────────────────────────────────────────────────────────── */

interface NavLink {
  label: string
  href: string
  section: string
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
   HOOKS (sem alterações)
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
          let best = { section: 'hero', hue: HERO_HUE, ratio: 0 }
          allSections.forEach(({ section: s, hue: h }) => {
            const r = entries.get(s) ?? 0
            if (r > best.ratio) best = { section: s, hue: h, ratio: r }
          })
          setActive({ section: best.section, hue: best.hue })
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] },
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
    [reduceMotion],
  )
}

/* ─────────────────────────────────────────────────────────────
   Logo — <VA /> em tratamento monospace limpo
───────────────────────────────────────────────────────────── */

function Logo({ onClick, hue }: { onClick: () => void; hue: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      aria-label="Voltar ao topo — Victor M.S.S. Alves"
      className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
    >
      {/* Monogram — clean, sem scanner */}
      <motion.span
        className="relative flex items-center justify-center w-8 h-8 rounded-xl select-none shrink-0"
        style={{
          background: `hsl(${hue} 55% 45% / 0.1)`,
          border: `1px solid hsl(${hue} 55% 60% / 0.22)`,
          transition: 'background 0.8s ease, border-color 0.8s ease',
        }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        aria-hidden="true"
      >
        {/* Shine no hover */}
        <motion.span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 40% 35%, hsl(${hue} 80% 70% / 0.14), transparent 70%)`,
          }}
        />
        <span
          className="relative z-10 font-mono text-[11px] font-bold tracking-[0.06em]"
          style={{
            color: `hsl(${hue} 75% 72%)`,
            transition: 'color 0.8s ease',
          }}
        >
          VA
        </span>
      </motion.span>

      {/* Name + path */}
      <span className="hidden sm:flex flex-col gap-[3px] leading-none">
        <span
          className="font-mono text-[10px] tracking-wider"
          style={{ color: 'var(--color-neutral-600)' }}
          aria-hidden="true"
        >
          // frontend.dev
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--color-neutral-100)' }}
        >
          Victor M.S.S. Alves
        </span>
      </span>
    </a>
  )
}

/* ─────────────────────────────────────────────────────────────
   NavPill — glass limpo + linha de acento na base
───────────────────────────────────────────────────────────── */

function NavPill() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.span
      layoutId="nav-pill"
      className="absolute inset-0 rounded-lg"
      style={{ zIndex: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }
      }
    >
      {/* Glass base */}
      <span
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'rgb(255 255 255 / 0.05)',
          border: '1px solid rgb(255 255 255 / 0.08)',
        }}
      />
      {/* Accent line — base */}
      <span
        className="absolute bottom-0 left-3 right-3 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-300))',
          opacity: 0.65,
        }}
      />
    </motion.span>
  )
}

/* ─────────────────────────────────────────────────────────────
   ActiveBreadcrumb — monospace path no lado direito
───────────────────────────────────────────────────────────── */

function ActiveBreadcrumb({
  activeSection,
  activeHue,
}: {
  activeSection: string
  activeHue: number
}) {
  const label = NAV_LINKS.find((l) => l.section === activeSection)?.label

  return (
    <AnimatePresence mode="wait">
      {label ? (
        <motion.span
          key={activeSection}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
          className="font-mono text-[11px] flex items-center gap-1 select-none"
          aria-live="polite"
          aria-label={`Seção atual: ${label}`}
        >
          <span style={{ color: 'var(--color-neutral-700)' }}>~/</span>
          <motion.span
            style={{ color: `hsl(${activeHue} 65% 65%)`, transition: 'color 0.8s ease' }}
          >
            {label.toLowerCase()}
          </motion.span>
        </motion.span>
      ) : (
        <motion.span
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="font-mono text-[11px] select-none"
          style={{ color: 'var(--color-neutral-700)' }}
          aria-label="Seção atual: Início"
        >
          ~/
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────
   Ambient backdrop stripe
───────────────────────────────────────────────────────────── */

function AmbientStripe({ hue, visible }: { hue: number; visible: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        background: `radial-gradient(ellipse 60% 80% at 50% 0%, hsl(${hue} 60% 30% / 0.10) 0%, transparent 70%)`,
        transition: 'background 0.8s ease',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   Scroll progress
───────────────────────────────────────────────────────────── */

function ScrollProgress({ progress, hue }: { progress: number; hue: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-px origin-left"
      style={{
        scaleX: progress,
        background: `linear-gradient(90deg, hsl(${hue} 80% 55% / 0.8), hsl(${hue} 70% 72% / 0.6))`,
        width: '100%',
        transformOrigin: 'left',
        transition: 'background 0.8s ease',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   CTA Button
───────────────────────────────────────────────────────────── */

function CTAButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      href="mailto:contato@victormssalves.com"
      className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
        fullWidth ? 'w-full justify-center' : ''
      }`}
      style={{
        background: 'var(--color-accent-500)',
        color: '#fff',
      }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {/* Shine sweep */}
      {!shouldReduceMotion && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.16) 50%, transparent 70%)',
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
   Mobile Menu — limpo, sem excessos
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
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 md:hidden"
            style={{
              background: 'rgba(8, 9, 10, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
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
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.97 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 380, damping: 32, mass: 0.85 }
            }
            className="fixed left-3 right-3 z-40 md:hidden rounded-2xl overflow-hidden"
            style={{
              top: 'calc(68px + 8px)',
              background: 'rgba(13, 14, 16, 0.97)',
              border: '1px solid rgb(255 255 255 / 0.07)',
              boxShadow:
                '0 16px 56px rgba(0,0,0,0.75), inset 0 1px 0 rgb(255 255 255 / 0.05)',
              backdropFilter: 'blur(32px)',
            }}
          >
            {/* Ambient glow no topo do painel */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-16 pointer-events-none rounded-t-2xl overflow-hidden"
              style={{
                background: `radial-gradient(ellipse 70% 100% at 50% 0%, hsl(${activeHue} 55% 40% / 0.14), transparent)`,
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
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(link.href, onClose)
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    initial={
                      shouldReduceMotion ? {} : { opacity: 0, x: -8 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: open ? i * 0.035 : 0,
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                    }}
                    className="relative flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
                    style={{
                      color: isActive
                        ? 'var(--color-neutral-50)'
                        : 'var(--color-neutral-400)',
                    }}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgb(255 255 255 / 0.05)',
                          border: '1px solid rgb(255 255 255 / 0.08)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10 font-medium">
                      {link.label}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-dot"
                        className="relative z-10 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: `hsl(${link.hue} 75% 68%)`,
                          boxShadow: `0 0 8px hsl(${link.hue} 75% 65% / 0.6)`,
                        }}
                      />
                    )}
                  </motion.a>
                )
              })}
            </nav>

            {/* Divider */}
            <span
              className="block mx-4"
              style={{
                height: '1px',
                background: 'rgb(255 255 255 / 0.05)',
              }}
            />

            {/* CTA */}
            <div className="p-3">
              <CTAButton fullWidth />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN — Navbar
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
    const fn = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
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
        {/* Layer 1: backdrop */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{
            background: scrolled ? 'rgba(10, 11, 13, 0.82)' : 'rgba(10, 11, 13, 0)',
            backdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'blur(0px)',
            borderBottomColor: scrolled
              ? 'rgb(255 255 255 / 0.05)'
              : 'rgb(255 255 255 / 0)',
          }}
          style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Layer 2: ambient stripe */}
        <AmbientStripe hue={activeHue} visible={scrolled} />

        {/* Layer 3: scroll progress */}
        <ScrollProgress progress={progress} hue={activeHue} />

        {/* Content */}
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
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(link.href)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className="group relative px-4 py-2 rounded-lg text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
                  style={{
                    color: isActive
                      ? 'var(--color-neutral-50)'
                      : 'var(--color-neutral-400)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {/* Active pill */}
                  {isActive && <NavPill />}

                  {/* Hover bg (somente quando inativo) */}
                  {!isActive && (
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ background: 'rgb(255 255 255 / 0.04)' }}
                    />
                  )}

                  <span className="relative z-10">{link.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Breadcrumb monospace */}
            <ActiveBreadcrumb
              activeSection={activeSection}
              activeHue={activeHue}
            />

            {/* Separator */}
            <span
              className="w-px h-4 shrink-0"
              style={{ background: 'rgb(255 255 255 / 0.09)' }}
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
            className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]"
            style={{
              background: mobileOpen
                ? `hsl(${activeHue} 40% 35% / 0.18)`
                : 'rgb(255 255 255 / 0.04)',
              border: `1px solid ${
                mobileOpen
                  ? `hsl(${activeHue} 50% 55% / 0.22)`
                  : 'rgb(255 255 255 / 0.07)'
              }`,
              color: mobileOpen
                ? `hsl(${activeHue} 70% 72%)`
                : 'var(--color-neutral-400)',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={
                    shouldReduceMotion
                      ? {}
                      : { opacity: 0, rotate: -45, scale: 0.7 }
                  }
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? {}
                      : { opacity: 0, rotate: 45, scale: 0.7 }
                  }
                  transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
                >
                  <X size={16} strokeWidth={1.5} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={
                    shouldReduceMotion
                      ? {}
                      : { opacity: 0, rotate: 45, scale: 0.7 }
                  }
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? {}
                      : { opacity: 0, rotate: -45, scale: 0.7 }
                  }
                  transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
                >
                  <Menu size={16} strokeWidth={1.5} aria-hidden="true" />
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