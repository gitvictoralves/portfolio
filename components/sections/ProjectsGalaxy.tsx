'use client'

import { useState, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from 'motion/react'
import {
  ArrowUpRight,
  GitBranch,
  Globe,
  Layers,
  Star,
  GitFork,
  Eye,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

type ProjectStatus = 'live' | 'wip' | 'archived'
type ProjectSize = 'featured' | 'standard' | 'compact'

interface Project {
  id: string
  title: string
  tagline: string
  description: string
  status: ProjectStatus
  size: ProjectSize
  stack: string[]
  tags: string[]
  previewColor: string        // CSS gradient string — substitua por imagens reais
  githubUrl?: string
  liveUrl?: string
  highlights?: string[]
  metrics?: { label: string; value: string }[]
  year: string,
  previewImage?: string
}

/* ─────────────────────────────────────────────────────────────
   DATA — ajuste com seus projetos reais
───────────────────────────────────────────────────────────── */

const PROJECTS: Project[] = [
  {
    id: 'conta-ativo',
    title: 'Conta Ativo',
    tagline: 'Gestão financeira e operacional multi-tenant',
    description:
      'Plataforma SaaS de gestão financeira e operacional multi-tenant, com controle de acesso por papel (Dono, Gerente, Financeiro, Operador, Leitura), cadastro de clientes e empresas, lançamentos financeiros, cobrança via PIX/boleto e nota fiscal de serviço integrados ao Asaas, além de módulo de estoque com ficha técnica e produção.',
    status: 'live',
    size: 'featured',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Elysia (Bun)', 'MongoDB', 'JWT'],
    tags: ['Full-stack', 'SaaS', 'Multi-tenant'],
    previewColor:
      'linear-gradient(135deg, #0a0e1e 0%, #1c2f6e 40%, #3457d5 70%, #6d8cf0 100%)',
    githubUrl: '',
    liveUrl: 'https://www.contaativo.com',
    previewImage: '/assets/imgs/contaativo.png',
    highlights: [
      'Controle de acesso por 5 papéis, refletido em menus e ações da API',
      'Cobrança PIX/boleto com QR Code e baixa automática via webhook Asaas',
      'Emissão de nota fiscal de serviço (NFS-e) vinculada à transação',
      'Módulo de estoque com receitas (BOM), produção e rastreio de lote',
    ],
    metrics: [
      { label: 'Papéis de acesso', value: '5' },
      { label: 'Backend', value: 'Elysia + Bun' },
      { label: 'DB', value: 'MongoDB' },
    ],
    year: '2026',
  },
  {
    id: 'portfolio',
    title: 'Premium Interactive Resume',
    tagline: 'Portfólio como experiência de produto',
    description:
      'Este portfólio — uma experiência cinematic combinando storytelling, UI premium e engenharia front-end moderna. App Router, Server Components, animações GSAP e terminal com IA.',
    status: 'live',
    size: 'compact',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'GSAP', 'Motion', 'Tailwind 4'],
    tags: ['Front-end', 'Produto', 'Animação'],
    previewColor:
      'linear-gradient(135deg, #0f0a2e 0%, #251678 40%, #4f35d6 70%, #7a62e8 100%)',
    githubUrl: 'https://github.com/gitvictoralves/portfolio',
    liveUrl: 'https://victormssalves.com',
    highlights: [
      'Recruiter Mode — layout alternativo sem animações',
      'Tech Orbit — visualização interativa do stack',
      'Terminal com IA via Vercel AI SDK streaming',
      'Ambient Mode via CSS @property sem JS',
    ],
    metrics: [
      { label: 'Lighthouse', value: '98' },
      { label: 'Componentes', value: '20+' },
      { label: 'Animações', value: 'GSAP + Motion' },
    ],
    year: '2026',
  },
  {
    id: 'guia-prev',
    title: 'Guia Prev',
    tagline: 'Informação previdenciária clara e acessível',
    description:
      'Plataforma open source que transforma a complexidade do INSS em uma experiência simples, visual e humana. Busca inteligente, comparador de benefícios, simulador de elegibilidade e linguagem sem burocracia, para quem mais precisa entender seus direitos.',
    status: 'live',
    size: 'featured',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'Radix UI', 'shadcn/ui'],
    tags: ['Produto', 'Acessibilidade', 'Open Source'],
    previewColor:
      'linear-gradient(135deg, #052e16 0%, #065f46 40%, #059669 70%, #1fa968 100%)',
    githubUrl: 'https://github.com/gitvictoralves/GuiaPrev',
    liveUrl: 'https://www.guiaprev.com',
    previewImage: '/assets/imgs/guiaprev.png',
    highlights: [
      'Busca inteligente com resultados em tempo real',
      'Comparador de benefícios lado a lado',
      'Simulador de elegibilidade passo a passo',
      'Linguagem simples, sem termos técnicos',
    ],
    metrics: [
      { label: 'Lighthouse', value: '98+' },
      { label: 'Benefícios', value: '30+' },
      { label: 'Licença', value: 'MIT' },
    ],
    year: '2026',
  },
    {
    id: 'instituto-convergir',
    title: 'Instituto Convergir',
    tagline: 'Transformação social através da educação, cultura e esporte',
    description:
      'Site institucional do Instituto Convergir: uma plataforma moderna, acessível e humanizada que apresenta os projetos, ações e a missão do instituto, conectando pessoas, ideias e oportunidades por meio da educação, cultura, esporte e desenvolvimento humano.',
    status: 'live',
    size: 'featured',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'shadcn/ui', 'Framer Motion'],
    tags: ['Institucional', 'ONG', 'Acessibilidade'],
    previewColor:
  'linear-gradient(135deg, #0a0a0a 0%, #14532d 45%, #1a6b3f 70%, #d4a72c 100%)',
    githubUrl: 'https://github.com/gitvictoralves/instituto-convergir',
    liveUrl: 'https://instituto-convergir.vercel.app/',
    previewImage: '/assets/imgs/institutoconvergir.png',
    highlights: [
      'Oficinas de Artes Cirquenses, Plásticas, Percussão e Leitura',
      'Projetos esportivos: futebol, Jiu-Jitsu, boxe e capoeira',
      'Cursinho Popular Orunmilá, preparação para vestibulares',
      'Página de missão, impacto social e formas de apoiar',
    ],
    metrics: [
      { label: 'Localização', value: 'Salvador, BA' },
      { label: 'Projetos', value: '8+' },
      { label: 'Stack', value: 'Next.js' },
    ],
    year: '2026',
  },
  {
    id: 'sgm',
    title: 'S.G.M',
    tagline: 'Sistema de gestão de manutenção industrial',
    description:
      'Sistema para controle de ordens de manutenção de equipamentos industriais, com cadastro de equipamentos e técnicos responsáveis, abertura e acompanhamento do ciclo de vida de cada ordem de manutenção (aberta, em andamento, concluída) e histórico completo de mudanças de status.',
    status: 'archived',
    size: 'featured',
    stack: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'Spring Security + JWT', 'PostgreSQL', 'Swagger/OpenAPI'],
    tags: ['Full-stack', 'Backend', 'Industrial'],
    previewColor:
      'linear-gradient(135deg, #1a1005 0%, #6b3e0a 40%, #c47a1f 70%, #f0a94a 100%)',
    githubUrl: 'https://github.com/gitvictoralves/SGM',
    previewImage: '/assets/imgs/sgm.png',
    highlights: [
      'CRUD completo de equipamentos e técnicos responsáveis',
      'Ciclo de vida de ordens de manutenção: aberta → em andamento → concluída',
      'Bloqueio de múltiplas ordens abertas simultâneas para o mesmo equipamento',
      'Autenticação JWT e documentação automática via Swagger',
    ],
    metrics: [
      { label: 'Backend', value: 'Java + Spring' },
      { label: 'DB', value: 'PostgreSQL' },
      { label: 'Testes', value: 'JUnit + Mockito' },
    ],
    year: '2025',
  },
  {
    id: 'happymakeup',
    title: 'Happy Makeup',
    tagline: 'Meu primeiro projeto profissional',
    description:
      'Sistema de controle de estoque para a Happy Makeup, uma loja de maquiagem em Salvador, Bahia. Gestão de produtos em tempo real, autenticação segura com JWT e relatórios analíticos para suporte à decisão.',
    status: 'archived',
    size: 'standard',
    stack: ['React', 'Tailwind CSS', 'Express', 'MongoDB', 'JWT', 'Material-UI'],
    tags: ['Full-stack', 'Produto', 'Primeiro Projeto'],
    previewColor:
      'linear-gradient(135deg, #2d0a1e 0%, #7c1f4a 40%, #c2185b 70%, #e91e8c 100%)',
    githubUrl: 'https://github.com/victormssa',
    liveUrl: 'https://devvictoralves.vercel.app/work/happymakeup',
    previewImage: '/assets/imgs/happymakeup.png',
    highlights: [
      'Controle de estoque em tempo real com alertas de baixo estoque',
      'Autenticação segura com JWT e controle de acesso por função',
      'Relatórios de inventário, tendências de venda e performance de produtos',
      'Dashboard intuitivo com métricas-chave para operação diária',
    ],
    metrics: [
      { label: 'Stack', value: 'MERN' },
      { label: 'Função', value: 'Front-end' },
      { label: 'Tipo', value: 'Profissional' },
    ],
    year: '2024',
  },

  {
    id: 'hermes',
    title: 'Hermes',
    tagline: 'Hub de ferramentas para desenvolvedores',
    description:
      'Plataforma web colaborativa desenvolvida por estudantes da Unifacs para catalogar e gerenciar ferramentas essenciais de desenvolvimento de software. Foco em simplicidade, velocidade e experiência limpa.',
    status: 'archived',
    size: 'standard',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    tags: ['Front-end', 'Acadêmico', 'Colaborativo'],
    previewColor:
      'linear-gradient(135deg, #0a1628 0%, #1a3a6e 40%, #2563eb 70%, #60a5fa 100%)',
    githubUrl: 'https://github.com/victormssa',
    liveUrl: 'https://devvictoralves.vercel.app/work/hermes',
    previewImage: '/assets/imgs/hermes.png',
    highlights: [
      'Listagem curada de ferramentas com descrições e links',
      'Sistema de favoritos para organização pessoal de recursos',
      'Design responsivo adaptado para desktop e mobile',
      'Interface minimalista com foco na usabilidade',
    ],
    metrics: [
      { label: 'Equipe', value: '9 pessoas' },
      { label: 'Função', value: 'Developer' },
      { label: 'Tipo', value: 'Acadêmico' },
    ],
    year: '2025',
  },
  {
  id: 'perficont',
  title: 'Perfi Cont',
  tagline: 'Plataforma digital de contabilidade escalável',
  description:
    'Plataforma contábil desenvolvida pela Sonnen Software para otimizar processos de contabilidade entre contadores e clientes. Controle de acesso por perfil, APIs RESTful, autenticação JWT e design responsivo com foco em segurança e escalabilidade.',
  status: 'live',
  size: 'standard',
  stack: ['Next.js', 'React', 'PostgreSQL', 'Neon', 'Tailwind CSS', 'JWT', 'Figma'],
  tags: ['Full-stack', 'SaaS', 'Produto Profissional'],
  previewColor:
    'linear-gradient(135deg, #0f1e0a 0%, #1a4a1f 40%, #2d7a35 70%, #4caf50 100%)',
  githubUrl: '',
  liveUrl: 'https://www.perficont.com.br',
  previewImage: '/assets/imgs/perficont.png',
  highlights: [
    'Controle de acesso dinâmico por perfil: admin, contador e cliente',
    'APIs RESTful integrando front-end com PostgreSQL via Neon',
    'Autenticação e autorização seguras com JWT',
    'Protótipo e design de interface no Figma com Tailwind CSS',
  ],
  metrics: [
    { label: 'Empresa', value: 'Sonnen' },
    { label: 'Função', value: 'Full-stack' },
    { label: 'DB', value: 'PostgreSQL' },
  ],
  year: '2025',
},
]

