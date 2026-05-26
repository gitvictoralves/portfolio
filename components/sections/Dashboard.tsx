"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  GitCommit,
  Star,
  Flame,
  Layers,
  Code2,
  Rocket,
  TrendingUp,
  Calendar,
  Activity,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

interface Metric {
  id: string;
  label: string;
  value: number | string;
  suffix?: string;
  delta?: string;
  description: string;
  icon: React.ElementType;
  tier: "primary" | "secondary";
}

interface ActivityDay {
  date: string;
  count: number;
}

export interface TopLanguage {
  name: string;
  color: string;
  pct: number;
}

export interface GitHubData {
  totalStars: number;
  totalRepos: number;
  totalCommitsThisYear: number;
  streak: number;
  activityDays: ActivityDay[];
  topLanguages: TopLanguage[]; // ← novo
}

interface DashboardProps {
  githubData: GitHubData | null;
}

/* ─────────────────────────────────────────────────────────────
   FALLBACK ACTIVITY — usado quando githubData é null
───────────────────────────────────────────────────────────── */

function generateFallbackActivity(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const now = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const w = d.getDay();
    const base = w === 0 || w === 6 ? 0.3 : 0.65;
    const r = Math.random();
    days.push({
      date: d.toISOString().slice(0, 10),
      count:
        r < base * 0.25
          ? 0
          : r < base * 0.5
            ? 1
            : r < base * 0.75
              ? 2
              : r < base * 0.9
                ? 3
                : 4,
    });
  }
  return days;
}

const FALLBACK_ACTIVITY = generateFallbackActivity();

/* ─────────────────────────────────────────────────────────────
   STATIC DATA (não vem da API)
───────────────────────────────────────────────────────────── */

const LEARNING_CURVE = [
  { month: "Jan 24", skills: 2 },
  { month: "Mar 24", skills: 4 },
  { month: "Mai 24", skills: 6 },
  { month: "Jul 24", skills: 9 },
  { month: "Set 24", skills: 11 },
  { month: "Nov 24", skills: 13 },
  { month: "Jan 25", skills: 15 },
  { month: "Mar 25", skills: 16 },
  { month: "Mai 25", skills: 18 },
];

const TECH_DIST = [
  {
    label: "Frontend",
    pct: 68,
    color: "var(--color-accent-400)",
    bgColor: "rgb(79 53 214 / 0.12)",
    textColor: "var(--color-accent-300)",
  },
  {
    label: "Tooling",
    pct: 15,
    color: "var(--color-neutral-300)",
    bgColor: "rgb(255 255 255 / 0.06)",
    textColor: "var(--color-neutral-300)",
  },
  {
    label: "Backend",
    pct: 10,
    color: "var(--color-info)",
    bgColor: "rgb(56 189 248 / 0.1)",
    textColor: "var(--color-info)",
  },
  {
    label: "Design",
    pct: 5,
    color: "var(--color-success)",
    bgColor: "rgb(34 197 94 / 0.1)",
    textColor: "var(--color-success)",
  },
  {
    label: "IA & APIs",
    pct: 2,
    color: "var(--color-warning)",
    bgColor: "rgb(245 158 11 / 0.1)",
    textColor: "var(--color-warning)",
  },
];

/* ─────────────────────────────────────────────────────────────
   BUILD METRICS — mescla dados reais com estáticos
───────────────────────────────────────────────────────────── */

