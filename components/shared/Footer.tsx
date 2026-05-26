'use client'

import { motion } from 'motion/react'
import { ArrowUpRight, GitBranch, Mail, Heart } from 'lucide-react'

function LinkedinIcon({ size = 14, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Início',       href: '#hero'      },
  { label: 'Identidade',   href: '#identity'  },
  { label: 'Stack',        href: '#orbit'     },
  { label: 'Trajetória',   href: '#timeline'  },
  { label: 'Projetos',     href: '#projects'  },
  //{ label: 'Terminal',     href: '#terminal'  },
]

const SOCIAL_LINKS = [
  {
    label:    'GitHub',
    href:     'https://github.com/gitvictoralves',
    icon:     GitBranch,
    username: '@gitvictoralves',
  },
  {
    label:    'LinkedIn',
    href:     'https://linkedin.com/in/victormssalves',
    icon:     LinkedinIcon,
    username: 'victormssalves',
  },
  {
    label:    'E-mail',
    href:     'mailto:contato@victormssalves.com',
    icon:     Mail,
    username: 'contato@victormssalves.com',
  },
]

/* ─────────────────────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.0, 0, 0.2, 1] as [number, number, number, number], delay },
  }),
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      aria-label="Rodapé"
      className="relative mt-8 border-t"
      style={{ borderColor: 'rgb(255 255 255 / 0.06)' }}
    >
      {/* Ambient top gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(79 53 214 / 0.4), transparent)',
        }}
      />

      <div className="container mx-auto max-w-screen-xl px-6 pt-16 pb-10">
        {/* ── Grid principal ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Col 1 — identidade */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-col gap-5"
          >
            {/* Logotipo / nome */}
            <div>
              <p
                className="text-gradient text-2xl font-semibold leading-tight tracking-tight"
              >
                Victor M. S. S. Alves
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: 'var(--color-accent-400)' }}
              >
                Frontend Developer
              </p>
            </div>

            {/* Tagline */}
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              Construindo interfaces premium, acessíveis e orientadas ao produto, da ideia ao deploy.
            </p>

            {/* Status pill */}
            <div className="inline-flex w-fit items-center gap-2">
              <span
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  background: 'rgb(34 197 94 / 0.08)',
                  borderColor: 'rgb(34 197 94 / 0.20)',
                  color: 'var(--color-success)',
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ backgroundColor: 'var(--color-success)' }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-success)' }}
                  />
                </span>
                Disponível para oportunidades
              </span>
            </div>
          </motion.div>

          {/* Col 2 — navegação */}
          <motion.div
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <p
              className="mb-4 text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              Navegação
            </p>
            <nav aria-label="Links de navegação do rodapé">
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex w-fit items-center gap-1 text-sm transition-colors duration-150"
                      style={{ color: 'var(--color-neutral-400)' }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color =
                          'var(--color-neutral-100)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color =
                          'var(--color-neutral-400)'
                      }}
                    >
                      <span className="h-px w-0 rounded-full transition-all duration-200 group-hover:w-3"
                        style={{ background: 'var(--color-accent-400)', display: 'inline-block', marginBottom: 1 }}
                        aria-hidden="true"
                      />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Col 3 — contato */}
          <motion.div
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <p
              className="mb-4 text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              Contato
            </p>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, username }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex items-center gap-2.5 transition-all duration-150"
                    style={{ color: 'var(--color-neutral-400)' }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color =
                        'var(--color-neutral-100)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color =
                        'var(--color-neutral-400)'
                    }}
                  >
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-150"
                      style={{
                        background: 'rgb(255 255 255 / 0.04)',
                        borderColor: 'rgb(255 255 255 / 0.08)',
                      }}
                    >
                      <Icon size={13} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="text-xs">{username}</span>
                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Divider ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="my-10 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.08), transparent)',
          }}
        />

        {/* ── Bottom bar ───────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={0.3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <p
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            {year} Victor Alves — Feito com
            <Heart
              size={11}
              strokeWidth={1.5}
              aria-label="amor"
              style={{ color: 'var(--color-error)' }}
            />
            em Salvador, BA
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gitvictoralves/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors duration-150"
              style={{ color: 'var(--color-neutral-400)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--color-neutral-300)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--color-neutral-400)'
              }}
              aria-label="Ver código fonte no GitHub"
            >
              Código fonte
            </a>

            <span
              aria-hidden="true"
              style={{ color: 'var(--color-neutral-700)' }}
              className="text-xs select-none"
            >
              ·
            </span>

            <span
              className="text-xs"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              MIT License
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}