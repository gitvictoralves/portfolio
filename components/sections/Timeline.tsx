"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

type TimelineItemType = "work" | "education" | "achievement";

interface TimelineItem {
  id: string;
  type: TimelineItemType;
  period: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  tags: string[];
  highlights?: string[];
  current?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   DATA — trajetória de Victor
───────────────────────────────────────────────────────────── */

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: "tel-centro",
    type: "work",
    period: "Jun 2025 — Presente",
    title: "Operador de Telemarketing",
    organization: "Tel Centro de Contatos",
    location: "Salvador, BA",
    current: true,
    description:
      "Atendimento receptivo aos segurados do INSS com foco em clareza, empatia e resolução de demandas em alto volume. Rotina que desenvolveu raciocínio lógico, comunicação objetiva e disciplina de processos.",
    tags: [
      "Atendimento ao cliente",
      "Sistemas de gestão",
      "Alto volume",
      "INSS",
    ],
    highlights: [
      "Comunicação objetiva com alto volume de chamadas diárias",
      "Registro preciso de demandas em sistemas internos",
      "Resolução de problemas em tempo real sob pressão",
    ],
  },
  {
    id: "hotel-luar",
    type: "work",
    period: "Fev 2025 — Abr 2025",
    title: "Estagiário Administrativo",
    organization: "Hotel Luar de Itapuã",
    location: "Salvador, BA",
    description:
      "Verificação de pendências, conferência de reservas em sistemas de hospedagem, lançamento de pagamentos em plataformas financeiras e controle de encargos trabalhistas.",
    tags: [
      "Administrativo",
      "Sistemas de hospedagem",
      "Financeiro",
      "Atenção a dados",
    ],
    highlights: [
      "Conferência de reservas e controle de pagamentos",
      "Organização de documentos contábeis",
      "Atuação com múltiplas ferramentas digitais simultaneamente",
    ],
  },
  {
    id: "frontend-dev",
    type: "education",
    period: "2024 — Presente",
    title: "Desenvolvimento Front-end",
    organization: "Formação Técnica Autodidata",
    location: "Online",
    current: true,
    description:
      "Formação contínua em desenvolvimento front-end com foco em React, TypeScript e Next.js. Estudo consistente com projetos práticos e deploy funcionando em produção.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
    highlights: [
      "HTML5 semântico, CSS3 avançado, JavaScript ES6+",
      "React com hooks, componentes funcionais e TypeScript",
      "Projetos com deploy em Vercel e GitHub Pages",
    ],
  },
  {
    id: "compass-scholarship",
    type: "education",
    period: "Ago 2022 — Dez 2022",
    title: "Scholarship Program | Front-end",
    organization: "Compass UOL",
    location: "Online",
    description:
      "Programa intensivo de capacitação em desenvolvimento front-end com carga horária de 240 horas, focado em aplicações modernas, fundamentos web e boas práticas de desenvolvimento.",
    tags: ["Front-end", "Scholarship Program", "240h", "Compass UOL"],
    highlights: [
      "Conclusão com sucesso da trilha Front-end",
      "240 horas de formação prática e teórica",
      "Contato com desenvolvimento de aplicações modernas",
    ],
  },
  {
    id: "ingles-ccaa",
    type: "education",
    period: "2018 — 2023",
    title: "Inglês Avançado — CEFR B1",
    organization: "CCAA",
    location: "Salvador, BA",
    description:
      "Curso avançado de inglês com 528 horas e aproveitamento médio de 84,71%. Certificado TOEFL ETS com nota 520. Leitura de documentação técnica sem dificuldades.",
    tags: ["Inglês B1", "TOEFL 520", "Documentação técnica", "528h"],
    highlights: [
      "528 horas de curso com aproveitamento 84,71%",
      "TOEFL ETS — nota 520",
      "Leitura fluente de documentação técnica em inglês",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

function typeConfig(type: TimelineItemType) {
  switch (type) {
    case "work":
      return {
        icon: Briefcase,
        label: "Trabalho",
        dotColor: "bg-[var(--color-accent-500)]",
        dotGlow: "shadow-[0_0_12px_rgb(79_53_214_/_0.6)]",
        badgeClass:
          "bg-[var(--color-accent-500)]/15 text-[var(--color-accent-300)] border-[var(--color-accent-500)]/25",
      };
    case "education":
      return {
        icon: GraduationCap,
        label: "Formação",
        dotColor: "bg-[var(--color-success)]",
        dotGlow: "shadow-[0_0_12px_rgb(34_197_94_/_0.5)]",
        badgeClass:
          "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
      };
    default:
      return {
        icon: Briefcase,
        label: "Marco",
        dotColor: "bg-[var(--color-warning)]",
        dotGlow: "",
        badgeClass:
          "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
      };
  }
}

/* ─────────────────────────────────────────────────────────────
   CARD DETAIL DRAWER (inline expansion)
───────────────────────────────────────────────────────────── */

interface DetailPanelProps {
  item: TimelineItem;
  onClose: () => void;
}

function DetailPanel({ item, onClose }: DetailPanelProps) {
  const shouldReduce = useReducedMotion();
  const cfg = typeConfig(item.type);
  const Icon = cfg.icon;

  return (
    <motion.div
      key={item.id + "-detail"}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
      animate={shouldReduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
      exit={shouldReduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.0, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-3 glass-2 rounded-xl p-6 border border-white/10 relative">
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="absolute top-4 right-4 p-1.5 rounded-md text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-100)] hover:bg-white/8 transition-all duration-150"
        >
          <X size={14} strokeWidth={1.5} />
        </button>

        {/* header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`p-2 rounded-lg ${item.type === "work" ? "bg-[var(--color-accent-500)]/10" : "bg-[var(--color-success)]/10"}`}
          >
            <Icon
              size={16}
              strokeWidth={1.5}
              className={
                item.type === "work"
                  ? "text-[var(--color-accent-300)]"
                  : "text-[var(--color-success)]"
              }
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-[var(--color-neutral-100)] font-medium text-sm">
              {item.title}
            </p>
            <p className="text-[var(--color-neutral-400)] text-xs">
              {item.organization}
            </p>
          </div>
        </div>

        {/* description */}
        <p className="text-[var(--color-neutral-300)] text-sm leading-relaxed mb-5">
          {item.description}
        </p>

        {/* highlights */}
        {item.highlights && (
          <div className="space-y-2 mb-5">
            {item.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ChevronRight
                  size={13}
                  strokeWidth={1.5}
                  className={`mt-0.5 shrink-0 ${item.type === "work" ? "text-[var(--color-accent-400)]" : "text-[var(--color-success)]"}`}
                  aria-hidden="true"
                />
                <p className="text-[var(--color-neutral-300)] text-xs leading-relaxed">
                  {h}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-sm text-xs font-medium border ${cfg.badgeClass}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE ITEM CARD
───────────────────────────────────────────────────────────── */

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function TimelineCard({
  item,
  index,
  isExpanded,
  onToggle,
}: TimelineCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();
  const cfg = typeConfig(item.type);
  const Icon = cfg.icon;

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: [0.0, 0, 0.2, 1],
        delay: index * 0.08,
      }}
      className="relative pl-8"
    >
      {/* vertical line segment — rendered by the parent */}

      {/* dot */}
      <span
        className={`absolute left-0 top-5 -translate-x-1/2 w-3 h-3 rounded-full ${cfg.dotColor} ${item.current ? cfg.dotGlow : ""} border-2 border-[var(--color-neutral-900)]`}
        aria-hidden="true"
      />

      {/* card */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={`w-full text-left group glass-1 rounded-xl p-5 border transition-all duration-250
          ${
            isExpanded
              ? "border-white/16 bg-white/6"
              : "border-white/8 hover:border-white/14 hover:bg-white/5"
          }`}
      >
        {/* top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${item.type === "work" ? "bg-[var(--color-accent-500)]/10" : "bg-[var(--color-success)]/10"}`}
            >
              <Icon
                size={13}
                strokeWidth={1.5}
                className={
                  item.type === "work"
                    ? "text-[var(--color-accent-400)]"
                    : "text-[var(--color-success)]"
                }
                aria-hidden="true"
              />
            </div>
            <span
              className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${cfg.badgeClass}`}
            >
              {cfg.label}
            </span>
            {item.current && (
              <span className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-success)]" />
                </span>
                Atual
              </span>
            )}
          </div>

          <ArrowRight
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
            className={`shrink-0 mt-0.5 text-[var(--color-neutral-400)] transition-all duration-200
              ${isExpanded ? "rotate-90 text-[var(--color-neutral-300)]" : "group-hover:text-[var(--color-neutral-300)] group-hover:translate-x-0.5"}`}
          />
        </div>

        {/* title */}
        <h3 className="text-[var(--color-neutral-100)] font-medium text-base mb-1 leading-snug">
          {item.title}
        </h3>

        {/* meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[var(--color-neutral-300)] text-sm">
            {item.organization}
          </span>
          <span className="flex items-center gap-1 text-[var(--color-neutral-400)] text-xs">
            <Calendar size={11} strokeWidth={1.5} aria-hidden="true" />
            {item.period}
          </span>
          <span className="flex items-center gap-1 text-[var(--color-neutral-400)] text-xs">
            <MapPin size={11} strokeWidth={1.5} aria-hidden="true" />
            {item.location}
          </span>
        </div>
      </button>

      {/* expanded detail */}
      <AnimatePresence>
        {isExpanded && <DetailPanel item={item} onClose={onToggle} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function Timeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-6">
      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
        {[
          { type: "work" as const, label: "Experiência profissional" },
          { type: "education" as const, label: "Formação" },
        ].map(({ type, label }) => {
          const cfg = typeConfig(type);
          return (
            <div key={type} className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`}
                aria-hidden="true"
              />
              <span className="text-[var(--color-neutral-400)] text-xs">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* vertical track + cards */}
      <div className="relative max-w-2xl">
        {/* continuous vertical line */}
        <div
          className="absolute left-0 top-5 bottom-5 w-px bg-gradient-to-b from-[var(--color-accent-500)]/40 via-[var(--color-neutral-400)] to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-5">
          {TIMELINE_ITEMS.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