function buildMetrics(githubData: GitHubData | null): Metric[] {
  return [
    {
      id: "projects",
      label: "Projetos entregues",
      value: 3,
      delta: "+2 este ano",
      description: "Com deploy em produção",
      icon: Rocket,
      tier: "primary",
    },
    {
      id: "commits",
      label: "Commits em 2025",
      value: githubData?.totalCommitsThisYear ?? 347,
      delta: "+28 esta semana",
      description: "Cadência consistente",
      icon: GitCommit,
      tier: "primary",
    },
    {
      id: "streak",
      label: "Streak atual",
      value: githubData?.streak ?? 28,
      suffix: "d",
      delta: "Recorde pessoal",
      description: "Dias consecutivos no GitHub",
      icon: Flame,
      tier: "primary",
    },
    {
      id: "technologies",
      label: "Tecnologias",
      value: 18,
      description: "No stack principal",
      icon: Layers,
      tier: "secondary",
    },
    {
      id: "years",
      label: "Anos de estudo",
      value: 3,
      suffix: "+",
      description: "Formação contínua",
      icon: TrendingUp,
      tier: "secondary",
    },
    {
      id: "stars",
      label: "GitHub Stars",
      value: githubData?.totalStars ?? 24,
      description: "Em repos públicos",
      icon: Star,
      tier: "secondary",
    },
    {
      id: "lines",
      label: "Linhas de código",
      value: "40k",
      suffix: "+",
      description: "Entre todos os projetos",
      icon: Code2,
      tier: "secondary",
    },
    {
      id: "deploys",
      label: "Deploys",
      value: 3,
      description: "Vercel · GitHub Pages",
      icon: Activity,
      tier: "secondary",
    },
  ];
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */

function useCounter(target: number, inView: boolean, duration = 1000) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || !ref.current) return;
    started.current = true;
    const start = performance.now();
    let rafId: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      if (ref.current)
        ref.current.textContent = String(Math.round(ease * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  return ref;
}

/* ─────────────────────────────────────────────────────────────
   PRIMARY METRIC CARD
───────────────────────────────────────────────────────────── */

function PrimaryMetricCard({
  metric,
  index,
}: {
  metric: Metric;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();
  const Icon = metric.icon;
  const isNumeric = typeof metric.value === "number";
  const counterRef = useCounter(
    isNumeric ? (metric.value as number) : 0,
    inView && isNumeric,
    900 + index * 100,
  );

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0, 0, 0.2, 1], delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:border-[var(--color-accent-500)]/40"
      style={{ background: "rgb(255 255 255 / 0.04)" }}
    >
      {/* Top gradient line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent-400), transparent)",
        }}
      />

      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgb(79 53 214 / 0.08), transparent)",
        }}
      />

      <div className="relative flex flex-col gap-5">
        {/* Icon row */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "rgb(79 53 214 / 0.12)" }}
          >
            <Icon
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              style={{ color: "var(--color-accent-400)" }}
            />
          </div>
          {metric.delta && (
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: "rgb(34 197 94 / 0.1)",
                color: "var(--color-success)",
              }}
            >
              <ArrowUpRight size={10} strokeWidth={2} aria-hidden="true" />
              {metric.delta}
            </span>
          )}
        </div>

        {/* Value */}
        <div>
          <div
            className="mb-1 font-semibold tabular-nums leading-none"
            style={{
              fontSize: "clamp(32px, 4vw, 44px)",
              color: "var(--color-neutral-50)",
            }}
            aria-label={`${metric.value}${metric.suffix ?? ""} ${metric.label}`}
          >
            {isNumeric ? (
              <>
                <span ref={counterRef}>0</span>
                {metric.suffix && (
                  <span
                    className="ml-0.5 text-2xl font-medium"
                    style={{ color: "var(--color-neutral-400)" }}
                  >
                    {metric.suffix}
                  </span>
                )}
              </>
            ) : (
              <span>
                {metric.value}
                {metric.suffix && (
                  <span
                    className="ml-0.5 text-2xl font-medium"
                    style={{ color: "var(--color-neutral-400)" }}
                  >
                    {metric.suffix}
                  </span>
                )}
              </span>
            )}
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-neutral-300)" }}
          >
            {metric.label}
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--color-neutral-400)" }}
          >
            {metric.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECONDARY METRIC CARD
───────────────────────────────────────────────────────────── */

function SecondaryMetricCard({
  metric,
  index,
}: {
  metric: Metric;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();
  const Icon = metric.icon;
  const isNumeric = typeof metric.value === "number";
  const counterRef = useCounter(
    isNumeric ? (metric.value as number) : 0,
    inView && isNumeric,
    700 + index * 80,
  );

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay: index * 0.05 }}
      className="group flex items-center gap-4 rounded-lg border border-white/6 px-4 py-3.5 transition-all duration-200 hover:border-white/12 hover:bg-white/3"
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
        style={{ background: "rgb(255 255 255 / 0.06)" }}
      >
        <Icon
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          style={{ color: "var(--color-neutral-400)" }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-xs truncate"
          style={{ color: "var(--color-neutral-400)" }}
        >
          {metric.label}
        </p>
        <p
          className="text-[10px] truncate"
          style={{ color: "var(--color-neutral-400)" }}
        >
          {metric.description}
        </p>
      </div>

      <div
        className="text-xl font-semibold tabular-nums flex-shrink-0"
        style={{ color: "var(--color-neutral-100)" }}
        aria-label={`${metric.value}${metric.suffix ?? ""}`}
      >
        {isNumeric ? (
          <>
            <span ref={counterRef}>0</span>
            {metric.suffix && (
              <span
                className="text-sm"
                style={{ color: "var(--color-neutral-400)" }}
              >
                {metric.suffix}
              </span>
            )}
          </>
        ) : (
          <span>
            {metric.value}
            {metric.suffix && (
              <span
                className="text-sm"
                style={{ color: "var(--color-neutral-400)" }}
              >
                {metric.suffix}
              </span>
            )}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACTIVITY HEATMAP — agora recebe days como prop
───────────────────────────────────────────────────────────── */

function ActivityHeatmap({ days }: { days: ActivityDay[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  const weeks: ActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const levelColor = (count: number) => {
    switch (count) {
      case 0:
        return "rgb(255 255 255 / 0.05)";
      case 1:
        return "rgb(79 53 214 / 0.22)";
      case 2:
        return "rgb(79 53 214 / 0.42)";
      case 3:
        return "rgb(79 53 214 / 0.65)";
      case 4:
        return "var(--color-accent-400)";
      default:
        return "rgb(255 255 255 / 0.05)";
    }
  };

  return (
    <div ref={ref}>
      <div
        role="img"
        aria-label="Mapa de atividade no GitHub — 16 semanas"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gap: 4,
        }}
      >
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            {week.map((day, di) => (
              <motion.div
                key={day.date}
                initial={
                  shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }
                }
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.18,
                  delay: shouldReduce ? 0 : (wi * 7 + di) * 0.003,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                title={`${day.date}: ${day.count} contribuição${day.count !== 1 ? "ões" : ""}`}
                style={{
                  aspectRatio: "1",
                  borderRadius: 3,
                  background: levelColor(day.count),
                  width: "100%",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="text-[11px]"
          style={{ color: "var(--color-neutral-400)" }}
        >
          Menos
        </span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div
            key={l}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: levelColor(l),
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
        ))}
        <span
          className="text-[11px]"
          style={{ color: "var(--color-neutral-400)" }}
        >
          Mais
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LEARNING CURVE
───────────────────────────────────────────────────────────── */

function LearningChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  const W = 320;
  const H = 96;
  const maxSkills = Math.max(...LEARNING_CURVE.map((p) => p.skills));
  const pad = { x: 4, y: 8 };

  const pts = LEARNING_CURVE.map((p, i) => ({
    x: pad.x + (i / (LEARNING_CURVE.length - 1)) * (W - pad.x * 2),
    y: H - pad.y - (p.skills / maxSkills) * (H - pad.y * 2),
    ...p,
  }));

  const smoothD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${smoothD} L ${pts.at(-1)!.x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label="Curva de aprendizado de habilidades dominadas por mês"
        overflow="visible"
      >
        <defs>
          <linearGradient id="lgCurve" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(79 53 214)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(79 53 214)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="clipChart">
            <rect x={pad.x} y={0} width={W - pad.x * 2} height={H} />
          </clipPath>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = H - pad.y - t * (H - pad.y * 2);
          return (
            <line
              key={t}
              x1={pad.x}
              y1={y}
              x2={W - pad.x}
              y2={y}
              stroke="rgb(255 255 255 / 0.04)"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaD} fill="url(#lgCurve)" clipPath="url(#clipChart)" />

        <motion.path
          d={smoothD}
          fill="none"
          stroke="var(--color-accent-400)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={
            shouldReduce
              ? {}
              : { duration: 1.4, ease: [0, 0, 0.2, 1], delay: 0.1 }
          }
        />

        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="var(--color-accent-400)"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={
              shouldReduce
                ? {}
                : {
                    duration: 0.25,
                    delay: 0.15 + i * 0.09,
                    ease: [0.34, 1.56, 0.64, 1],
                  }
            }
          >
            <title>
              {p.month}: {p.skills} skills
            </title>
          </motion.circle>
        ))}

        <text
          x={pad.x}
          y={H + 12}
          fontSize="9"
          fill="var(--color-neutral-400)"
          textAnchor="start"
        >
          {LEARNING_CURVE[0].month}
        </text>
        <text
          x={W - pad.x}
          y={H + 12}
          fontSize="9"
          fill="var(--color-neutral-400)"
          textAnchor="end"
        >
          {LEARNING_CURVE.at(-1)!.month}
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TECH DISTRIBUTION
───────────────────────────────────────────────────────────── */

function TechDistribution() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-2.5">
      {TECH_DIST.map((item, i) => (
        <div key={item.label} className="group flex items-center gap-3">
          <div className="flex w-20 flex-shrink-0 items-center justify-end gap-1.5">
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: item.bgColor, color: item.textColor }}
            >
              {item.label}
            </span>
          </div>

          <div
            className="flex-1 overflow-hidden rounded-full"
            style={{ height: 5, background: "rgb(255 255 255 / 0.05)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: item.color }}
              initial={{ width: "0%" }}
              animate={inView ? { width: `${item.pct}%` } : {}}
              transition={
                shouldReduce
                  ? {}
                  : {
                      duration: 0.8,
                      ease: [0, 0, 0.2, 1],
                      delay: 0.1 + i * 0.1,
                    }
              }
            />
          </div>

          <span
            className="w-8 flex-shrink-0 text-right text-xs tabular-nums font-medium"
            style={{ color: "var(--color-neutral-400)" }}
          >
            {item.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

function LanguagesPanel({ languages }: { languages: TopLanguage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col gap-2.5">
      {languages.map((lang, i) => (
        <div key={lang.name} className="flex items-center gap-3">
          <div className="flex w-24 flex-shrink-0 items-center justify-end">
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                background: `${lang.color}22`,
                color: lang.color,
                border: `1px solid ${lang.color}44`,
              }}
            >
              {lang.name}
            </span>
          </div>

          <div
            className="flex-1 overflow-hidden rounded-full"
            style={{ height: 5, background: "rgb(255 255 255 / 0.05)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: lang.color }}
              initial={{ width: "0%" }}
              animate={inView ? { width: `${lang.pct}%` } : {}}
              transition={
                shouldReduce
                  ? {}
                  : {
                      duration: 0.8,
                      ease: [0, 0, 0.2, 1],
                      delay: 0.1 + i * 0.1,
                    }
              }
            />
          </div>

          <span
            className="w-8 flex-shrink-0 text-right text-xs tabular-nums font-medium"
            style={{ color: "var(--color-neutral-400)" }}
          >
            {lang.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PANEL WRAPPER
───────────────────────────────────────────────────────────── */

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-5 rounded-xl border border-white/8 p-6"
      style={{ background: "rgb(255 255 255 / 0.03)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent-400)" }}
          >
            {eyebrow}
          </p>
          <h3
            className="text-sm font-medium"
            style={{ color: "var(--color-neutral-200)" }}
          >
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */

export function Dashboard({ githubData }: DashboardProps) {
  const metrics = buildMetrics(githubData);
  const primaryMetrics = metrics.filter((m) => m.tier === "primary");
  const secondaryMetrics = metrics.filter((m) => m.tier === "secondary");

  // Usa dados reais do GitHub, ou fallback gerado localmente
  const activityDays = githubData?.activityDays ?? FALLBACK_ACTIVITY;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Row 1: primary metrics + secondary metrics ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {primaryMetrics.map((m, i) => (
            <PrimaryMetricCard key={m.id} metric={m} index={i} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {secondaryMetrics.map((m, i) => (
            <SecondaryMetricCard key={m.id} metric={m} index={i} />
          ))}
        </div>
      </div>

      {/* ── Row 2: heatmap + curva + dist ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <Panel
          eyebrow="Atividade"
          title="Contribuições no GitHub — últimas 16 semanas"
          action={
            <a
              href="https://github.com/gitvictoralves"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver perfil no GitHub"
              className="flex items-center gap-1 text-xs transition-colors duration-150 hover:text-[var(--color-neutral-200)]"
              style={{ color: "var(--color-neutral-400)" }}
            >
              GitHub
              <ExternalLink size={11} strokeWidth={1.5} aria-hidden="true" />
            </a>
          }
        >
          <ActivityHeatmap days={activityDays} />
        </Panel>

        <div className="flex flex-col gap-4">

          <Panel eyebrow="Stack" title="Distribuição por área">
            <TechDistribution />
          </Panel>
          {githubData?.topLanguages && githubData.topLanguages.length > 0 && (
            <Panel eyebrow="GitHub" title="Linguagens mais usadas">
              <LanguagesPanel languages={githubData.topLanguages} />
            </Panel>
          )}
        </div>
      </div>

      {/* ── Footer ISR note ── */}
      <div
        className="flex items-center gap-2 rounded-lg border border-white/6 px-4 py-2.5"
        style={{ background: "rgb(255 255 255 / 0.02)" }}
      >
        <Calendar
          size={11}
          strokeWidth={1.5}
          aria-hidden="true"
          style={{ color: "var(--color-neutral-400)" }}
        />
        <p
          className="text-[11px]"
          style={{ color: "var(--color-neutral-400)" }}
        >
          Dados do GitHub atualizados via ISR a cada 60 segundos.{" "}
          <a
            href="https://github.com/gitvictoralves"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-[var(--color-neutral-300)]"
          >
            Ver perfil ao vivo →
          </a>
        </p>
      </div>
    </div>
  );
}