/* ─────────────────────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; dotColor: string; chipStyle: React.CSSProperties }
> = {
  live: {
    label: 'Live',
    dotColor: 'var(--color-success)',
    chipStyle: {
      background: 'rgb(34 197 94 / 0.10)',
      color: 'var(--color-success)',
      border: '1px solid rgb(34 197 94 / 0.20)',
    },
  },
  wip: {
    label: 'Em desenvolvimento',
    dotColor: 'var(--color-warning)',
    chipStyle: {
      background: 'rgb(245 158 11 / 0.10)',
      color: 'var(--color-warning)',
      border: '1px solid rgb(245 158 11 / 0.20)',
    },
  },
  archived: {
    label: 'Arquivado',
    dotColor: 'var(--color-neutral-400)',
    chipStyle: {
      background: 'rgb(255 255 255 / 0.04)',
      color: 'var(--color-neutral-400)',
      border: '1px solid rgb(255 255 255 / 0.08)',
    },
  },
}

/* ─────────────────────────────────────────────────────────────
   FILTERS
───────────────────────────────────────────────────────────── */

type FilterTag = string | 'all'

function getUniqueTags(projects: Project[]): string[] {
  const all = projects.flatMap((p) => p.tags)
  return Array.from(new Set(all))
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Status chip
───────────────────────────────────────────────────────────── */

function StatusChip({ status }: { status: ProjectStatus }) {
  const cfg = STATUS_CONFIG[status]
  const isLive = status === 'live'

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium whitespace-nowrap"
      style={cfg.chipStyle}
    >
      {isLive ? (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: cfg.dotColor }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: cfg.dotColor }}
          />
        </span>
      ) : (
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ backgroundColor: cfg.dotColor }}
        />
      )}
      {cfg.label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Stack badge
───────────────────────────────────────────────────────────── */

function StackBadge({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-sm text-xs font-medium border whitespace-nowrap"
      style={{
        background: 'rgb(79 53 214 / 0.12)',
        color: 'var(--color-accent-300)',
        border: '1px solid rgb(79 53 214 / 0.22)',
      }}
    >
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Project preview (gradient placeholder)
   height agora aceita classes responsivas (ex: "h-[140px] sm:h-[180px]")
───────────────────────────────────────────────────────────── */

function ProjectPreview({
  project,
  heightClassName = 'h-[180px]',
}: {
  project: Project
  heightClassName?: string
}) {
  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden ${heightClassName}`}
      aria-hidden="true"
    >
      {project.previewImage ? (
        /* Imagem real — object-cover centralizado */
        <img
          src={project.previewImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ display: 'block' }}
        />
      ) : (
        /* Fallback gradiente */
        <div
          className="absolute inset-0"
          style={{ background: project.previewColor }}
        />
      )}

      {/* Grid overlay decorativo — aplicado sobre qualquer conteúdo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgb(255 255 255 / 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Vinheta para integrar com o card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 50%, rgb(0 0 0 / 0.45) 100%)',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Detail modal / expanded view
───────────────────────────────────────────────────────────── */

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const shouldReduce = useReducedMotion()

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.aside
        key="panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do projeto: ${project.title}`}
        initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 glass-3 overflow-y-auto rounded-t-2xl sm:inset-x-4 md:inset-auto md:left-1/2 md:top-1/2 md:w-[calc(100%-2rem)] md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
        style={{
          maxHeight: '90vh',
          boxShadow: 'var(--glow-accent), var(--shadow-lg)',
        }}
      >
        {/* Accent top edge */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(122 98 232 / 0.5), transparent)',
          }}
        />

        {/* Preview */}
        <ProjectPreview project={project} heightClassName="h-[160px] sm:h-[200px]" />

        <div className="flex flex-col gap-5 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <StatusChip status={project.status} />
              <h3
                className="text-gradient text-lg sm:text-xl font-semibold leading-tight mt-2 break-words"
              >
                {project.title}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-accent-400)' }}
              >
                {project.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar painel de detalhes"
              className="p-2 rounded-lg transition-all duration-150 hover:bg-white/8 shrink-0"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-neutral-300)' }}
          >
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && (
            <div className="flex flex-col gap-2">
              <p
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--color-neutral-400)' }}
              >
                Destaques
              </p>
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <ChevronRight
                    size={13}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--color-accent-400)' }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--color-neutral-300)' }}
                  >
                    {h}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Metrics */}
          {project.metrics && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="glass-1 rounded-lg p-2 sm:p-3 text-center min-w-0"
                >
                  <p
                    className="text-sm sm:text-base font-semibold break-words"
                    style={{ color: 'var(--color-neutral-50)' }}
                  >
                    {m.value}
                  </p>
                  <p
                    className="text-[11px] sm:text-xs mt-0.5 break-words"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stack */}
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <StackBadge key={s} label={s} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.10), transparent)',
            }}
          />

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
                style={{
                  background: 'var(--color-accent-500)',
                  color: '#fff',
                  boxShadow: 'var(--glow-accent)',
                }}
                aria-label={`Ver projeto ${project.title} ao vivo`}
              >
                <Globe size={14} strokeWidth={1.5} aria-hidden="true" />
                Ver projeto
                <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md text-sm font-medium border transition-all duration-150"
                style={{
                  background: 'rgb(255 255 255 / 0.05)',
                  borderColor: 'rgb(255 255 255 / 0.10)',
                  color: 'var(--color-neutral-200)',
                }}
                aria-label={`Ver código-fonte de ${project.title} no GitHub`}
              >
                <GitBranch size={14} strokeWidth={1.5} aria-hidden="true" />
                Código-fonte
              </a>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Featured card (large)
