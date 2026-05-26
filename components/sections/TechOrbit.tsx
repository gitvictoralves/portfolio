"use client";

/**
 * TechOrbit v3.0
 *
 * Sistema solar interativo premium com habilidades reais de Victor Alves.
 * Redesign completo — orbital physics, glassmorphism, micro-interactions.
 * Ícones via @icons-pack/react-simple-icons + SVGs customizados (CC0 / próprios).
 */

import { useState, useCallback, useRef } from "react";
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
import {
  KanbanSquare,
  RefreshCw,
  Webhook,
  TestTube2,
  WebhookIcon,
} from "lucide-react";
import { VscVscode } from "react-icons/vsc";

/* ─────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
───────────────────────────────────────────────────────────── */
type Tier = 'core' | 'learning' | 'tools';

type FilterValue = 'all' | Tier;

interface TechIconProps {
  size: number;
  color: string;
}

interface TierItem {
  tier: Tier;
  color: string;
}

interface LegendProps {
  filter: FilterValue;
  byTier: (tier: Tier) => Tech[];
  onFilter: (filter: FilterValue) => void;
}

interface Tech {
  id: string;
  name: string;
  brandColor: string;
  tier: "core" | "learning" | "tools";
  category: keyof typeof CATEGORY_LABELS;
  description: string;
  since: string;
  proficiency: number;
  Icon: React.FC<TechIconProps>;
}

const CATEGORY_LABELS: Record<string, string> = {
  markup: "Markup",
  scripting: "Scripting",
  framework: "Framework",
  tooling: "Ferramentas",
  design: "Design",
  methodology: "Metodologia",
};

interface OrbitNodeProps {
  tech: Tech;
  index: number;
  total: number;
  isSelected: boolean;
  isPaused: boolean;
  onSelect: (tech: Tech | null) => void;
}

interface DetailPanelProps {
  tech: Tech;
  onClose: () => void;
}

interface TechListProps {
  techs: Tech[];
  selected: Tech | null;
  onSelect: (tech: Tech | null) => void;
}
interface TierConfig {
  label: string;
  sublabel: string;
  orbitRadius: number;
  speed: number;
  nodeSize: number;
  glowRgb: string;
  ringColor: string;
}
const TECHS: Tech[] = [
  // ── CORE ────────────────────────────────────────────────
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

  // ── LEARNING ────────────────────────────────────────────
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

  // ── TOOLS ───────────────────────────────────────────────
  {
    id: "vscode",
    name: "VS Code",
    brandColor: "#007ACC",
    tier: "tools",
    category: "tooling",
    description:
      "Editor principal — extensões, atalhos, integração Git e terminal integrado. Ambiente de desenvolvimento diário.",
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
      "Pair programming assistido por IA — autocompletar, geração de funções e aceleração do fluxo de desenvolvimento.",
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
      "Assistência para revisão de código, debugging, documentação e aprendizado de novos conceitos e padrões.",
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
      "Leitura e interpretação de layouts, design tokens, handoff para desenvolvimento e inspeção de componentes.",
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
      "Sprints, planning, daily standups, retrospectivas e backlog grooming — metodologia ágil aplicada na prática.",
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
      "Visualização do fluxo de trabalho com boards, WIP limits e otimização contínua de entregas.",
    since: "2023",
    proficiency: 55,
    Icon: ({ size, color }) => <KanbanSquare size={size} color={color} />,
  },
];

const TIER_CONFIG: Record<Tier, TierConfig> = {
  core: {
    label: "Core",
    sublabel: "Dominante",
    orbitRadius: 24,
    speed: 48,
    nodeSize: 52,
    glowRgb: "79, 53, 214",
    ringColor: "rgba(79, 53, 214, 0.18)",
  },
  learning: {
    label: "Aprendendo",
    sublabel: "Em evolução",
    orbitRadius: 38,
    speed: 72,
    nodeSize: 44,
    glowRgb: "6, 182, 212",
    ringColor: "rgba(6, 182, 212, 0.12)",
  },
  tools: {
    label: "Ferramentas",
    sublabel: "Ambiente",
    orbitRadius: 52,
    speed: 100,
    nodeSize: 38,
    glowRgb: "139, 92, 246",
    ringColor: "rgba(139, 92, 246, 0.10)",
  },
};

