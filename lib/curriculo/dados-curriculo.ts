import type { CurriculoData } from "./tipos-curriculo";

export const dadosCurriculo: CurriculoData = {
  nomeCompleto: "Victor Manoel Soares Silva Alves",
  headline: "Frontend Developer - React, TypeScript and Next.js",
  localizacao: "Salvador, Bahia - Brasil (remoto)",
  disponibilidade: "Disponível para oportunidades CLT, PJ ou freelance",

  contato: {
    email: "contato@victormssalves.com",
    telefone: "+55 71 99386-0508",
    linkedin: "linkedin.com/in/victormssalves",
    github: "github.com/gitvictoralves",
    portfolio: "victormssalves.com",
  },

  resumo:
    "Desenvolvedor Front-end com foco em interfaces acessíveis, intuitivas e orientadas ao produto. Experiência com HTML5, CSS3, JavaScript ES6+ e React, em evolução contínua com TypeScript e Next.js. Desenvolvendo conhecimentos em back-end, bancos de dados, orientação a objetos e Java . Experiência em atendimento ao público, com forte comunicação, atenção aos detalhes e foco na experiência do usuário. Mais de 3 anos de estudo e aprimoramento contínuo.",

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
        "consumo de REST APIs (fetch, Axios)",
        "testes com Jest e Testing Library",
      ],
    },
    {
      categoria: "Ferramentas & Fluxo",
      itens: [
        "Git",
        "GitHub",
        "VS Code",
        "IntelliJ IDEA",
        "Figma",
        "GitHub Copilot",
        "Claude (IA no fluxo de dev)",
      ],
    },
    {
      categoria: "Lógica & Backend (em estudo)",
      itens: [
        "SQL (SQL Server, PostgreSQL, MySQL)",
        "Java",
        "Spring Boot",
      ],
    },
  ],

  metodologias: ["Scrum (sprints, planning, daily, retro)", "Kanban (boards, WIP limits)"],

  experiencia: [
    {
      cargo: "Operador de Telemarketing",
      empresa: "Tel Centro de Contatos",
      local: "Salvador, BA",
      periodo: "Jun 2025 - Presente",
      atual: true,
      bullets: [
        "Atendimento receptivo de aproximadamente 50 segurados atendidos por turno, com registro preciso de demandas em sistema interno de gestão.",
        "Resolução de problemas em tempo real sob pressão, mantendo comunicação clara e objetiva com o público.",
      ],
    },
    {
      cargo: "Estagiário Administrativo",
      empresa: "Hotel Luar de Itapuã",
      local: "Salvador, BA",
      periodo: "Fev 2025 - Abr 2025",
      bullets: [
        "Conferência de reservas em sistema de hospedagem e lançamento de pagamentos em plataformas financeiras.",
        "Controle de encargos trabalhistas e organização de documentos contábeis, com atenção a dados sensíveis.",
      ],
    },
  ],

  projetos: [
    {
      nome: "Conta Ativo",
      descricao:
        "Plataforma SaaS de gestão financeira e operacional multi-tenant, com controle de acesso por papel (Dono, Gerente, Financeiro, Operador, Leitura), cadastro de clientes e empresas, lançamentos financeiros, cobrança via PIX/boleto e nota fiscal de serviço integrados ao Asaas, além de módulo de estoque com ficha técnica e produção.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Elysia (Bun)", "MongoDB", "JWT"],
      link: "https://www.contaativo.com",
      destaque: "Controle de acesso por 5 papéis, cobrança PIX/boleto e NFS-e integrados ao Asaas",
    },
    {
      nome: "Guia Prev",
      descricao:
        "Plataforma open source que traduz regras de aposentadoria do INSS em uma experiência simples e visual, com busca, comparador de benefícios e simulador de elegibilidade.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Radix UI", "shadcn/ui"],
      link: "https://www.guiaprev.com",
      destaque: "Lighthouse 98+, mais de 30 benefícios cobertos",
    },
    {
      nome: "Perfi Cont",
      descricao:
        "Plataforma contábil da Sonnen Software para conectar contadores e clientes, com controle de acesso por perfil.",
      stack: ["Next.js", "React", "PostgreSQL (Neon)", "JWT", "Tailwind CSS"],
      link: "https://www.perficont.com.br",
      destaque: "Controle de acesso por 3 perfis (admin, contador, cliente)",
    },
    {
      nome: "S.G.M - Sistema de Gestão de Manutenção",
      descricao:
        "Sistema de controle de ordens de manutenção industrial (cadastro de equipamentos, ciclo de vida das ordens, autenticação JWT) - projeto de estudo em Java para ganhar profundidade em back-end.",
      stack: ["Java 17", "Spring Boot", "Spring Data JPA", "PostgreSQL"],
      link: "https://github.com/gitvictoralves/SGM",
    },
  ],

  formacao: [
    {
      titulo: "Desenvolvimento Front-end (formação técnica autodidata)",
      instituicao: "Estudo autodidata",
      local: "Online",
      periodo: "2024 - Presente",
      bullets: [
        "HTML5 semântico, CSS3 avançado e JavaScript ES6+.",
        "React com hooks e TypeScript; projetos com deploy em Vercel e GitHub Pages.",
      ],
    },
    {
      titulo: "Scholarship Program | Front-end",
      instituicao: "Compass UOL",
      local: "Online",
      periodo: "Ago 2022 - Dez 2022",
      cargaHoraria: "240h",
      bullets: ["Formação intensiva em fundamentos web e boas práticas de desenvolvimento."],
    },
  ],

  idiomas: [
    { idioma: "Português", nivel: "Nativo" },
    { idioma: "Inglês", nivel: "B1 (TOEFL ITP 520, CCAA - leitura fluente de documentação técnica)" },
  ],
};

export default dadosCurriculo;