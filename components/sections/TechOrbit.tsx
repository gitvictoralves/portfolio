"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiGit,
  SiGithub,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  SiJest,
  SiAxios,
  SiClaude,
} from "@icons-pack/react-simple-icons";
import { SiGithubcopilot, SiTestinglibrary } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  KanbanSquare,
  RefreshCw,
  WebhookIcon,
  X,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

type Tier = "core" | "learning" | "tools";
type FilterValue = "all" | Tier;

interface TechIconProps {
  size: number;
  color: string;
}

interface Tech {
  id: string;
  name: string;
  brandColor: string;
  tier: Tier;
  category: keyof typeof CATEGORY_LABELS;
  description: string;
  since: string;
  proficiency: number;
  Icon: React.FC<TechIconProps>;
}

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const CATEGORY_LABELS = {
  markup: "Markup",
  scripting: "Scripting",
  framework: "Framework",
  tooling: "Ferramentas",
  design: "Design",
  methodology: "Metodologia",
} as const;

interface TierConfig {
  label: string;
  sublabel: string;
  orbitRadius: number; // percentage of container width
  speed: number; // seconds per revolution
  nodeSize: number; // px
  color: string;
  glowRgb: string;
  description: string;
}

const TIER_CONFIG: Record<Tier, TierConfig> = {
  core: {
    label: "Core",
    sublabel: "Base dominante",
    orbitRadius: 23,
    speed: 50,
    nodeSize: 52,
    color: "rgba(79, 53, 214, 0.9)",
    glowRgb: "79, 53, 214",
    description: "Uso diário com confiança",
  },
  learning: {
    label: "Aprendendo",
    sublabel: "Em evolução ativa",
    orbitRadius: 37,
    speed: 75,
    nodeSize: 44,
    color: "#06B6D4",
    glowRgb: "6, 182, 212",
    description: "Evoluindo rapidamente",
  },
  tools: {
    label: "Ferramentas",
    sublabel: "Ambiente de trabalho",
    orbitRadius: 50,
    speed: 110,
    nodeSize: 38,
    color: "#8B5CF6",
    glowRgb: "139, 92, 246",
    description: "Parte do fluxo diário",
  },
};

const TIER_ORDER: Tier[] = ["core", "learning", "tools"];