/* ─────────────────────────────────────────────────────────────
   ORBIT NODE
───────────────────────────────────────────────────────────── */

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
  const duration = shouldReduceMotion ? 9999 : conf.speed;
  const iconSize = Math.max(14, Math.round(conf.nodeSize * 0.42));

  return (
    <motion.div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
      }}
      animate={
        isPaused
          ? { rotate: angleOffset }
          : { rotate: [angleOffset, angleOffset + 360] }
      }
      transition={{
        duration,
        repeat: isPaused ? 0 : Infinity,
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
            isPaused
              ? { rotate: -angleOffset }
              : { rotate: [-angleOffset, -(angleOffset + 360)] }
          }
          transition={{
            duration,
            repeat: isPaused ? 0 : Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          <button
            aria-label={`Ver detalhes de ${tech.name}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? null : tech)}
            className="group relative flex items-center justify-center focus-visible:outline-none"
            style={{ width: conf.nodeSize, height: conf.nodeSize }}
          >
            {/* selection ring glow */}
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 0 2px ${tech.brandColor}bb, 0 0 28px ${tech.brandColor}55`,
                  }}
                />
              )}
            </AnimatePresence>

            {/* hover pulse ring */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                boxShadow: `0 0 0 1px ${tech.brandColor}66, 0 0 16px ${tech.brandColor}33`,
              }}
            />

            {/* glass pill */}
            <span
              className="absolute inset-0 rounded-full transition-all duration-200"
              style={{
                background: isSelected
                  ? `${tech.brandColor}20`
                  : "rgb(255 255 255 / 0.055)",
                border: isSelected
                  ? `1px solid ${tech.brandColor}70`
                  : "1px solid rgb(255 255 255 / 0.10)",
                transform: "scale(1)",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* hover scale */}
            <motion.span
              className="absolute inset-0 rounded-full"
              whileHover={{ scale: 1.15 }}
              style={{ background: "transparent" }}
            />

            {/* icon */}
            <span
              className="relative z-10 flex items-center justify-center transition-all duration-200"
              style={{
                color: isSelected ? tech.brandColor : `${tech.brandColor}bb`,
                filter: isSelected
                  ? `drop-shadow(0 0 5px ${tech.brandColor}99)`
                  : "none",
              }}
            >
              <tech.Icon
                size={iconSize}
                color={isSelected ? tech.brandColor : `${tech.brandColor}bb`}
              />
            </span>

            {/* tooltip */}
            <span
              className="pointer-events-none absolute whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{
                bottom: `calc(100% + 6px)`,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(14, 15, 18, 0.95)",
                color: "#e8e9ee",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 60,
              }}
            >
              {tech.name}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NUCLEUS
───────────────────────────────────────────────────────────── */