───────────────────────────────────────────────────────────── */

function FeaturedCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0, 0, 0.2, 1], delay: index * 0.1 }}
      className="col-span-1 sm:col-span-2 group"
    >
      <button
        onClick={() => onOpen(project)}
        aria-label={`Abrir detalhes do projeto ${project.title}`}
        className="w-full text-left rounded-xl overflow-hidden border transition-all duration-300"
        style={{
          background: 'rgb(255 255 255 / 0.06)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgb(255 255 255 / 0.10)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(79 53 214 / 0.40)'
          el.style.boxShadow = '0 0 48px rgb(79 53 214 / 0.15)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(255 255 255 / 0.10)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Preview image area */}
        <div className="relative overflow-hidden">
          <ProjectPreview project={project} heightClassName="h-[180px] sm:h-[220px] lg:h-[260px]" />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgb(0 0 0 / 0.40)' }}
          >
            <span
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'var(--color-accent-500)',
                color: '#fff',
                boxShadow: 'var(--glow-accent)',
              }}
            >
              <Eye size={14} strokeWidth={1.5} aria-hidden="true" />
              Ver detalhes
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={project.status} />
              <span
                className="px-2 py-0.5 rounded-sm text-xs font-medium border whitespace-nowrap"
                style={{
                  background: 'rgb(79 53 214 / 0.08)',
                  color: 'var(--color-accent-400)',
                  border: '1px solid rgb(79 53 214 / 0.15)',
                }}
              >
                <Zap size={10} strokeWidth={1.5} className="inline mr-1" aria-hidden="true" />
                Featured
              </span>
            </div>
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'var(--color-neutral-400)' }}
            />
          </div>

          <h3
            className="text-gradient text-lg sm:text-xl font-semibold leading-tight mb-1 break-words"
          >
            {project.title}
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--color-accent-400)' }}
          >
            {project.tagline}
          </p>
          <p
            className="text-sm leading-relaxed mb-5 line-clamp-2"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            {project.description}
          </p>

          {/* Stack — primeiros 5 */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s) => (
              <StackBadge key={s} label={s} />
            ))}
            {project.stack.length > 5 && (
              <span
                className="px-2 py-0.5 rounded-sm text-xs font-medium"
                style={{ color: 'var(--color-neutral-400)' }}
              >
                +{project.stack.length - 5}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Standard card
───────────────────────────────────────────────────────────── */

function StandardCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: index * 0.08 }}
      className="group"
    >
      <button
        onClick={() => onOpen(project)}
        aria-label={`Abrir detalhes do projeto ${project.title}`}
        className="w-full text-left rounded-xl overflow-hidden border transition-all duration-250"
        style={{
          background: 'rgb(255 255 255 / 0.05)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgb(255 255 255 / 0.08)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(255 255 255 / 0.16)'
          el.style.background = 'rgb(255 255 255 / 0.08)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(255 255 255 / 0.08)'
          el.style.background = 'rgb(255 255 255 / 0.05)'
        }}
      >
        <ProjectPreview project={project} heightClassName="h-[120px] sm:h-[140px]" />

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <StatusChip status={project.status} />
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
              style={{ color: 'var(--color-neutral-400)' }}
            />
          </div>

          <h3
            className="text-base font-semibold leading-tight mb-1 break-words"
            style={{ color: 'var(--color-neutral-100)' }}
          >
            {project.title}
          </h3>
          <p
            className="text-xs mb-4"
            style={{ color: 'var(--color-accent-400)' }}
          >
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((s) => (
              <StackBadge key={s} label={s} />
            ))}
            {project.stack.length > 3 && (
              <span
                className="px-2 py-0.5 rounded-sm text-xs"
                style={{ color: 'var(--color-neutral-400)' }}
              >
                +{project.stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENT — Compact card (list row)
───────────────────────────────────────────────────────────── */

function CompactCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay: index * 0.06 }}
    >
      <button
        onClick={() => onOpen(project)}
        aria-label={`Abrir detalhes do projeto ${project.title}`}
        className="w-full text-left group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg border transition-all duration-150"
        style={{
          background: 'rgb(255 255 255 / 0.03)',
          borderColor: 'rgb(255 255 255 / 0.06)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(255 255 255 / 0.12)'
          el.style.background = 'rgb(255 255 255 / 0.06)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgb(255 255 255 / 0.06)'
          el.style.background = 'rgb(255 255 255 / 0.03)'
        }}
      >
        {/* Preview swatch */}
        <div
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md"
          style={{ background: project.previewColor }}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium leading-tight truncate"
            style={{ color: 'var(--color-neutral-100)' }}
          >
            {project.title}
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            {project.tagline}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
          <StatusChip status={project.status} />
          <span
            className="hidden sm:inline text-xs"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            {project.year}
          </span>
          <ArrowUpRight
            size={13}
            strokeWidth={1.5}
            aria-hidden="true"
            className="hidden sm:block opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
            style={{ color: 'var(--color-neutral-400)' }}
          />
        </div>
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT — ProjectsGalaxy
───────────────────────────────────────────────────────────── */

export function ProjectsGalaxy() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<FilterTag>('all')

  const allTags = getUniqueTags(PROJECTS)

  const filteredProjects =
    filter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.includes(filter))

  const featured = filteredProjects.filter((p) => p.size === 'featured')
  const standard = filteredProjects.filter((p) => p.size === 'standard')
  const compact  = filteredProjects.filter((p) => p.size === 'compact')

  const handleOpen = useCallback((project: Project) => {
    setActiveProject(project)
  }, [])

  const handleClose = useCallback(() => {
    setActiveProject(null)
  }, [])

  return (
    <>
      {/* Filter bar */}
      <div
        className="flex flex-wrap gap-2 mb-8 sm:mb-10"
        role="group"
        aria-label="Filtrar projetos por categoria"
      >
        {['all', ...allTags].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            aria-pressed={filter === tag}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap"
            style={{
              background:
                filter === tag
                  ? 'rgb(79 53 214 / 0.20)'
                  : 'rgb(255 255 255 / 0.04)',
              color:
                filter === tag
                  ? 'var(--color-accent-300)'
                  : 'var(--color-neutral-400)',
              border:
                filter === tag
                  ? '1px solid rgb(79 53 214 / 0.40)'
                  : '1px solid rgb(255 255 255 / 0.08)',
            }}
          >
            {tag === 'all' ? 'Todos' : tag}
          </button>
        ))}
      </div>

      {/* Grid — featured (span completo em sm+) + standard, 3 colunas em telas grandes */}
      {(featured.length > 0 || standard.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-5">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} project={p} index={i} onOpen={handleOpen} />
          ))}
          {standard.map((p, i) => (
            <StandardCard key={p.id} project={p} index={i} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {/* Compact list */}
      {compact.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            Outros projetos
          </p>
          {compact.map((p, i) => (
            <CompactCard key={p.id} project={p} index={i} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-1 rounded-xl p-8 sm:p-12 text-center"
        >
          <Layers
            size={32}
            strokeWidth={1.5}
            className="mx-auto mb-3"
            style={{ color: 'var(--color-neutral-400)' }}
            aria-hidden="true"
          />
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            Nenhum projeto nessa categoria ainda.
          </p>
        </motion.div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetail project={activeProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  )
}