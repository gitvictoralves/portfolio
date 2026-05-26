"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Code2,
  Layers,
  GitCommit,
  Clock4,
  CalendarCheck,
  Globe,
  Mail,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ElementType;
  accent?: boolean;
  index: number;
}

interface TestimonialProps {
  text: string;
  source: string;
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const STATS = [
  {
    value: "3+",
    label: "Anos estudando",
    icon: Clock4,
  },
  {
    value: "3+",
    label: "Projetos em produção",
    icon: Layers,
  },
  {
    value: "528h",
    label: "Inglês certificado",
    icon: Globe,
  },
  {
    value: "100%",
    label: "Commits convencionais",
    icon: GitCommit,
  },
];

const STRENGTHS = [
  {
    icon: Code2,
    title: "Código que comunica",
    description:
      "Escrevo componentes que outros devs entendem na primeira leitura — nomenclatura intencional, tipagem estrita, sem mágica desnecessária.",
  },
  {
    icon: Layers,
    title: "Design thinking técnico",
    description:
      "Venho do atendimento ao público. Traduzo necessidades reais em interfaces que as pessoas realmente usam — com empatia e precisão.",
  },
  {
    icon: CalendarCheck,
    title: "Disponível agora",
    description:
      "Aberto para oportunidades CLT, PJ ou freelance. Entrego com consistência e comunico com clareza desde o primeiro dia.",
  },
];

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */

function StatCard({ value, label, icon: Icon, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: [0.0, 0, 0.2, 1],
        delay: index * 0.07,
      }}
      className="glass-1 rounded-xl p-4 flex flex-col gap-3 border border-white/8 hover:border-white/14 hover:bg-white/5 transition-all duration-250"
    >
      <Icon
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        style={{ color: "var(--color-accent-400)" }}
      />
      <div>
        <p className="text-2xl font-semibold leading-none mb-1 text-gradient">
          {value}
        </p>
        <p
          className="text-xs leading-snug"
          style={{ color: "var(--color-neutral-400)" }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STRENGTH ROW
───────────────────────────────────────────────────────────── */

function StrengthRow({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.45,
        ease: [0.0, 0, 0.2, 1],
        delay: 0.15 + index * 0.08,
      }}
      className="flex items-start gap-4 group"
    >
      {/* Icon container */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-250 group-hover:scale-110"
        style={{
          background: "rgb(79 53 214 / 0.12)",
          border: "1px solid rgb(79 53 214 / 0.20)",
        }}
      >
        <Icon
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
          style={{ color: "var(--color-accent-400)" }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium mb-0.5 leading-snug"
          style={{ color: "var(--color-neutral-100)" }}
        >
          {title}
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--color-neutral-400)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function IdentityComplement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.0, 0, 0.2, 1] }}
      className="flex flex-col gap-8"
    >
      {/* ── Stat grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.08), transparent)",
        }}
      />

      {/* ── Strengths ─────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--color-accent-400)" }}
        >
          Por que trabalhar comigo
        </p>

        <div className="flex flex-col gap-5">
          {STRENGTHS.map((s, i) => (
            <StrengthRow key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.08), transparent)",
        }}
      />

      {/* ── CTA strip ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <a
          href="mailto:contato@victormssalves.com"
          className="
    inline-flex items-center gap-2
    px-5 py-2.5 rounded-md text-sm font-medium
    bg-[var(--color-accent-500)] text-white
    hover:bg-[var(--color-accent-400)]
    shadow-[var(--glow-accent)] hover:shadow-[var(--glow-accent-strong)]
    transition-all duration-[var(--duration-fast)]
    focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
  "
        >
          <Mail size={15} strokeWidth={1.5} aria-hidden="true" />
          Enviar e-mail
        </a>

        <a
          href="#projects"
          className="
            inline-flex items-center gap-2
            px-5 py-2.5 rounded-md text-sm font-medium
            bg-white/5 border border-white/10
            text-[var(--color-neutral-200)]
            hover:bg-white/8 hover:border-white/16
            transition-all duration-[var(--duration-fast)]
            focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
          "
        >
          Ver projetos
          <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </motion.div>
  );
}