function Nucleus({ accentColor }: { accentColor?: string }) {
  const color = accentColor || "var(--color-accent-400, #7a62e8)";
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ width: "11cqw", height: "11cqw", zIndex: 20 }}
      aria-hidden="true"
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          border: `1px solid ${color}40`,
        }}
      />
      <span
        className="absolute"
        style={{
          inset: "18%",
          borderRadius: "50%",
          background: "rgb(255 255 255 / 0.04)",
          border: "1px solid rgb(255 255 255 / 0.12)",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="font-bold uppercase tracking-[0.18em] transition-colors duration-500"
          style={{ fontSize: "min(8px, 2cqw)", color }}
        >
          DEV
        </span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────────────────────── */

function DetailPanel({ tech, onClose }: DetailPanelProps) {
  const conf = TIER_CONFIG[tech.tier];
  const tierMeta = {
    core: {
      badge: "Core · Dominante",
      note: "✦ Base sólida — uso diário com confiança.",
    },
    learning: {
      badge: "Aprendendo · Em evolução",
      note: "◈ Aprendizado ativo — evoluindo rapidamente.",
    },
    tools: {
      badge: "Ferramenta · Ambiente",
      note: "⬡ Parte do ambiente de trabalho — uso regular.",
    },
  };
  const meta = tierMeta[tech.tier];

  return (
    <motion.aside
      key={tech.id}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{
        background: "rgb(255 255 255 / 0.04)",
        border: `1px solid ${tech.brandColor}28`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${tech.brandColor}12, inset 0 1px 0 rgb(255 255 255 / 0.06)`,
      }}
      aria-label={`Detalhes de ${tech.name}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `${tech.brandColor}18`,
            border: `1px solid ${tech.brandColor}35`,
            boxShadow: `0 0 20px ${tech.brandColor}28`,
          }}
        >
          <tech.Icon size={24} color={tech.brandColor} />
        </span>

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
                className="mt-0.5 text-xs"
                style={{ color: "var(--color-neutral-400, #6b6c75)" }}
              >
                {CATEGORY_LABELS[tech.category]}
                {tech.since && ` · desde ${tech.since}`}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar painel"
              className="mt-0.5 flex-shrink-0 rounded-md p-1 transition-colors"
              style={{ color: "var(--color-neutral-500, #3a3b42)" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2L2 10M2 2l8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tier badge */}
      <span
        className="w-fit rounded-md px-2.5 py-1 text-xs font-medium"
        style={{
          background: `${tech.brandColor}18`,
          color: tech.brandColor,
          border: `1px solid ${tech.brandColor}35`,
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

      {/* Proficiency */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p
            className="text-xs"
            style={{ color: "var(--color-neutral-500, #3a3b42)" }}
          >
            Proficiência
          </p>
          <span
            className="text-xs font-semibold"
            style={{ color: tech.brandColor }}
          >
            {tech.proficiency}%
          </span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgb(255 255 255 / 0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${tech.brandColor}70, ${tech.brandColor})`,
              boxShadow: `0 0 8px ${tech.brandColor}80`,
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${tech.proficiency}%` }}
            transition={{ duration: 0.75, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          />
        </div>
      </div>

      {/* Note */}
      <p
        className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
        style={{
          background: "rgb(255 255 255 / 0.03)",
          border: "1px solid rgb(255 255 255 / 0.06)",
          color: "var(--color-neutral-400, #6b6c75)",
        }}
      >
        {meta.note}
      </p>
    </motion.aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   EMPTY PANEL
───────────────────────────────────────────────────────────── */

function EmptyPanel() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-1 flex-col items-center justify-center rounded-2xl p-8 text-center"
      style={{
        minHeight: 180,
        background: "rgb(255 255 255 / 0.02)",
        border: "1px dashed rgb(255 255 255 / 0.08)",
      }}
      aria-hidden="true"
    >
      <motion.span
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          background: "rgba(79,53,214,0.12)",
          border: "1px solid rgba(79,53,214,0.28)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="8"
            cy="8"
            r="2.5"
            fill="var(--color-accent-400, #7a62e8)"
          />
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="var(--color-accent-500, #4f35d6)"
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
        className="mt-0.5 text-xs"
        style={{ color: "var(--color-neutral-600, #26272d)" }}
      >
        para ver proficiência e detalhes
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPACT TECH LIST (scrollable sidebar)
───────────────────────────────────────────────────────────── */

function TechList({ techs, selected, onSelect }: TechListProps) {
  // ✅ Tipar explicitamente o objeto byTier
  const byTier: Record<Tier, Tech[]> = {
    core: [],
    learning: [],
    tools: [],
  };

  techs.forEach((t) => byTier[t.tier].push(t));

  return (
    <div className="rounded-xl overflow-hidden" /* ...styles */>
      {
        // ✅ Asserir o tipo correto para Object.entries
        (Object.entries(byTier) as [Tier, Tech[]][]).map(([tier, items]) => {
          if (!items.length) return null;

          // ✅ Agora 'tier' é do tipo Tier, então TIER_CONFIG[tier] funciona
          const conf = TIER_CONFIG[tier];

          return (
            <div key={tier}>
              <div className="px-3 py-1.5 ..." /* ... */>{conf.label}</div>

              {items.map((tech) => {
                // ✅ 'tech' agora é tipado como Tech, então .id e .brandColor funcionam
                const isActive = selected?.id === tech.id;

                return (
                  <button
                    key={tech.id}
                    onClick={() => onSelect(isActive ? null : tech)} // ✅ onSelect recebe Tech | null
                    aria-pressed={isActive}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 ..."
                    style={{
                      background: isActive
                        ? `${tech.brandColor}10`
                        : "transparent",
                      borderLeft: isActive
                        ? `2px solid ${tech.brandColor}`
                        : "2px solid transparent",
                    }}
                  >
                    <span
                      style={{
                        color: isActive
                          ? tech.brandColor
                          : `${tech.brandColor}88`,
                        flexShrink: 0,
                      }}
                    >
                      <tech.Icon
                        size={13}
                        color={
                          isActive ? tech.brandColor : `${tech.brandColor}88`
                        }
                      />
                    </span>
                    <span
                      className="flex-1 text-xs font-medium truncate" /* ... */
                    >
                      {tech.name}
                    </span>
                    <span className="text-xs tabular-nums" /* ... */>
                      {tech.proficiency}%
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────────────────────── */

function StatsBar({ techs }: { techs: Tech[] }) {
  const total = techs.length;
  const avg = Math.round(techs.reduce((a, t) => a + t.proficiency, 0) / total);
  const byTier = {
    core: techs.filter((t) => t.tier === "core").length,
    learning: techs.filter((t) => t.tier === "learning").length,
    tools: techs.filter((t) => t.tier === "tools").length,
  };

  const stats = [
    {
      label: "total",
      value: total,
      color: "var(--color-neutral-200, #c8c9d1)",
    },
    { label: "core", value: byTier.core, color: "rgba(79,53,214,0.9)" },
    { label: "aprendendo", value: byTier.learning, color: "#06B6D4" },
    { label: "ferramentas", value: byTier.tools, color: "#8B5CF6" },
    {
      label: "média",
      value: `${avg}%`,
      color: "var(--color-neutral-300, #9a9ba6)",
    },
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
            className="text-xs"
            style={{ color: "var(--color-neutral-600, #26272d)" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FILTER TABS
───────────────────────────────────────────────────────────── */

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "core", label: "Core" },
  { value: "learning", label: "Aprendendo" },
  { value: "tools", label: "Ferramentas" },
];

/* ─────────────────────────────────────────────────────────────
   LEGEND
───────────────────────────────────────────────────────────── */

function Legend({ filter, byTier, onFilter }: LegendProps) {
  // ✅ Tipar o array para que 'tier' seja inferido como Tier
  const tiers: TierItem[] = [
    { tier: 'core', color: 'rgba(79,53,214,0.9)' },
    { tier: 'learning', color: '#06B6D4' },
    { tier: 'tools', color: '#8B5CF6' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {tiers.map(({ tier, color }) => {
        // ✅ 'tier' agora é do tipo Tier → TIER_CONFIG[tier] funciona!
        const conf = TIER_CONFIG[tier]
        const count = byTier(tier).length
        const isActive = filter === 'all' || filter === tier

        return (
          <button
            key={tier}
            onClick={() => onFilter(filter === tier ? 'all' : tier)}
            className="flex items-center gap-1.5 transition-opacity duration-200"
            style={{ opacity: isActive ? 1 : 0.3 }}
            aria-label={`Filtrar por ${conf.label}`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="text-xs" style={{ color: 'var(--color-neutral-400, #6b6c75)' }}>
              {conf.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-neutral-600, #26272d)' }}>
              ({count})
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT — TechOrbit v3.0
───────────────────────────────────────────────────────────── */

export function TechOrbit() {
  // ✅ Estados tipados corretamente
  const [selected, setSelected] = useState<Tech | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState<FilterValue>('all') // ✅ FilterValue, não string
  
  const shouldReduceMotion = useReducedMotion()
  const orbitRef = useRef<HTMLDivElement>(null) // ✅ Tipar ref

  // ✅ handleSelect aceita Tech | null
  const handleSelect = useCallback((tech: Tech | null) => {
    setSelected(tech)
    setIsPaused(!!tech)
  }, [])

  // ✅ handleFilter aceita FilterValue
  const handleFilter = useCallback((f: FilterValue) => {
    setFilter(f)
    setSelected(null)
    setIsPaused(false)
  }, [])

  // ✅ filter comparado com valores corretos
  const visibleTechs = filter === 'all' 
    ? TECHS 
    : TECHS.filter((t) => t.tier === filter)
  
  // ✅ byTier com parâmetro tipado como Tier
  const byTier = useCallback((tier: Tier) => 
    visibleTechs.filter((t) => t.tier === tier)
  , [visibleTechs])
  
  // ✅ selectedTier tipado como Tier | null
  const selectedTier: Tier | null = selected?.tier ?? null

  // ✅ tierAccentColors tipado
  const tierAccentColors: Record<Tier, string> = {
    core: '#7a62e8',
    learning: '#67e8f9',
    tools: '#c4b5fd',
  }
  
  const nucleusColor = selectedTier 
    ? tierAccentColors[selectedTier] 
    : '#7a62e8'

  // pause on orbit hover (when nothing selected)
  const handleOrbitEnter = useCallback(() => {
    if (!selected) setIsPaused(true)
  }, [selected])
  
  const handleOrbitLeave = useCallback(() => {
    if (!selected) setIsPaused(false)
  }, [selected])

  return (
    <section
      aria-label="Ecossistema de tecnologias"
      className="flex flex-col gap-6"
    >
      {/* ── Header row ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filtrar tecnologias por nível"
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.value
            return (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value as FilterValue)} // ✅ asserção segura
                aria-pressed={isActive}
                className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  background: isActive
                    ? 'rgba(79, 53, 214, 0.18)'
                    : 'rgb(255 255 255 / 0.04)',
                  color: isActive
                    ? 'var(--color-accent-300, #a491f2)'
                    : 'var(--color-neutral-400, #6b6c75)',
                  border: isActive
                    ? '1px solid rgba(79, 53, 214, 0.40)'
                    : '1px solid rgb(255 255 255 / 0.08)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        {/* Stats */}
        <StatsBar techs={visibleTechs} />
      </div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_288px]">
        {/* ─── Orbit canvas ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div
            ref={orbitRef}
            role="group"
            aria-label="Visualização orbital das tecnologias. Use Tab para navegar entre os ícones."
            className="relative mx-auto w-full"
            style={{
              maxWidth: 500,
              aspectRatio: '1',
              containerType: 'inline-size',
            }}
            onMouseEnter={handleOrbitEnter}
            onMouseLeave={handleOrbitLeave}
          >
            {/* Background ambient glow */}
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
              style={{
                width: '35cqw',
                height: '35cqw',
                background: selectedTier
                  ? `radial-gradient(circle, rgba(${TIER_CONFIG[selectedTier].glowRgb}, 0.08) 0%, transparent 70%)`
                  : 'radial-gradient(circle, rgba(79,53,214,0.07) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Orbit rings */}
            {(Object.keys(TIER_CONFIG) as Tier[]).map((tier) => {
              const conf = TIER_CONFIG[tier] // ✅ tier é Tier, não string
              const hasTechs = byTier(tier).length > 0
              const isHighlighted =
                selectedTier === tier || (!selectedTier && filter === tier)
              const isActive = filter === 'all' || filter === tier

              if (!hasTechs) return null
              return (
                <span
                  key={tier}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500"
                  style={{
                    width: `${conf.orbitRadius * 2}cqw`,
                    height: `${conf.orbitRadius * 2}cqw`,
                    border: `1px solid rgb(255 255 255 / ${isHighlighted ? 0.14 : 0.05})`,
                    opacity: isActive ? 1 : 0.25,
                  }}
                  aria-hidden="true"
                />
              )
            })}

            {/* Nucleus */}
            <Nucleus accentColor={nucleusColor} />

            {/* Orbit nodes */}
            {(Object.keys(TIER_CONFIG) as Tier[]).map((tier) =>
              byTier(tier).map((tech, i) => (
                <OrbitNode
                  key={tech.id}
                  tech={tech}
                  index={i}
                  total={byTier(tier).length}
                  isSelected={selected?.id === tech.id}
                  isPaused={isPaused || !!shouldReduceMotion}
                  onSelect={handleSelect} // ✅ handleSelect: (Tech | null) => void
                />
              ))
            )}
          </div>

          {/* Legend */}
          <Legend 
            filter={filter} 
            byTier={byTier} 
            onFilter={handleFilter} 
          />
        </div>

        {/* ─── Side panel ─────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <DetailPanel
                key={selected.id}
                tech={selected}
                onClose={() => handleSelect(null)} // ✅ null é válido agora
              />
            ) : (
              <EmptyPanel key="empty" />
            )}
          </AnimatePresence>
          <TechList
            techs={visibleTechs}
            selected={selected}
            onSelect={handleSelect} // ✅ Compatível com (Tech | null) => void
          />
        </div>
      </div>
    </section>
  )
}

export default TechOrbit;
