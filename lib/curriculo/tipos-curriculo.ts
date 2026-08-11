// lib/curriculo/tipos-curriculo.ts
//
// Tipos do modelo de dados usado pelo gerador de PDF do currículo
// (gerar-pdf-curriculo.ts). Deliberadamente "achatado" e sem nada
// visual (sem cor, sem ícone, sem % de proficiência) — o PDF final
// segue as recomendações de tendencias-curriculo-dev-2026.md, que
// pede layout limpo e nada que um ATS não consiga ler.

export interface GrupoHabilidades {
  /** Rótulo da categoria, ex.: "Frontend", "Ferramentas & Fluxo" */
  categoria: string;
  /** Nomes das tecnologias/skills dessa categoria, em ordem de relevância */
  itens: string[];
}

export interface ExperienciaItem {
  cargo: string;
  empresa: string;
  local: string;
  periodo: string;
  atual?: boolean;
  /** Bullets no formato ação + contexto/ferramenta + resultado, quando houver número */
  bullets: string[];
}

export interface FormacaoItem {
  titulo: string;
  instituicao: string;
  local?: string;
  periodo: string;
  cargaHoraria?: string;
  bullets?: string[];
}

export interface ProjetoItem {
  nome: string;
  descricao: string;
  stack: string[];
  link?: string;
  destaque?: string;
}

export interface IdiomaItem {
  idioma: string;
  nivel: string;
}

export interface CurriculoData {
  nomeCompleto: string;
  /** Headline específico: cargo + força principal, nunca "Software Engineer" genérico */
  headline: string;
  localizacao: string;
  disponibilidade?: string;
  contato: {
    email: string;
    telefone?: string;
    linkedin: string;
    github: string;
    portfolio?: string;
  };
  /** 2–3 linhas de resumo, sem enfeites, com palavras-chave da área */
  resumo: string;
  stack: GrupoHabilidades[];
  experiencia: ExperienciaItem[];
  projetos: ProjetoItem[];
  formacao: FormacaoItem[];
  idiomas: IdiomaItem[];
  metodologias?: string[];
}