const TECHS: Tech[] = [
  // CORE
  {
    id: "html5",
    name: "HTML5",
    brandColor: "#E34F26",
    tier: "core",
    category: "markup",
    description:
      "HTML semântico, acessibilidade (ARIA, roles), SEO on-page, estrutura de documentos e boas práticas de markup.",
    since: "2022",
    proficiency: 85,
    Icon: ({ size, color }) => <SiHtml5 size={size} style={{ color }} />,
  },
  {
    id: "css3",
    name: "CSS3",
    brandColor: "#1572B6",
    tier: "core",
    category: "markup",
    description:
      "Flexbox, Grid, Custom Properties, Media Queries, animações, responsividade e design mobile-first.",
    since: "2022",
    proficiency: 82,
    Icon: ({ size, color }) => <SiCss size={size} style={{ color }} />,
  },
  {
    id: "javascript",
    name: "JavaScript",
    brandColor: "#F7DF1E",
    tier: "core",
    category: "scripting",
    description:
      "ES6+ — arrow functions, destructuring, async/await, módulos, Promises e manipulação do DOM.",
    since: "2022",
    proficiency: 78,
    Icon: ({ size, color }) => <SiJavascript size={size} style={{ color }} />,
  },
  {
    id: "react",
    name: "React",
    brandColor: "#61DAFB",
    tier: "core",
    category: "framework",
    description:
      "Componentes funcionais, hooks (useState, useEffect, useRef, useCallback), props, estado e Context API.",
    since: "2023",
    proficiency: 75,
    Icon: ({ size, color }) => <SiReact size={size} style={{ color }} />,
  },
  {
    id: "git",
    name: "Git",
    brandColor: "#F05032",
    tier: "core",
    category: "tooling",
    description:
      "Versionamento, branching strategies, pull requests, merge, rebase e colaboração em equipe.",
    since: "2023",
    proficiency: 72,
    Icon: ({ size, color }) => <SiGit size={size} style={{ color }} />,
  },
  {
    id: "github",
    name: "GitHub",
    brandColor: "#E6EDF3",
    tier: "core",
    category: "tooling",
    description:
      "Repositórios, Issues, Pull Requests, GitHub Actions (básico) e fluxo de colaboração open source.",
    since: "2023",
    proficiency: 74,
    Icon: ({ size, color }) => <SiGithub size={size} style={{ color }} />,
  },
  // LEARNING
  {
    id: "typescript",
    name: "TypeScript",
    brandColor: "#3178C6",
    tier: "learning",
    category: "scripting",
    description:
      "Tipagem básica, interfaces, tipos utilitários (Partial, Required, Pick) e enums para codebases mais seguras.",
    since: "2024",
    proficiency: 45,
    Icon: ({ size, color }) => <SiTypescript size={size} style={{ color }} />,
  },
  {
    id: "nextjs",
    name: "Next.js",
    brandColor: "#E6EDF3",
    tier: "learning",
    category: "framework",
    description:
      "Roteamento com App Router, SSR, SSG, Server Components e deploy na Vercel.",
    since: "2024",
    proficiency: 40,
    Icon: ({ size, color }) => <SiNextdotjs size={size} style={{ color }} />,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    brandColor: "#06B6D4",
    tier: "learning",
    category: "framework",
    description:
      "Utility-first CSS, tema customizado, variantes responsivas e integração com componentes React.",
    since: "2024",
    proficiency: 52,
    Icon: ({ size, color }) => <SiTailwindcss size={size} style={{ color }} />,
  },
  {
    id: "rest-api",
    name: "REST APIs",
    brandColor: "#FF6C37",
    tier: "learning",
    category: "scripting",
    description:
      "Consumo de APIs com fetch nativo, tratamento de erros, loading states e autenticação via headers.",
    since: "2024",
    proficiency: 48,
    Icon: ({ size, color }) => <WebhookIcon size={size} color={color} />,
  },
  {
    id: "axios",
    name: "Axios",
    brandColor: "#5A29E4",
    tier: "learning",
    category: "scripting",
    description:
      "Cliente HTTP com interceptors, transformações, cancelamento de requisições e integração com APIs REST.",
    since: "2024",
    proficiency: 42,
    Icon: ({ size, color }) => <SiAxios size={size} style={{ color }} />,
  },
  {
    id: "jest",
    name: "Jest",
    brandColor: "#C21325",
    tier: "learning",
    category: "tooling",
    description:
      "Testes unitários com mocks, spies e assertions — estrutura básica de describe/it/expect.",
    since: "2025",
    proficiency: 30,
    Icon: ({ size, color }) => <SiJest size={size} style={{ color }} />,
  },
  {
    id: "testing-library",
    name: "Testing Library",
    brandColor: "#E33B3B",
    tier: "learning",
    category: "tooling",
    description:
      "Testes de componentes React focados no comportamento do usuário — queries por role, text e label.",
    since: "2025",
    proficiency: 28,
    Icon: ({ size, color }) => (
      <SiTestinglibrary size={size} style={{ color }} />
    ),
  },
  // TOOLS
  {
    id: "vscode",
    name: "VS Code",
    brandColor: "#007ACC",
    tier: "tools",
    category: "tooling",
    description:
      "Editor principal — extensões, atalhos, integração Git e terminal integrado.",
    since: "2022",
    proficiency: 80,
    Icon: ({ size, color }) => <VscVscode size={size} color={color} />,
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    brandColor: "#8957E5",
    tier: "tools",
    category: "tooling",
    description:
      "Pair programming assistido por IA — autocompletar, geração de funções e aceleração do fluxo.",
    since: "2024",
    proficiency: 72,
    Icon: ({ size, color }) => (
      <SiGithubcopilot size={size} style={{ color }} />
    ),
  },
  {
    id: "claude",
    name: "Claude (AI)",
    brandColor: "#CC9B7A",
    tier: "tools",
    category: "tooling",
    description:
      "Revisão de código, debugging, documentação e aprendizado de novos conceitos.",
    since: "2024",
    proficiency: 78,
    Icon: ({ size, color }) => <SiClaude size={size} style={{ color }} />,
  },
  {
    id: "figma",
    name: "Figma",
    brandColor: "#F24E1E",
    tier: "tools",
    category: "design",
    description:
      "Leitura de layouts, design tokens, handoff para desenvolvimento e inspeção de componentes.",
    since: "2023",
    proficiency: 60,
    Icon: ({ size, color }) => <SiFigma size={size} style={{ color }} />,
  },
  {
    id: "scrum",
    name: "Scrum",
    brandColor: "#00B4D8",
    tier: "tools",
    category: "methodology",
    description:
      "Sprints, planning, daily standups, retrospectivas e backlog grooming.",
    since: "2023",
    proficiency: 52,
    Icon: ({ size, color }) => <RefreshCw size={size} color={color} />,
  },
  {
    id: "kanban",
    name: "Kanban",
    brandColor: "#0077B6",
    tier: "tools",
    category: "methodology",
    description:
      "Visualização do fluxo de trabalho com boards, WIP limits e otimização contínua.",
    since: "2023",
    proficiency: 55,
    Icon: ({ size, color }) => <KanbanSquare size={size} color={color} />,
  },
];

