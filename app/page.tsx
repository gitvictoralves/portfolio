import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdentityCard } from "@/components/sections/IdentityCard";
import { Navbar } from "@/components/shared/Navbar";
import { TechOrbit } from "@/components/sections/TechOrbit";
import { Timeline } from "@/components/sections/Timeline";
import { ProjectsGalaxy } from "@/components/sections/ProjectsGalaxy";
//import { Terminal } from "@/components/sections/Terminal";
import { Footer } from "@/components/shared/Footer";
//import { RecruiterModeProvider } from "@/modes/RecruiterModeProvider";
//import { RecruiterModeToggle } from "@/modes/RecruiterModeToggle";
import { IdentityComplement } from "@/components/sections/IndetityComplement";
import { DashboardServer } from "@/components/sections/DashboardServer";
// Dentro do JSX de Home():

export default function Home() {
  return (
    <>
      {/* Background ambiente global — hue transita via CSS @property */}
      <div
        className="ambient-bg fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid overlay decorativo */}
      <div
        className="grid-overlay fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          id="hero"
          data-section="hero"
          aria-label="Apresentação"
          className="relative min-h-screen"
        >
          <HeroSection />
        </section>

        {/* ── Identity Card ────────────────────────────────── */}
        <section
          id="identity"
          data-section="identity"
          aria-label="Perfil e disponibilidade"
          className="relative py-24"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:items-start">
              <Suspense fallback={<IdentityCardSkeleton />}>
                <IdentityCard />
              </Suspense>

              <IdentityComplement />
            </div>
          </div>
        </section>

        {/* ── Tech Orbit ───────────────────────────────────── */}
        <section
          id="orbit"
          data-section="orbit"
          aria-label="Ecossistema de tecnologias"
          className="relative py-24"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <SectionHeader
              eyebrow="Stack"
              title="Ecossistema técnico"
              description="Tecnologias com as quais trabalho, aprendo e experimento — organizadas por proficiência e contexto de uso."
            />
            <TechOrbit />
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────── */}
        <section
          id="timeline"
          data-section="timeline"
          aria-label="Trajetória profissional e educacional"
          className="relative py-24 overflow-hidden"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <SectionHeader
              eyebrow="Trajetória"
              title="Experiência & Formação"
              description="Uma jornada de atendimento ao público para engenharia de interfaces — cada etapa moldou como penso sobre pessoas e sistemas."
            />
          </div>
          <Timeline />
        </section>

        {/* ── Projects Galaxy ──────────────────────────────── */}
        <section
          id="projects"
          data-section="projects"
          aria-label="Projetos"
          className="relative py-24"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <SectionHeader
              eyebrow="Projetos"
              title="O que estou construindo"
              description="Interfaces reais com deploy funcionando. Cada projeto é uma exploração de produto, performance e experiência."
            />
            <ProjectsGalaxy />
          </div>
        </section>

        {/* ── Executive Dashboard ──────────────────────────── */}
        <section
          id="dashboard"
          data-section="dashboard"
          aria-label="Métricas e atividade"
          className="relative py-24"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <SectionHeader
              eyebrow="Dashboard"
              title="Métricas em tempo real"
              description="Dados ao vivo do GitHub, projetos entregues e progressão técnica — atualizados via ISR."
            />
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardServer /> {/* ← era <Dashboard />, sem dados */}
            </Suspense>
          </div>
        </section>

        {/* ── AI Terminal ──────────────────────────────────── 
        <section
          id="terminal"
          data-section="terminal"
          aria-label="Terminal interativo com IA"
          className="relative py-24"
        >
          <div className="container mx-auto max-w-screen-xl px-6">
            <SectionHeader
              eyebrow="Terminal"
              title="Pergunte qualquer coisa"
              description="Um terminal alimentado por IA com contexto completo sobre minha trajetória, stack e projetos. Responde em primeira pessoa."
            />
            <Terminal />
          </div>
        </section>*/}
      </main>

      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shared section header component (inline — sem arquivo próprio
   pois é usado exclusivamente em page.tsx)
───────────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <header className="mb-16 max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent-400)] mb-3">
        {eyebrow}
      </p>
      <h2 className="text-gradient text-4xl font-semibold leading-tight mb-4 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--color-neutral-300)] text-lg leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   Skeletons para Suspense boundaries
───────────────────────────────────────────────────────────── */

function IdentityCardSkeleton() {
  return (
    <div
      className="glass-2 rounded-2xl p-8 animate-pulse h-80 w-full max-w-md"
      aria-label="Carregando perfil..."
    />
  );
}

function DashboardSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      aria-label="Carregando métricas..."
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-2 rounded-xl p-6 h-32 animate-pulse" />
      ))}
    </div>
  );
}
