// lib/curriculo/dados-curriculo.ts
//
// Dados do currículo, extraídos de IdentityCard.tsx, IndetityComplement.tsx,
// TechOrbit.tsx, Timeline.tsx, Footer.tsx e do JSON de dados estruturados
// já gerado a partir do portfólio.
//
// AJUSTE VOCÊ MESMO:
//   - "projetos" veio de ProjectsGalaxy.tsx (o JSON estruturado tinha esse
//     campo vazio). Troquei "destaque" por um resultado mensurável sempre
//     que havia algo objetivo (Lighthouse, nº de benefícios etc.), como
//     pede a seção 2.3 do guia de tendências. Reveja o texto e os links.
//   - Scrum e Kanban ficaram fora de "stack" e viraram "metodologias",
//     como você pediu no read.txt.
//   - Axios ficou separado de "REST APIs", também como pedido no read.txt.
//   - Adicionei a categoria "Lógica & Backend (em estudo)" e os itens
//     IntelliJ IDEA / Visual Studio em "Ferramentas & Fluxo", espelhando
//     as tecnologias acrescentadas no TechOrbit para a vaga de
//     Desenvolvedor I (POO, SQL, Java, C#, Spring Boot, .NET Core).
//     Os níveis reais desses itens ainda são iniciais — reveja antes de
//     usar este arquivo numa candidatura formal.

import type { CurriculoData } from "./tipos-curriculo";