/* ─────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────── */

function byTierFn(techs: Tech[], tier: Tier): Tech[] {
  return techs.filter((t) => t.tier === tier);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: ORBIT NODE
───────────────────────────────────────────────────────────── */

interface OrbitNodeProps {
  tech: Tech;
  index: number;
  total: number;
  isSelected: boolean;
  isPaused: boolean;
  onSelect: (tech: Tech | null) => void;
}

function OrbitNode({
  tech,
  index,
  total,
  isSelected,
  isPaused,
  onSelect,
}: OrbitNodeProps) {
  const shouldReduceMotion = useReducedMotion();
  const conf = TIER_CONFIG[tech.tier];
  const angleOffset = (360 / total) * index;
  const duration = shouldReduceMotion ? 99999 : conf.speed;
  const iconSize = Math.round(conf.nodeSize * 0.42);

  return (
    <motion.div
      className="absolute"
      style={{ left: "50%", top: "50%", width: 0, height: 0 }}
      animate={
        isPaused || shouldReduceMotion
          ? { rotate: angleOffset }
          : { rotate: [angleOffset, angleOffset + 360] }
      }
      transition={{
        duration,
        repeat: isPaused || shouldReduceMotion ? 0 : Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `calc(${conf.orbitRadius}cqw - ${conf.nodeSize / 2}px)`,
          top: `-${conf.nodeSize / 2}px`,
        }}
      >
        <motion.div
          animate={
            isPaused || shouldReduceMotion
              ? { rotate: -angleOffset }
              : { rotate: [-angleOffset, -(angleOffset + 360)] }
          }
          transition={{
            duration,
            repeat: isPaused || shouldReduceMotion ? 0 : Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          <motion.button
            aria-label={`Detalhes de ${tech.name}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? null : tech)}
            className="group relative flex items-center justify-center focus-visible:outline-none"
            style={{ width: conf.nodeSize, height: conf.nodeSize }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.18 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Selected ring */}
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 0 2px ${tech.brandColor}cc, 0 0 24px ${tech.brandColor}50`,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Hover ring */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                boxShadow: `0 0 0 1px ${tech.brandColor}55, 0 0 14px ${tech.brandColor}28`,
              }}
            />

            {/* Glass body */}
            <span
              className="absolute inset-0 rounded-full transition-all duration-200"
              style={{
                background: isSelected
                  ? `${tech.brandColor}1a`
                  : "rgb(255 255 255 / 0.06)",
                border: isSelected
                  ? `1px solid ${tech.brandColor}60`
                  : "1px solid rgb(255 255 255 / 0.10)",
                backdropFilter: "blur(10px)",
              }}
            />

            {/* Icon */}
            <span
              className="relative z-10 flex items-center justify-center transition-all duration-200"
              style={{
                filter: isSelected
                  ? `drop-shadow(0 0 5px ${tech.brandColor}99)`
                  : "none",
              }}
            >
              <tech.Icon
                size={iconSize}
                color={isSelected ? tech.brandColor : `${tech.brandColor}aa`}
              />
            </span>

            {/* Tooltip */}
            <span
              className="pointer-events-none absolute whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{
                bottom: `calc(100% + 8px)`,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(8, 9, 10, 0.96)",
                color: "#e8e9ee",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
                zIndex: 60,
              }}
            >
              {tech.name}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: NUCLEUS
───────────────────────────────────────────────────────────── */

function Nucleus({
  color = "#7a62e8",
  label = "DEV",
}: {
  color?: string;
  label?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ width: "10cqw", height: "10cqw", zIndex: 20 }}
      aria-hidden="true"
    >
      {/* Outer pulse */}
      {!shouldReduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            border: `1px solid ${color}35`,
          }}
        />
      )}

      {/* Core disc */}
      <span
        className="absolute flex items-center justify-center"
        style={{
          inset: "18%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${color}18, rgb(8 9 10 / 0.95))`,
          border: `1px solid ${color}30`,
          backdropFilter: "blur(16px)",
          boxShadow: `0 0 20px ${color}20, inset 0 1px 0 ${color}20`,
          transition: "all 0.5s ease",
        }}
      >
        <span
          className="font-bold uppercase tracking-[0.2em] select-none"
          style={{
            fontSize: "min(9px, 2.2cqw)",
            color: `${color}cc`,
            transition: "color 0.5s ease",
          }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: DETAIL PANEL
───────────────────────────────────────────────────────────── */

function DetailPanel({
  tech,
  onClose,
}: {
  tech: Tech;
  onClose: () => void;
}) {
  const tierMeta = {
    core: { badge: "Core · Dominante", note: "✦ Base sólida — uso diário com confiança." },
    learning: { badge: "Aprendendo · Em evolução", note: "◈ Aprendizado ativo — evoluindo rapidamente." },
    tools: { badge: "Ferramenta · Ambiente", note: "⬡ Parte do ambiente de trabalho — uso regular." },
  } as const;

  const meta = tierMeta[tech.tier];
  const conf = TIER_CONFIG[tech.tier];

  return (
    <motion.aside
      key={tech.id}
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{
        background: "rgb(255 255 255 / 0.035)",
        border: `1px solid ${tech.brandColor}25`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${tech.brandColor}0d, inset 0 1px 0 rgb(255 255 255 / 0.05)`,
      }}
      role="region"
      aria-label={`Detalhes de ${tech.name}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 300 }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `${tech.brandColor}15`,
            border: `1px solid ${tech.brandColor}30`,
            boxShadow: `0 0 20px ${tech.brandColor}20`,
          }}
        >
          <tech.Icon size={24} color={tech.brandColor} />
        </motion.span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className="text-sm font-semibold leading-tight"
                style={{ color: "var(--color-neutral-50, #f5f5f8)" }}
              >
                {tech.name}
              </h3>
              <p
                className="mt-0.5 text-[11px]"
                style={{ color: "var(--color-neutral-400, #6b6c75)" }}
              >
                {CATEGORY_LABELS[tech.category]}
                {tech.since && ` · desde ${tech.since}`}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar painel"
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/5"
              style={{ color: "var(--color-neutral-500, #3a3b42)" }}
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Tier badge */}
      <span
        className="w-fit rounded-md px-2.5 py-1 text-[11px] font-medium"
        style={{
          background: `${conf.color.replace("0.9", "0.12")}`,
          color: tech.brandColor,
          border: `1px solid ${tech.brandColor}30`,
        }}
      >
        {meta.badge}
      </span>

      {/* Description */}
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--color-neutral-300, #9a9ba6)" }}
      >
        {tech.description}
      </p>

      {/* Proficiency bar */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-[11px]"
            style={{ color: "var(--color-neutral-500, #3a3b42)" }}
          >
            Proficiência
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-semibold tabular-nums"
            style={{ color: tech.brandColor }}
          >
            {tech.proficiency}%
          </motion.span>
        </div>

        {/* Track */}
        <div
          className="h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgb(255 255 255 / 0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${tech.brandColor}60, ${tech.brandColor})`,
              boxShadow: `0 0 8px ${tech.brandColor}70`,
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${tech.proficiency}%` }}
            transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          />
        </div>

        {/* Milestones */}
        <div className="mt-1.5 flex justify-between">
          {[25, 50, 75, 100].map((mark) => (
            <span
              key={mark}
              className="text-[10px] tabular-nums"
              style={{
                color:
                  tech.proficiency >= mark
                    ? `${tech.brandColor}99`
                    : "rgb(255 255 255 / 0.12)",
              }}
            >
              {mark}
            </span>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p
        className="rounded-xl px-3 py-2 text-[11px] leading-relaxed"
        style={{
          background: "rgb(255 255 255 / 0.025)",
          border: "1px solid rgb(255 255 255 / 0.06)",
          color: "var(--color-neutral-500, #3a3b42)",
        }}
      >
        {meta.note}
      </p>
    </motion.aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: EMPTY PANEL
───────────────────────────────────────────────────────────── */

function EmptyPanel() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col items-center justify-center rounded-2xl p-8 text-center"
      style={{
        minHeight: 200,
        background: "rgb(255 255 255 / 0.02)",
        border: "1px dashed rgb(255 255 255 / 0.07)",
      }}
      aria-hidden="true"
    >
      <motion.span
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          background: "rgba(79, 53, 214, 0.10)",
          border: "1px solid rgba(79, 53, 214, 0.22)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5" fill="#7a62e8" />
          <circle
            cx="8"
            cy="8"
            r="5.5"
            stroke="#4f35d6"
            strokeWidth="1"
            strokeDasharray="2.5 2"
            fill="none"
          />
        </svg>
      </motion.span>
      <p
        className="text-xs font-medium"
        style={{ color: "var(--color-neutral-400, #6b6c75)" }}
      >
        Clique em uma tecnologia
      </p>
      <p
        className="mt-0.5 text-[11px]"
        style={{ color: "var(--color-neutral-400, #26272d)" }}
      >
        para ver proficiência e detalhes
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: TECH ROW LIST (sidebar)
───────────────────────────────────────────────────────────── */

function TechRowList({
  techs,
  selected,
  onSelect,
}: {
  techs: Tech[];
  selected: Tech | null;
  onSelect: (tech: Tech | null) => void;
}) {
  const [expanded, setExpanded] = useState<Record<Tier, boolean>>({
    core: true,
    learning: true,
    tools: true,
  });

  const toggle = (tier: Tier) =>
    setExpanded((prev) => ({ ...prev, [tier]: !prev[tier] }));

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        background: "rgb(255 255 255 / 0.025)",
        border: "1px solid rgb(255 255 255 / 0.07)",
      }}
    >
      {TIER_ORDER.map((tier) => {
        const items = byTierFn(techs, tier);
        if (!items.length) return null;
        const conf = TIER_CONFIG[tier];
        const isExpanded = expanded[tier];

        return (
          <div key={tier}>
            {/* Tier header */}
            <button
              onClick={() => toggle(tier)}
              className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-white/3"
              aria-expanded={isExpanded}
              aria-controls={`tier-list-${tier}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: conf.color }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-neutral-400, #6b6c75)" }}
                >
                  {conf.label}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--color-neutral-400, #26272d)" }}
                >
                  ({items.length})
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp size={12} style={{ color: "var(--color-neutral-400, #26272d)" }} />
              ) : (
                <ChevronDown size={12} style={{ color: "var(--color-neutral-400, #26272d)" }} />
              )}
            </button>

            {/* Items */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`tier-list-${tier}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  {items.map((tech) => {
                    const isActive = selected?.id === tech.id;
                    return (
                      <button
                        key={tech.id}
                        onClick={() => onSelect(isActive ? null : tech)}
                        aria-pressed={isActive}
                        className="flex w-full items-center gap-2.5 px-3 py-1.5 transition-colors"
                        style={{
                          background: isActive
                            ? `${tech.brandColor}0d`
                            : "transparent",
                          borderLeft: `2px solid ${isActive ? tech.brandColor : "transparent"}`,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          <tech.Icon
                            size={13}
                            color={
                              isActive
                                ? tech.brandColor
                                : `${tech.brandColor}77`
                            }
                          />
                        </span>
                        <span
                          className="flex-1 truncate text-left text-xs font-medium"
                          style={{
                            color: isActive
                              ? "var(--color-neutral-100, #e8e9ee)"
                              : "var(--color-neutral-400, #6b6c75)",
                          }}
                        >
                          {tech.name}
                        </span>

                        {/* Mini proficiency bar */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[11px] tabular-nums"
                            style={{
                              color: isActive
                                ? tech.brandColor
                                : "var(--color-neutral-400, #26272d)",
                            }}
                          >
                            {tech.proficiency}%
                          </span>
                          <div
                            className="h-0.5 w-10 overflow-hidden rounded-full"
                            style={{ background: "rgb(255 255 255 / 0.07)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${tech.proficiency}%`,
                                background: isActive
                                  ? tech.brandColor
                                  : `${tech.brandColor}55`,
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider between tiers */}
            <div
              className="h-px"
              style={{ background: "rgb(255 255 255 / 0.05)" }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: STATS ROW
───────────────────────────────────────────────────────────── */

function StatsRow({ techs }: { techs: Tech[] }) {
  const total = techs.length;
  const avg = Math.round(techs.reduce((a, t) => a + t.proficiency, 0) / total);

  const stats = [
    { value: total, label: "tecnologias", color: "var(--color-neutral-200, #c8c9d1)" },
    { value: byTierFn(techs, "core").length, label: "core", color: TIER_CONFIG.core.color },
    { value: byTierFn(techs, "learning").length, label: "aprendendo", color: TIER_CONFIG.learning.color },
    { value: byTierFn(techs, "tools").length, label: "ferramentas", color: TIER_CONFIG.tools.color },
    { value: `${avg}%`, label: "média", color: "var(--color-neutral-300, #9a9ba6)" },
  ];

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline gap-1">
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: s.color }}
          >
            {s.value}
          </span>
          <span
            className="text-[11px]"
            style={{ color: "var(--color-neutral-400, #26272d)" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: FILTER BAR
───────────────────────────────────────────────────────────── */

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "core", label: "Core" },
  { value: "learning", label: "Aprendendo" },
  { value: "tools", label: "Ferramentas" },
];

