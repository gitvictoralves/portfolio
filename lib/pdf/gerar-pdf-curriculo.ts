// lib/pdf/gerar-pdf-curriculo.ts
//
// Gera o PDF do currículo a partir dos dados em lib/curriculo/dados-curriculo.ts.
//
// v1.3 — correção de bugs visuais graves da v1.2 (relatados como
// "design quebrado/feio"):
//
//   1. A tira de acento (accent) dos títulos de seção ("RESUMO",
//      "HABILIDADES TÉCNICAS", "PROJETOS"...) estava sendo desenhada
//      longe demais do título e perto demais da linha de conteúdo
//      seguinte. Na prática ela não aparecia como sublinhado do
//      título — aparecia colada na primeira palavra do parágrafo/bullet
//      logo abaixo ("Desenvolvedor", "Frontend:", "Guia Prev",
//      "Operador", "Português"...), como se fosse um highlight torto.
//      Corrigido: a tira agora fica colada na baseline do próprio
//      título (y + 0.9, 0.6mm de altura) e o espaço até a próxima
//      linha de conteúdo aumentou de 4.8mm para 7mm — margem suficiente
//      para o ascender da fonte de conteúdo (9–9.6pt) não invadir a
//      faixa da tira.
//
//   2. Título de seção quase colando no conteúdo da seção anterior
//      (o caso mais visível era "EXPERIÊNCIA PROFISSIONAL" praticamente
//      tocando o último bullet de "Projetos"). sectionTitle() agora
//      adiciona 3.2mm de respiro antes de desenhar o título, e os
//      pequenos "y += 1" / "y += 1.5" nos pontos de chamada foram
//      igualados para 2mm — dando ~5-6mm de respiro consistente antes
//      de cada título, igual ao que já existia entre Resumo e
//      Habilidades técnicas.
//
//   3. Nome e headline do cabeçalho quase se sobrepondo: só havia 3mm
//      entre a baseline do nome (18pt bold) e a do headline (11mm),
//      bem menos que o ascender de uma fonte 18pt. Aumentado para
//      7.5mm.
//
// v1.2 — foco em persuasão / hierarquia de leitura (mantendo 100% ATS-safe):
//
//   1. NOVA seção "Destaques": faixa curta logo abaixo do headline com 3-4
//      números fortes (ex: "4 projetos em produção · Lighthouse 98+ ·
//      3+ anos de estudo autodidata"). É o que um recrutador vê nos
//      primeiros 3 segundos, antes mesmo do resumo. Alimentada por um
//      novo campo opcional `destaques?: string[]` em CurriculoData — se
//      você não adicionar esse campo no tipo/dados, a seção simplesmente
//      não aparece (não quebra nada).
//
//   2. REORDENADO: "Projetos" agora vem ANTES de "Experiência
//      profissional". Para quem está migrando de carreira, os projetos
//      reais (com Lighthouse, stack, métricas) são a prova de competência
//      mais forte — devem aparecer primeiro, não depois de dois cargos
//      fora da área. Ver seção 4 do guia de tendências: projetos pessoais
//      são "praticamente obrigatório" e o maior diferencial para quem
//      está começando.
//
//   3. TEXTO RICO EM BULLETS: bullets e descrições de projeto agora aceitam
//      **texto** para negrito + cor de destaque. Use isso nos números que
//      importam: "reduzindo o tempo de deploy de **40 para 6 minutos**",
//      "**Lighthouse 98+**, mais de **30 benefícios** cobertos". O
//      recrutador escaneia em segundos — os números em destaque são o que
//      ele realmente lê. Continua 100% texto selecionável/ATS-safe: é só
//      negrito + cor, não é imagem nem ícone.
//
//   Nomes de projeto agora usam a cor de destaque (accent) em vez de preto,
//   para reforçar visualmente que essa é a seção mais forte do currículo.
//
// v1.1 — correção de formatação:
//   O jsPDF NÃO quebra linha sozinho em pdf.text() com uma string única —
//   se o texto for mais largo que a página, ele simplesmente desenha pra
//   fora da margem (foi o que cortou "localização" da linha de contato
//   na v1.0). Toda string que pode variar de tamanho agora passa por
//   pdf.splitTextToSize() antes de ser desenhada, e todo par
//   "texto à esquerda + texto à direita na mesma linha" (cargo/data,
//   instituição/data) agora mede a largura real dos dois antes de
//   decidir se cabem lado a lado ou se a data desce pra linha de baixo.
//   Também troquei o indent fixo de 32mm nas categorias de skills — que
//   colidia com "Ferramentas & Fluxo:" — por um indent calculado a
//   partir da largura real do rótulo.
//
// Este gerador segue tendencias-curriculo-dev-2026.md, não o style
// guide visual do portfólio: coluna única, fonte padrão (Helvetica),
// cabeçalhos convencionais, sem barra de proficiência/ícone decorativo,
// texto sempre selecionável, uma única cor de destaque usada com
// moderação.
//
// Requer no projeto:
//   npm install jspdf
//
// Uso:
//   import { gerarPdfCurriculo } from "@/lib/pdf/gerar-pdf-curriculo";
//   <button onClick={() => gerarPdfCurriculo()}>Baixar currículo (PDF)</button>
//
// Para compartilhar (Web Share API) em vez de baixar direto:
//   import { gerarPdfBlobCurriculo } from "@/lib/pdf/gerar-pdf-curriculo";
//   const { file } = await gerarPdfBlobCurriculo();
//   if (file && navigator.canShare?.({ files: [file] })) {
//     await navigator.share({ files: [file] });
//   }
//
// IMPORTANTE — para usar `destaques` e **negrito** nos bullets, adicione
// em lib/curriculo/tipos-curriculo.ts, dentro de CurriculoData:
//
//   destaques?: string[];
//
// E em lib/curriculo/dados-curriculo.ts, algo como:
//
//   destaques: [
//     "4 projetos em produção",
//     "Lighthouse 98+",
//     "3+ anos de estudo autodidata",
//     "Open source",
//   ],