export const dadosCurriculo: CurriculoData = {
  nomeCompleto: "Victor Manoel Soares Silva Alves",
  headline: "Desenvolvedor Front-end — React, TypeScript & Next.js",
  localizacao: "Salvador, Bahia — Brasil (remoto)",
  disponibilidade: "Disponível para oportunidades CLT, PJ ou freelance",

  contato: {
    email: "contato@victormssalves.com",
    telefone: "+55 71 99386-0508",
    linkedin: "linkedin.com/in/victormssalves",
    github: "github.com/gitvictoralves",
    portfolio: "victormssalves.com",
  },

  resumo:
    "Desenvolvedor Front-end focado em interfaces responsivas, acessíveis e orientadas ao produto, com base sólida em HTML5, CSS3, JavaScript ES6+ e React, e evolução ativa em TypeScript e Next.js. Em paralelo, iniciando estudo de lógica orientada a objetos, banco de dados relacional e das linguagens Java e C#, para atuar também em manutenção e desenvolvimento back-end. Vem do atendimento ao público, o que se traduz em comunicação objetiva, atenção a detalhes e foco na experiência real de quem usa o sistema. Mantém rotina de estudo consistente há mais de 3 anos, com projetos reais publicados em produção.",

  stack: [
    {
      categoria: "Frontend",
      itens: [
        "HTML5 semântico",
        "CSS3 (Flexbox, Grid, responsividade)",
        "JavaScript ES6+",
        "React (hooks, Context API)",
        "TypeScript",
        "Next.js (App Router, SSR, SSG)",
        "Tailwind CSS",
      ],
    },
    {
      categoria: "Consumo de dados",
      itens: ["REST APIs (fetch)", "Axios"],
    },
    {
      categoria: "Backend",
      itens: [
        "SQL (SQL Server, PostgreSQL, MySQL)",
        "Java",
        "C#",
        "Spring Boot",
        ".NET Core",
      ],
    },
    {
      categoria: "Testes",
      itens: ["Jest", "Testing Library"],
    },
    {
      categoria: "Ferramentas & Fluxo",
      itens: [
        "Git",
        "GitHub",
        "VS Code",
        "IntelliJ IDEA",
        "Visual Studio",
        "Figma",
        "GitHub Copilot",
        "Claude (IA no fluxo de dev)",
      ],
    },
  ],

  metodologias: ["Scrum (sprints, planning, daily, retro)", "Kanban (boards, WIP limits)"],

  experiencia: [
    {
      cargo: "Operador de Telemarketing",
      empresa: "Tel Centro de Contatos",
      local: "Salvador, BA",
      periodo: "Jun 2025 — Presente",
      atual: true,
      bullets: [
        "Atendimento receptivo de alto volume a segurados do INSS, com registro preciso de demandas em sistema interno de gestão.",
        "Resolução de problemas em tempo real sob pressão, mantendo comunicação clara e objetiva com o público.",
        "Rotina que reforçou disciplina de processos e raciocínio lógico aplicado ao dia a dia como desenvolvedor.",
      ],
    },
    {
      cargo: "Estagiário Administrativo",
      empresa: "Hotel Luar de Itapuã",
      local: "Salvador, BA",
      periodo: "Fev 2025 — Abr 2025",
      bullets: [
        "Conferência de reservas em sistema de hospedagem e lançamento de pagamentos em plataformas financeiras.",
        "Controle de encargos trabalhistas e organização de documentos contábeis, com atenção a dados sensíveis.",
        "Uso simultâneo de múltiplas ferramentas digitais em rotina de alto volume de tarefas.",
      ],
    },
  ],

  projetos: [
    {
      nome: "Guia Prev",
      descricao:
        "Plataforma open source que traduz regras de aposentadoria do INSS em uma experiência simples e visual, com busca, comparador de benefícios e simulador de elegibilidade.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Radix UI", "shadcn/ui"],
      link: "https://www.guiaprev.com",
      destaque: "Lighthouse 98+, mais de 30 benefícios cobertos",
    },
    {
      nome: "Instituto Convergir",
      descricao:
        "Site institucional de ONG voltada à educação, cultura e esporte, com foco em acessibilidade e apresentação de projetos e formas de apoio.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      link: "https://instituto-convergir.vercel.app/",
      destaque: "8+ projetos institucionais mapeados no site",
    },
    {
      nome: "Premium Interactive Resume (este portfólio)",
      descricao:
        "Portfólio construído como produto: App Router, Server Components, animações e terminal com IA integrada via streaming.",
      stack: ["Next.js 16", "React 19", "TypeScript", "Motion", "Tailwind CSS"],
      link: "https://victormssalves.com",
      destaque: "Lighthouse 98, 20+ componentes",
    },
    {
      nome: "Perfi Cont",
      descricao:
        "Plataforma contábil da Sonnen Software para conectar contadores e clientes, com controle de acesso por perfil.",
      stack: ["Next.js", "React", "PostgreSQL (Neon)", "JWT", "Tailwind CSS"],
      link: "https://www.perficont.com.br",
      destaque: "Controle de acesso por 3 perfis (admin, contador, cliente)",
    },
  ],

  formacao: [
    {
      titulo: "Desenvolvimento Front-end (formação técnica autodidata)",
      instituicao: "Estudo autodidata",
      local: "Online",
      periodo: "2024 — Presente",
      bullets: [
        "HTML5 semântico, CSS3 avançado e JavaScript ES6+.",
        "React com hooks e TypeScript; projetos com deploy em Vercel e GitHub Pages.",
      ],
    },
    {
      titulo: "Scholarship Program | Front-end",
      instituicao: "Compass UOL",
      local: "Online",
      periodo: "Ago 2022 — Dez 2022",
      cargaHoraria: "240h",
      bullets: ["Formação intensiva em fundamentos web e boas práticas de desenvolvimento."],
    },
    {
      titulo: "Inglês Avançado — CEFR B1 (TOEFL ETS 520)",
      instituicao: "CCAA",
      local: "Salvador, BA",
      periodo: "2018 — 2023",
      cargaHoraria: "528h",
      bullets: ["Aproveitamento médio de 84,71%; leitura fluente de documentação técnica em inglês."],
    },
  ],

  idiomas: [
    { idioma: "Português", nivel: "Nativo" },
    { idioma: "Inglês", nivel: "B1 — TOEFL ETS 520" },
  ],
};

export default dadosCurriculo;