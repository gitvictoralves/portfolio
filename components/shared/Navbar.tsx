'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface NavLink {
  label: string
  href: string
  section: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Sobre',      href: '#identity',  section: 'identity'  },
  { label: 'Stack',      href: '#orbit',     section: 'orbit'     },
  { label: 'Trajetória', href: '#timeline',  section: 'timeline'  },
  { label: 'Projetos',   href: '#projects',  section: 'projects'  },
  { label: 'Dashboard',  href: '#dashboard', section: 'dashboard' },
 // { label: 'Terminal',   href: '#terminal',  section: 'terminal'  },
]

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [mobileOpen, setMobileOpen]     = useState(false)
  const shouldReduceMotion              = useReducedMotion()
  const indicatorRef                    = useRef<HTMLSpanElement>(null)
  const navRef                          = useRef<HTMLElement>(null)

  // ── Scroll detection ──────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Active section via IntersectionObserver ─
  useEffect(() => {
    const sections = ['hero', ...NAV_LINKS.map((l) => l.section)]
    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // ── Close mobile menu on resize ──────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Smooth scroll helper ──────────────────
  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      // Lenis will intercept if available; native fallback
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <header
        ref={navRef}
        role="banner"
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-[var(--duration-slow)]',
          scrolled ? 'py-3' : 'py-5',
        ].join(' ')}
      >
        {/* ── Backdrop ───────────────────── */}
        <div
          aria-hidden="true"
          className={[
            'absolute inset-0 transition-all duration-[var(--duration-slow)]',
            scrolled
              ? 'bg-[var(--color-neutral-900)]/80 backdrop-blur-xl border-b border-white/[0.06]'
              : 'bg-transparent',
          ].join(' ')}
        />

        {/* ── Inner ──────────────────────── */}
        <div className="relative container mx-auto max-w-screen-xl px-6 flex items-center justify-between">

          {/* Logo / wordmark */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
            aria-label="Voltar ao topo"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] rounded-md"
          >
            {/* Monogram */}
            <span
              className={[
                'flex items-center justify-center w-8 h-8 rounded-md text-xs font-semibold',
                'bg-[var(--color-accent-500)]/15 border border-[var(--color-accent-500)]/30',
                'text-[var(--color-accent-300)]',
                'transition-all duration-[var(--duration-fast)]',
                'group-hover:bg-[var(--color-accent-500)]/25 group-hover:border-[var(--color-accent-500)]/50',
                'group-hover:shadow-[var(--glow-accent)]',
              ].join(' ')}
              aria-hidden="true"
            >
              VA
            </span>

            <span className="text-sm font-medium text-[var(--color-neutral-200)] group-hover:text-[var(--color-neutral-50)] transition-colors duration-[var(--duration-fast)] hidden sm:block">
              Victor M. S. S. Alves
            </span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section
              return (
                <a
                  key={link.section}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative px-3.5 py-2 rounded-md text-sm transition-all duration-[var(--duration-fast)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]',
                    isActive
                      ? 'text-[var(--color-neutral-50)]'
                      : 'text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-200)]',
                  ].join(' ')}
                >
                  {/* Active pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-white/[0.07] border border-white/[0.10]"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:contato@victormssalves.com"
              className={[
                'px-4 py-2 rounded-md text-sm font-medium',
                'bg-[var(--color-accent-500)] text-white',
                'hover:bg-[var(--color-accent-400)]',
                'hover:shadow-[var(--glow-accent)]',
                'transition-all duration-[var(--duration-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
              ].join(' ')}
            >
              Contato
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className={[
              'md:hidden flex items-center justify-center w-9 h-9 rounded-md',
              'text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-100)]',
              'hover:bg-white/[0.06]',
              'transition-all duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]',
            ].join(' ')}
          >
            {mobileOpen
              ? <X size={20} strokeWidth={1.5} aria-hidden="true" />
              : <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            }
          </button>
        </div>
      </header>

      {/* ── Mobile menu ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Menu de navegação"
            aria-modal="true"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
            className={[
              'fixed top-[60px] left-4 right-4 z-40 rounded-xl',
              'bg-[var(--color-neutral-800)]/95 backdrop-blur-xl',
              'border border-white/[0.08]',
              'shadow-[var(--shadow-lg)]',
              'p-2',
            ].join(' ')}
          >
            <nav aria-label="Navegação mobile">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.section
                return (
                  <motion.a
                    key={link.section}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                    aria-current={isActive ? 'page' : undefined}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={[
                      'flex items-center justify-between px-4 py-3 rounded-lg text-sm',
                      'transition-colors duration-[var(--duration-fast)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]',
                      isActive
                        ? 'bg-white/[0.07] text-[var(--color-neutral-50)]'
                        : 'text-[var(--color-neutral-300)] hover:bg-white/[0.04] hover:text-[var(--color-neutral-100)]',
                    ].join(' ')}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-400)]"
                        aria-hidden="true"
                      />
                    )}
                  </motion.a>
                )
              })}
            </nav>

            {/* Mobile CTA */}
            <div className="mt-2 pt-2 border-t border-white/[0.06] px-2 pb-1">
              <a
                href="mailto:contato@victormssalves.com"
                className={[
                  'flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium',
                  'bg-[var(--color-accent-500)] text-white',
                  'hover:bg-[var(--color-accent-400)]',
                  'transition-all duration-[var(--duration-fast)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]',
                ].join(' ')}
              >
                Entrar em contato
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay escuro por trás do menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}