import jsPDF from "jspdf";
import { dadosCurriculo } from "@/lib/curriculo/dados-curriculo";
import type { CurriculoData, GrupoHabilidades } from "@/lib/curriculo/tipos-curriculo";

/* ─────────────────────────────────────────────────────────────────────────
   PALETA — mínima e discreta de propósito (ver nota no topo do arquivo)
───────────────────────────────────────────────────────────────────────── */

type RGB = [number, number, number];

const G = {
  black: [15, 23, 42] as RGB,
  text: [30, 41, 59] as RGB,
  softText: [71, 85, 105] as RGB,
  muteText: [100, 116, 139] as RGB,
  line: [203, 213, 225] as RGB,
  white: [255, 255, 255] as RGB,
  // mesmo indigo do produto, usado com moderação (nome + tiras de seção)
  accent: [79, 53, 214] as RGB,
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   CONSTRUÇÃO DO PDF
───────────────────────────────────────────────────────────────────────── */

interface ResultadoConstrucaoPdf {
  pdf: jsPDF;
  fileName: string;
}

function construirPdfCurriculo(dados: CurriculoData): ResultadoConstrucaoPdf {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = pdf.internal.pageSize.getWidth();
  const PH = pdf.internal.pageSize.getHeight();

  const L = {
    margin: 16,
    width: PW - 32,
    contentTop: 6,
    pageBottom: PH - 7,
  };

  const setFont = (style: "normal" | "bold" = "normal") => pdf.setFont("helvetica", style);
  const setText = (rgb: RGB) => pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setDraw = (rgb: RGB) => pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
  const setFill = (rgb: RGB) => pdf.setFillColor(rgb[0], rgb[1], rgb[2]);

  const text = (
    value: string | string[],
    x: number,
    y: number,
    size = 9.5,
    style: "normal" | "bold" = "normal",
    color: RGB = G.text,
    opts: Record<string, unknown> = {},
  ) => {
    setFont(style);
    setText(color);
    pdf.setFontSize(size);
    if (Array.isArray(value)) pdf.text(value, x, y, opts);
    else pdf.text(String(value), x, y, opts);
  };

  /** Largura real de um texto num dado tamanho/peso — usada para decidir
   *  colisões antes de desenhar (jsPDF não faz isso sozinho). */
  const largura = (value: string, size: number, style: "normal" | "bold" = "normal") => {
    setFont(style);
    pdf.setFontSize(size);
    return pdf.getTextWidth(value);
  };

  const hr = (y: number, color: RGB = G.line, w = 0.2) => {
    setDraw(color);
    pdf.setLineWidth(w);
    pdf.line(L.margin, y, PW - L.margin, y);
  };

  let pageNum = 1;

  const ensureSpace = (y: number, needed: number) => {
    if (y + needed <= L.pageBottom) return y;
    pdf.addPage();
    pageNum += 1;
    return L.contentTop;
  };

  /** Título de seção convencional (EXPERIÊNCIA, FORMAÇÃO...) + tira fina de acento.
   *
   *  v1.3: duas correções de espaçamento vertical que causavam o efeito
   *  "quebrado" (tira roxa colada na palavra errada + título colando na
   *  seção anterior):
   *   - Respiro de 3.2mm ANTES do título, para nunca ficar grudado no
   *     último bullet/linha da seção anterior.
   *   - A tira de acento agora fica a 0.9mm da baseline do título (bem
   *     colada nele) e o retorno da função dá 7mm de espaço até a
   *     próxima linha de conteúdo — margem suficiente para o ascender
   *     de uma fonte 9–9.6pt não invadir a faixa da tira. */
  function sectionTitle(y: number, titulo: string): number {
    y = ensureSpace(y + 3.4, 12);
    text(titulo.toUpperCase(), L.margin, y, 10.5, "bold", G.black, { charSpace: 0.4 });
    setFill(G.accent);
    pdf.rect(L.margin, y + 0.9, 9, 0.6, "F");
    return y + 6.6;
  }

  const stripBold = (s: string) => s.replace(/\*\*/g, "");

  /** Renderiza texto com suporte a **negrito+cor de destaque**, quebrando
   *  linha da mesma forma que pdf.splitTextToSize (garante que a
   *  contagem de linhas bate com o resto do código). Dentro de cada
   *  linha, o texto é desenhado em BLOCOS (runs) de mesmo estilo — um
   *  único Tj por trecho contíguo em negrito ou normal — em vez de
   *  palavra por palavra. Isso é essencial: desenhar palavra a palavra
   *  faz vários extratores de texto (inclusive os usados por ATS)
   *  perderem o espaço entre as palavras no texto copiável, grudando
   *  coisas como "TypeScript,TailwindCSS". Com blocos multi-palavra,
   *  o espaço real fica dentro da própria string do Tj e nunca some. */
  function renderRich(
    conteudo: string,
    x: number,
    y: number,
    size: number,
    corBase: RGB,
    maxWidth: number,
    lineHeight = 3.8,
  ): number {
    // Lista ordenada de palavras com sua flag de negrito, a partir dos marcadores **.
    const partes = conteudo.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    const palavras: { w: string; bold: boolean }[] = [];
    partes.forEach((parte) => {
      const isBold = parte.startsWith("**") && parte.endsWith("**");
      const limpo = isBold ? parte.slice(2, -2) : parte;
      limpo.split(" ").filter(Boolean).forEach((w) => palavras.push({ w, bold: isBold }));
    });

    // Quebra de linha idêntica à do resto do arquivo: sobre o texto SEM
    // marcadores, para o número de linhas bater com as estimativas de
    // ensureSpace feitas pelas funções chamadoras.
    const linhas = pdf.splitTextToSize(stripBold(conteudo), maxWidth) as string[];

    let cursor = 0;
    let curY = y;

    linhas.forEach((linhaTexto, li) => {
      const numPalavrasLinha = linhaTexto.split(" ").filter(Boolean).length;
      const palavrasLinha = palavras.slice(cursor, cursor + numPalavrasLinha);
      cursor += numPalavrasLinha;

      // Agrupa em blocos contíguos de mesmo estilo (negrito/normal).
      const blocos: { palavras: string[]; bold: boolean }[] = [];
      palavrasLinha.forEach((p) => {
        const ultimo = blocos[blocos.length - 1];
        if (ultimo && ultimo.bold === p.bold) ultimo.palavras.push(p.w);
        else blocos.push({ palavras: [p.w], bold: p.bold });
      });

      // O espaço entre um bloco e o próximo precisa ser um caractere
      // real DENTRO da string do Tj (não só espaçamento por posição),
      // senão extratores de texto (ATS, Ctrl+F, copiar-colar) colam as
      // palavras de blocos adjacentes ("de" + "30" vira "de30").
      let cursorX = x;
      blocos.forEach((bloco, bi) => {
        const temProximo = bi < blocos.length - 1;
        const runText = bloco.palavras.join(" ") + (temProximo ? " " : "");
        const style = bloco.bold ? "bold" : "normal";
        const cor = bloco.bold ? G.accent : corBase;
        text(runText, cursorX, curY, size, style, cor);
        cursorX += largura(runText, size, style);
      });

      if (li < linhas.length - 1) curY += lineHeight;
    });

    return curY;
  }

  /** Um bullet com quebra de linha automática, recuo de "•", e suporte a
   *  **negrito** para destacar números/impacto. */
  function bullet(y: number, linha: string): number {
    const larguraTexto = L.width - 5;
    const linhasEstimadas = pdf.splitTextToSize(stripBold(linha), larguraTexto) as string[];
    y = ensureSpace(y, linhasEstimadas.length * 3.8 + 1.2);
    text("•", L.margin + 0.5, y, 8.8, "normal", G.softText);
    const yFinal = renderRich(linha, L.margin + 4.5, y, 8.8, G.text, larguraTexto);
    return yFinal + 4.0;
  }

  /** Uma linha "texto à esquerda (bold) + texto à direita (mute)". Se os
   *  dois não couberem lado a lado, a data desce para a linha seguinte —
   *  nunca deixa colidir, mesmo com títulos longos. */
  function linhaComData(y: number, esquerda: string, direita: string, corEsquerda: RGB = G.black): number {
    const wEsq = largura(esquerda, 9.6, "bold");
    const wDir = largura(direita, 8.4, "normal");
    const cabemLadoALado = L.margin + wEsq + 6 + wDir <= PW - L.margin;

    text(esquerda, L.margin, y, 9.6, "bold", corEsquerda);
    if (cabemLadoALado) {
      text(direita, PW - L.margin, y, 8.4, "normal", G.muteText, { align: "right" });
      return y + 4.6;
    }
    y += 4;
    text(direita, L.margin, y, 8.4, "normal", G.muteText);
    return y + 4.2;
  }

  /** Categoria de skills: "Rótulo: item, item, item" com indent calculado
   *  a partir da largura real do rótulo (evita sobreposição em rótulos
   *  longos como "Ferramentas & Fluxo:"). */
  function linhaGrupo(y: number, rotulo: string, itens: string): number {
    y = ensureSpace(y, 8);
    const label = `${rotulo}: `;
    text(label, L.margin, y, 9, "bold", G.black);
    const offsetX = L.margin + largura(label, 9, "bold");
    const larguraDisponivel = PW - L.margin - offsetX;
    const linhas = pdf.splitTextToSize(itens, larguraDisponivel) as string[];
    text(linhas, offsetX, y, 9, "normal", G.text);
    return y + Math.max(linhas.length, 1) * 4 + 1.2;
  }

  /* ── Cabeçalho: nome, headline, contato — tudo texto, sem foto/ícone ──
     Duas linhas fixas de contato (em vez de uma linha só concatenada)
     para nunca correr o risco de estourar a margem direita. */
  let y = L.contentTop;

  // v1.3: baseline do nome isolada numa constante — a baseline do
  // headline é calculada a partir dela, com 7.5mm de vão (antes eram só
  // 3mm, o que fazia o headline quase encostar no nome de 18pt bold).
  const nomeBaselineY = y + 6;
  text(dados.nomeCompleto, L.margin, nomeBaselineY, 18, "bold", G.accent);
  y = nomeBaselineY + 6.5;
  text(dados.headline, L.margin, y, 11, "normal", G.black);
  y += 5;

  const linha1Contato = [dados.contato.email, dados.contato.telefone, dados.localizacao]
    .filter(Boolean)
    .join("   ·   ");
  const linha2Contato = [dados.contato.linkedin, dados.contato.github, dados.contato.portfolio]
    .filter(Boolean)
    .join("   ·   ");

  [linha1Contato, linha2Contato].forEach((linhaTexto) => {
    if (!linhaTexto) return;
    const linhas = pdf.splitTextToSize(linhaTexto, L.width) as string[];
    text(linhas, L.margin, y, 8.6, "normal", G.softText);
    y += linhas.length * 3.7;
  });

  if (dados.disponibilidade) {
    y += 0.8;
    text(dados.disponibilidade, L.margin, y, 8.4, "normal", G.muteText);
    y += 3;
  }

  /* ── Destaques: faixa curta com 3-4 números fortes, o que o recrutador
     vê ANTES do resumo — a leitura de 10 segundos do seu guia de
     tendências começa aqui. Campo opcional; some se não for preenchido. */
  if (dados.destaques?.length) {
    y += 0.6;
    const destaquesTexto = dados.destaques.join("   ·   ");
    const linhasDestaques = pdf.splitTextToSize(destaquesTexto, L.width) as string[];
    text(linhasDestaques, L.margin, y, 8.8, "bold", G.accent);
    y += linhasDestaques.length * 3.9 + 0.4;
  }

  y += 1.4;
  hr(y, G.black, 0.5);
  y += 2;

  /* ── Resumo ── */
  y = sectionTitle(y, "Resumo");
  const linhasResumo = pdf.splitTextToSize(dados.resumo, L.width) as string[];
  text(linhasResumo, L.margin, y, 9, "normal", G.text);
  y += linhasResumo.length * 3.8 + 2.8;

  /* ── Habilidades técnicas — logo no topo, agrupada por categoria,
     texto corrido, sem barra de proficiência ── */
  y = sectionTitle(y, "Habilidades técnicas");
  dados.stack.forEach((grupo: GrupoHabilidades) => {
    y = linhaGrupo(y, grupo.categoria, grupo.itens.join(", "));
  });
  if (dados.metodologias?.length) {
    y = linhaGrupo(y, "Metodologias", dados.metodologias.join(", "));
  }
  y += 0.8;

  /* ── Projetos — MOVIDO para antes de Experiência profissional. É a
     prova de competência mais forte no currículo; deve aparecer primeiro. ── */
  if (dados.projetos.length) {
    y = sectionTitle(y, "Projetos");
    dados.projetos.forEach((p, i) => {
      y = ensureSpace(y, 15);
      const linkSufixo = p.link ? `   —   ${p.link}` : "";
      text(p.nome, L.margin, y, 9.6, "bold", G.accent);
      const wNome = largura(p.nome, 9.6, "bold");
      text(linkSufixo, L.margin + wNome, y, 8.4, "normal", G.muteText);
      y += 3.8;
      const larguraDesc = L.width;
      y = renderRich(p.descricao, L.margin, y, 8.6, G.text, larguraDesc) + 3.1;
      const linhaStack = `Stack: ${p.stack.join(", ")}${p.destaque ? `  ·  ${p.destaque}` : ""}`;
      y = renderRich(linhaStack, L.margin, y, 8, G.softText, larguraDesc) + (i < dados.projetos.length - 1 ? 4.0 : 2.4);
    });
    y += 0.8;
  }

  /* ── Experiência profissional ── */
  y = sectionTitle(y, "Experiência profissional");
  dados.experiencia.forEach((exp, i) => {
    y = ensureSpace(y, 14);
    const periodoLabel = `${exp.periodo}${exp.atual ? " (atual)" : ""} · ${exp.local}`;
    y = linhaComData(y, `${exp.cargo} — ${exp.empresa}`, periodoLabel);
    exp.bullets.forEach((b) => {
      y = bullet(y, b);
    });
    if (i < dados.experiencia.length - 1) y += 1.5;
  });
  y += 0.8;

  /* ── Formação ── */
  y = sectionTitle(y, "Formação");
  dados.formacao.forEach((f, i) => {
    y = ensureSpace(y, 11);
    const periodoLabel = [f.periodo, f.cargaHoraria, f.local].filter(Boolean).join(" · ");
    y = linhaComData(y, f.titulo, periodoLabel);
    text(f.instituicao, L.margin, y, 8.4, "normal", G.softText);
    y += 3.6;
    f.bullets?.forEach((b) => {
      y = bullet(y, b);
    });
    if (i < dados.formacao.length - 1) y += 1;
  });
  y += 0.8;

  /* ── Idiomas ── */
  y = sectionTitle(y, "Idiomas");
  const linhaIdiomasTexto = dados.idiomas.map((idm) => `${idm.idioma} — ${idm.nivel}`).join("   ·   ");
  const linhasIdiomas = pdf.splitTextToSize(linhaIdiomasTexto, L.width) as string[];
  y = ensureSpace(y, linhasIdiomas.length * 4 + 2);
  text(linhasIdiomas, L.margin, y, 9, "normal", G.text);
  y += linhasIdiomas.length * 4;

  /* ── Rodapé: nº de páginas + data de geração (texto simples, sem grade) ── */
  const totalPages = pdf.getNumberOfPages();
  const geradoEm = new Date().toLocaleDateString("pt-BR");
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    hr(PH - 11, G.line, 0.15);
    text(`Gerado em ${geradoEm}`, L.margin, PH - 7, 7.2, "normal", G.muteText);
    text(`Página ${p} de ${totalPages}`, PW - L.margin, PH - 7, 7.2, "normal", G.muteText, {
      align: "right",
    });
  }

  pdf.setProperties({
    title: `Currículo — ${dados.nomeCompleto}`,
    subject: dados.headline,
    author: dados.nomeCompleto,
    creator: "gerar-pdf-curriculo.ts (jsPDF)",
  });

  const nomeArquivo = dados.nomeCompleto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return { pdf, fileName: `curriculo-${nomeArquivo}.pdf` };
}

/* ─────────────────────────────────────────────────────────────────────────
   FUNÇÕES PÚBLICAS
───────────────────────────────────────────────────────────────────────── */

/** Gera o PDF e dispara o download no navegador. */
export function gerarPdfCurriculo(
  dados: CurriculoData = dadosCurriculo,
): { ok: true; fileName: string } {
  const { pdf, fileName } = construirPdfCurriculo(dados);
  pdf.save(fileName);
  return { ok: true, fileName };
}

/** Gera o mesmo PDF como File, pronto para Web Share API. */
export async function gerarPdfBlobCurriculo(
  dados: CurriculoData = dadosCurriculo,
): Promise<{ ok: true; file: File; fileName: string }> {
  const { pdf, fileName } = construirPdfCurriculo(dados);
  const blob = pdf.output("blob") as Blob;
  const file = new File([blob], fileName, { type: "application/pdf" });
  return { ok: true, file, fileName };
}