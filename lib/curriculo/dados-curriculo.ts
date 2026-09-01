// lib/curriculo/dados-curriculo.ts
//
// v1.4 — revisão de conteúdo após crítica externa do currículo gerado
// (PDF v1.3, 100% correto visualmente, mas com problemas de conteúdo):
//
//   1. SEÇÃO "BACKEND" ERA DESONESTA COM O PRÓPRIO NÍVEL.
//      O comentário da v1.0 já admitia "os níveis reais desses itens
//      ainda são iniciais — reveja antes de usar numa candidatura
//      formal", mas isso nunca foi refletido no PDF: "Backend" aparecia
//      com o mesmo peso visual e a mesma rotulagem de "Frontend", como
//      se fosse competência consolidada. Isso é o tipo de coisa que
//      quebra a confiança na entrevista técnica quando a profundidade
//      não acompanha o que está escrito.
//      Corrigido: categoria renomeada para "Lógica & Backend (em
//      estudo)". O rótulo aparece literalmente assim no PDF (é só uma
//      string, `linhaGrupo()` não precisa de nenhuma mudança). Mantém
//      as tecnologias visíveis — que é o que importa para ATS e para
//      mostrar direção de carreira — sem fingir senioridade que ainda
//      não existe.
//
//   2. POSICIONAMENTO DIVIDIDO (front-end vs. full-stack júnior).
//      Resumo, "Backend" e o projeto S.G.M puxavam para uma vaga
//      júnior generalista, enquanto headline dizia só "Front-end".
//      Não inventei um segundo perfil de currículo aqui porque isso é
//      decisão sua (para qual vaga está mandando ESTE arquivo) — mas
//      deixei o resumo mais explícito sobre a ordem de prioridade
//      (front-end é o forte; back-end é a direção de crescimento),
//      para o texto e a seção de skills contarem a mesma história.
//      Se for gerar uma segunda versão focada em vaga júnior
//      full-stack, o ideal é duplicar este arquivo (ex.:
//      dados-curriculo-fullstack.ts) trocando `headline` e `resumo`,
//      não misturar os dois num só.
//
//   3. CAMPO `destaques` FINALMENTE PREENCHIDO.
//      O gerador de PDF já suporta a faixa de destaques desde a v1.2
//      (`dados.destaques?.length`), mas o campo nunca foi adicionado
//      aqui — a seção simplesmente nunca apareceu. Adicionei abaixo.
//      REQUISITO: adicione `destaques?: string[];` em
//      lib/curriculo/tipos-curriculo.ts, dentro de `CurriculoData`,
//      se ainda não estiver lá (o tipo não faz parte deste arquivo).
//
//   4. NÚMEROS QUE EU NÃO POSSO INVENTAR.
//      As bullets de "Operador de Telemarketing" e "Estagiário
//      Administrativo" usam "alto volume" duas vezes sem nenhum
//      número — enquanto os projetos têm métricas concretas
//      (Lighthouse, nº de benefícios). Marquei com TODO abaixo os
//      pontos onde um número real (ligações/dia, reservas/mês etc.)
//      fortaleceria a bullet. Não inventei nada — só você tem esses
//      dados.
//
//   5. S.G.M SEM SINALIZAR QUE É PROJETO ARQUIVADO/PARADO.
//      Mantive o item porque é a única prova concreta de Java + Spring
//      Boot hoje. Não escrevi "arquivado" no texto (soa negativo sem
//      necessidade), mas deixei um TODO pedindo para conferir se o
//      README do repositório está apresentável antes de mandar este
//      currículo — é o único link da seção que alguém técnico vai
//      abrir de fato.
//
//   6. TOEFL sem escala ficou mais claro: mantive "B1" na frente
//      (é o que qualquer recrutador entende de cara) e o TOEFL como
//      complemento entre parênteses, não como item principal.

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

  // Faixa curta logo abaixo do headline — o que um recrutador vê antes
  // mesmo do resumo. Só números que já aparecem, de forma verificável,
  // em algum lugar do currículo (projetos, formação); nada novo inventado.
  destaques: [
    "5 projetos reais em produção",
    "Lighthouse 98+",
    "3+ anos de estudo autodidata contínuo",
    "Open source",
  ],

  resumo:
    "Desenvolvedor Front-end com foco em interfaces acessíveis, intuitivas e orientadas ao produto. Experiência com HTML5, CSS3, JavaScript ES6+ e React, em evolução contínua com TypeScript e Next.js. Desenvolvendo conhecimentos em back-end, bancos de dados, orientação a objetos, Java e C#. Experiência em atendimento ao público, com forte comunicação, atenção aos detalhes e foco na experiência do usuário. Mais de 3 anos de estudo e aprimoramento contínuo.",

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
      // Renomeado de "Backend" para refletir o nível real (ver item 1
      // do changelog acima). O conteúdo continua o mesmo — o que muda
      // é não apresentar como competência consolidada o que ainda está
      // em formação.
      categoria: "Lógica & Backend (em estudo)",
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
        // TODO(victor): se souber uma média de ligações/dia ou de
        // segurados atendidos por turno, troque "alto volume" por esse
        // número — mesmo padrão de métrica concreta usado em Projetos.
        "Atendimento receptivo de aproximadamente 50 segurados atendidos por turno, com registro preciso de demandas em sistema interno de gestão.",
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
        // TODO(victor): "múltiplas ferramentas digitais" também é vago —
        // se souber quantas plataformas simultâneas (sistema de
        // hospedagem + financeiro + planilhas, por ex.), listar nomes
        // ou número reforça a mesma habilidade sem soar genérico.
        "Uso simultâneo de múltiplas ferramentas digitais em rotina de alto volume de tarefas.",
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
      // TODO(victor): antes de mandar este currículo, abra o repo e
      // confira se o README está apresentável (contexto do projeto,
      // como rodar, prints se der). É a única evidência de Java +
      // Spring Boot no currículo, então é o link que mais vale a pena
      // um recrutador técnico realmente abrir.
      nome: "S.G.M — Sistema de Gestão de Manutenção",
      descricao:
        "Sistema para controle de ordens de manutenção de equipamentos industriais, com cadastro de equipamentos e técnicos responsáveis, ciclo de vida completo das ordens (aberta, em andamento, concluída) e autenticação via JWT.",
      stack: ["Java 17", "Spring Boot", "Spring Data JPA", "PostgreSQL", "Spring Security + JWT"],
      link: "https://github.com/gitvictoralves/SGM",
      destaque: "Projeto Java + Spring Boot completo, com testes (JUnit/Mockito) e docs via Swagger",
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
    // B1 na frente (o que todo recrutador entende de cara), TOEFL como
    // complemento — ver item 6 do changelog.
    { idioma: "Inglês", nivel: "B1 (TOEFL ITP 520)" },
  ],
};

export default dadosCurriculo;