function FilterBar({
  active,
  onChange,
}: {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Filtrar tecnologias por nível"
    >
      {FILTER_OPTIONS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            aria-pressed={isActive}
            className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            style={{
              background: isActive
                ? "rgba(79, 53, 214, 0.16)"
                : "rgb(255 255 255 / 0.04)",
              color: isActive
                ? "var(--color-accent-300, #a491f2)"
                : "var(--color-neutral-400, #6b6c75)",
              border: isActive
                ? "1px solid rgba(79, 53, 214, 0.38)"
                : "1px solid rgb(255 255 255 / 0.08)",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENT: LEGEND
───────────────────────────────────────────────────────────── */

function Legend({
  filter,
  onFilter,
  techs,
}: {
  filter: FilterValue;
  onFilter: (v: FilterValue) => void;
  techs: Tech[];
}) {
  const items: { tier: Tier; color: string }[] = [
    { tier: "core", color: TIER_CONFIG.core.color },
    { tier: "learning", color: TIER_CONFIG.learning.color },
    { tier: "tools", color: TIER_CONFIG.tools.color },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map(({ tier, color }) => {
        const conf = TIER_CONFIG[tier];
        const count = byTierFn(techs, tier).length;
        const isActive = filter === "all" || filter === tier;

        return (
          <button
            key={tier}
            onClick={() => onFilter(filter === tier ? "all" : tier)}
            className="flex items-center gap-1.5 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 rounded-sm"
            style={{ opacity: isActive ? 1 : 0.3 }}
            aria-label={`Filtrar por ${conf.label}`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: color }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--color-neutral-400, #6b6c75)" }}
            >
              {conf.label}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--color-neutral-400, #26272d)" }}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT — TechOrbit v2.0
───────────────────────────────────────────────────────────── */

export function TechOrbit() {
  const [selected, setSelected] = useState<Tech | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const orbitRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((tech: Tech | null) => {
    setSelected(tech);
    if (tech) setIsPaused(true);
    else setIsPaused(false);
  }, []);

  const handleFilter = useCallback((v: FilterValue) => {
    setFilter(v);
    setSelected(null);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    const next = !manuallyPaused;
    setManuallyPaused(next);
    setIsPaused(next);
  }, [manuallyPaused]);

  const handleOrbitEnter = useCallback(() => {
    if (!selected && !manuallyPaused) setIsPaused(true);
  }, [selected, manuallyPaused]);

  const handleOrbitLeave = useCallback(() => {
    if (!selected && !manuallyPaused) setIsPaused(false);
  }, [selected, manuallyPaused]);

  const visibleTechs =
    filter === "all" ? TECHS : TECHS.filter((t) => t.tier === filter);

  const selectedTier: Tier | null = selected?.tier ?? null;

  const tierAccentColors: Record<Tier, string> = {
    core: "#7a62e8",
    learning: "#67e8f9",
    tools: "#c4b5fd",
  };

  const nucleusColor = selectedTier ? tierAccentColors[selectedTier] : "#7a62e8";

  const effectivelyPaused = isPaused || manuallyPaused || !!shouldReduceMotion;

  return (
    <section aria-label="Ecossistema de tecnologias" className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <FilterBar active={filter} onChange={handleFilter} />
          <StatsRow techs={visibleTechs} />
        </div>

        {/* Pause / Play control */}
        {!shouldReduceMotion && (
          <button
            onClick={togglePause}
            aria-label={manuallyPaused ? "Retomar animação" : "Pausar animação"}
            className="self-start flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: "rgb(255 255 255 / 0.04)",
              border: "1px solid rgb(255 255 255 / 0.08)",
              color: "var(--color-neutral-400, #6b6c75)",
            }}
          >
            {manuallyPaused ? (
              <Play size={12} strokeWidth={1.5} />
            ) : (
              <Pause size={12} strokeWidth={1.5} />
            )}
            {manuallyPaused ? "Retomar" : "Pausar"}
          </button>
        )}
      </div>

      {/* ── Main grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_288px]">

        {/* ─── Orbit canvas ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div
            ref={orbitRef}
            role="group"
            aria-label="Visualização orbital. Use Tab para navegar entre os ícones."
            className="relative mx-auto w-full"
            style={{
              maxWidth: 500,
              aspectRatio: "1",
              containerType: "inline-size",
            }}
            onMouseEnter={handleOrbitEnter}
            onMouseLeave={handleOrbitLeave}
          >
            {/* Ambient radial glow */}
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "40cqw",
                height: "40cqw",
                background: selectedTier
                  ? `radial-gradient(circle, rgba(${TIER_CONFIG[selectedTier].glowRgb}, 0.09) 0%, transparent 70%)`
                  : "radial-gradient(circle, rgba(79,53,214,0.08) 0%, transparent 70%)",
                transition: "background 0.6s ease",
              }}
              aria-hidden="true"
            />

            {/* Orbit rings */}
            {TIER_ORDER.map((tier) => {
              const conf = TIER_CONFIG[tier];
              const hasTechs = byTierFn(visibleTechs, tier).length > 0;
              if (!hasTechs) return null;

              const isHighlighted = selectedTier === tier || filter === tier;
              const isActive = filter === "all" || filter === tier;

              return (
                <span
                  key={tier}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${conf.orbitRadius * 2}cqw`,
                    height: `${conf.orbitRadius * 2}cqw`,
                    border: `1px solid rgb(255 255 255 / ${isHighlighted ? 0.12 : 0.05})`,
                    opacity: isActive ? 1 : 0.2,
                    transition: "all 0.4s ease",
                  }}
                  aria-hidden="true"
                />
              );
            })}

            {/* Nucleus */}
            <Nucleus color={nucleusColor} />

            {/* Orbit nodes — one group per tier */}
            {TIER_ORDER.map((tier) => {
              const items = byTierFn(visibleTechs, tier);
              return items.map((tech, i) => (
                <OrbitNode
                  key={tech.id}
                  tech={tech}
                  index={i}
                  total={items.length}
                  isSelected={selected?.id === tech.id}
                  isPaused={effectivelyPaused}
                  onSelect={handleSelect}
                />
              ));
            })}
          </div>

          {/* Legend */}
          <Legend filter={filter} onFilter={handleFilter} techs={visibleTechs} />
        </div>

        {/* ─── Side panel ────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <DetailPanel
                key={selected.id}
                tech={selected}
                onClose={() => handleSelect(null)}
              />
            ) : (
              <EmptyPanel key="empty" />
            )}
          </AnimatePresence>

          <TechRowList
            techs={visibleTechs}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </section>
  );
}

export default TechOrbit;