'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, MapPin, Terminal } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Variants
───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.0, 0, 0.2, 1] as [number, number, number, number], delay },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const wordVariant = {
  hidden: { opacity: 0, y: 32, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: [0.0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

/* ─────────────────────────────────────────────────────────────
   Spotlight — follows mouse
───────────────────────────────────────────────────────────── */

function Spotlight() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  const bgX = useTransform(springX, (v) => `${v}px`)
  const bgY = useTransform(springY, (v) => `${v}px`)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mouseX, mouseY])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10"
        style={{
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgb(79 53 214 / 0.10) 0%, transparent 70%)',
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
   Animated headline words
───────────────────────────────────────────────────────────── */

function AnimatedHeadline() {
  const line1 = ['Interfaces', 'que']
  const line2 = ['encantam,']
  const line3 = ['código', 'que', 'dura.']

  return (
    <div
      className="perspective-[1200px] mb-6"
      style={{ perspective: '1200px' }}
      aria-label="Interfaces que encantam, código que dura."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="font-semibold leading-[1.05] tracking-tight"
        style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
        aria-hidden="true"
      >
        {/* Line 1 */}
        <div className="flex flex-wrap gap-x-[0.25em]">
          {line1.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="text-gradient inline-block"
              style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Line 2 */}
        <div className="flex flex-wrap gap-x-[0.25em]">
          {line2.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="text-gradient-accent inline-block"
              style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Line 3 */}
        <div className="flex flex-wrap gap-x-[0.25em]">
          {line3.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="text-gradient inline-block"
              style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Status pill
───────────────────────────────────────────────────────────── */

function StatusPill() {
  return (
    <motion.div
      custom={0}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="inline-flex items-center gap-2 mb-8"
    >
      <span
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-full
          glass-2 text-xs font-medium
          border border-[var(--color-accent-500)]/25
          text-[var(--color-accent-300)]
        "
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]" />
        </span>
        Disponível para novas oportunidades
      </span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   CTA buttons
───────────────────────────────────────────────────────────── */

function CTAButtons() {
  return (
    <motion.div
      custom={0.5}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3 mt-8"
    >
      {/* Primary */}
      <a
        href="#projects"
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-md
          bg-[var(--color-accent-500)] text-white font-medium text-sm
          hover:bg-[var(--color-accent-400)]
          transition-all duration-[var(--duration-fast)]
          focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
          shadow-[var(--glow-accent)] hover:shadow-[var(--glow-accent-strong)]
        "
      >
        Ver projetos
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </a>

      {/* Secondary 
      <a
        href="#terminal"
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-md
          bg-white/5 border border-white/10 text-[var(--color-neutral-200)] text-sm font-medium
          hover:bg-white/8 hover:border-white/16
          transition-all duration-[var(--duration-fast)]
          focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
        "
      >
        <Terminal size={16} strokeWidth={1.5} aria-hidden="true" />
        Perguntar ao terminal
      </a>*/}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Meta strip (location + role)
───────────────────────────────────────────────────────────── */

function MetaStrip() {
  return (
    <motion.div
      custom={0.65}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-10"
    >
      <span className="flex items-center gap-1.5 text-xs text-[var(--color-neutral-400)]">
        <MapPin size={13} strokeWidth={1.5} aria-hidden="true" />
        Salvador, Bahia — BR
      </span>

      <span aria-hidden="true" className="text-[var(--color-neutral-400)] text-xs select-none">·</span>

      <span className="text-xs text-[var(--color-neutral-400)]">
        Frontend Developer
      </span>

      <span aria-hidden="true" className="text-[var(--color-neutral-400)] text-xs select-none">·</span>

      <span className="text-xs text-[var(--color-neutral-400)]">
        React · TypeScript · Next.js
      </span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Scroll indicator
───────────────────────────────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-widest text-[var(--color-neutral-400)]">
        scroll
      </span>
      <div className="w-px h-10 bg-gradient-to-b from-[var(--color-neutral-400)] to-transparent" />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Decorative background grid lines
───────────────────────────────────────────────────────────── */

function HeroGridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {[20, 50, 80].map((top) => (
        <motion.div
          key={top}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.0, 0, 0.2, 1] as [number, number, number, number] }}
          style={{ top: `${top}%` }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent origin-left"
        />
      ))}

      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.0, 0, 0.2, 1] as [number, number, number, number] }}
        className="absolute top-0 bottom-0 left-[12%] w-px bg-gradient-to-b from-transparent via-[var(--color-accent-500)]/10 to-transparent origin-top"
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Hero Photo — coluna direita
   
   Coloque sua foto em: /public/photo.webp
   Dimensões recomendadas: 600×800px (portrait) ou 800×800px (square)
   Formato: WebP (melhor compressão + qualidade para Next.js Image)
───────────────────────────────────────────────────────────── */

function HeroPhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.0, 0, 0.2, 1], delay: 0.4 }}
      className="relative hidden lg:flex items-end justify-center"
      aria-hidden="true"
    >
      {/* Glow blob atrás da foto */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full -z-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(79 53 214 / 0.25) 0%, transparent 70%)' }}
      />

      {/* Moldura com glass + borda accent
          — aspect-ratio 3/4 fixo: portrait garantido independente da foto */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: 'min(380px, 38vw)',
          aspectRatio: '3 / 4',
          boxShadow: '0 0 0 1px rgb(255 255 255 / 0.08), 0 32px 64px rgb(0 0 0 / 0.5), var(--glow-accent)',
        }}
      >
        {/* Linha accent no topo da moldura */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgb(122 98 232 / 0.6), transparent)',
          }}
        />

        {/*
          ─── INSTRUÇÃO DE USO ───────────────────────────────────
          1. Converta sua foto para WebP:
             - Online: squoosh.app ou convertio.co
             - CLI: cwebp foto.jpg -o photo.webp -q 85

          2. Coloque o arquivo em: /public/photo.webp

          O container sempre mantém portrait 3:4 — qualquer proporção
          de foto funciona, o Next.js Image com fill + object-cover
          recorta e centraliza automaticamente no topo do rosto.
          ────────────────────────────────────────────────────────
        */}
        <Image
          src="/photo.webp"
          alt="Victor Manoel Soares Silva Alves — Frontend Developer"
          fill
          priority
          quality={90}
          className="object-cover object-top"
        />

        {/* Fade para baixo — integra a foto ao fundo */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 z-10"
          style={{
            background: 'linear-gradient(to top, var(--color-neutral-900) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Badge flutuante — stack no canto inferior esquerdo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.0, 0, 0.2, 1] }}
        className="absolute bottom-8 -left-6 glass-2 rounded-xl px-4 py-3 flex items-center gap-3 z-20"
        style={{ border: '1px solid rgb(255 255 255 / 0.10)' }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-700), var(--color-accent-500))',
            color: 'var(--color-accent-100)',
          }}
        >
          VA
        </span>
        <div className="leading-tight">
          <p className="text-xs font-medium" style={{ color: 'var(--color-neutral-100)' }}>
            Victor M. S. S. Alves
          </p>
          <p className="text-[10px]" style={{ color: 'var(--color-neutral-400)' }}>
            Frontend Developer
          </p>
        </div>
        {/* Status dot */}
        <span className="relative flex h-2 w-2 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]" />
        </span>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden">
      {/* Mouse spotlight */}
      <Spotlight />

      {/* Decorative background lines */}
      <HeroGridLines />

      {/* Content — two-column on lg+ */}
      <div className="container mx-auto max-w-screen-xl px-6 pt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">

          {/* ── Left col — copy ─────────────────────────────── */}
          <div className="max-w-xl">
            {/* Status */}
            <StatusPill />

            {/* Name */}
            <motion.p
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xs font-medium uppercase tracking-widest text-[var(--color-neutral-400)] mb-4"
            >
              Victor Manoel Soares Silva Alves
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline />

            {/* Description */}
            <motion.p
              custom={0.45}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-[var(--color-neutral-300)] text-lg leading-relaxed max-w-xl"
            >
              Desenvolvedor Front-end focado em experiências premium, acessíveis e orientadas ao produto.
              Da ideia ao deploy, cada detalhe importa.
            </motion.p>

            {/* CTAs */}
            <CTAButtons />

            {/* Meta */}
            <MetaStrip />
          </div>

          {/* ── Right col — photo ───────────────────────────── */}
          <HeroPhoto />
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </div>
  )
}