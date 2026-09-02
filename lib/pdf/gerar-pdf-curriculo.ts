import jsPDF from "jspdf";
import { dadosCurriculo } from "../curriculo/dados-curriculo";
import type { CurriculoData, GrupoHabilidades } from "../curriculo/tipos-curriculo";

type RGB = [number, number, number];

const G = {
  black: [15, 23, 42] as RGB,
  text: [30, 41, 59] as RGB,
  softText: [71, 85, 105] as RGB,
  muteText: [100, 116, 139] as RGB,
  line: [203, 213, 225] as RGB,
  white: [255, 255, 255] as RGB,
  accent: [79, 53, 214] as RGB,
} as const;

interface ResultadoConstrucaoPdf {
  pdf: jsPDF;
  fileName: string;
}

function construirPdfCurriculo(dados: CurriculoData): ResultadoConstrucaoPdf {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = pdf.internal.pageSize.getWidth();
  const PH = pdf.internal.pageSize.getHeight();

  const L = {
    margin: 15,
    width: PW - 30,
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

  const largura = (value: string, size: number, style: "normal" | "bold" = "normal") => {
    setFont(style);
    pdf.setFontSize(size);
    return pdf.getTextWidth(value);
  };

  const splitText = (
    value: string,
    maxWidth: number,
    size: number,
    style: "normal" | "bold" = "normal",
  ): string[] => {
    setFont(style);
    pdf.setFontSize(size);
    return pdf.splitTextToSize(value, maxWidth) as string[];
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

  function sectionTitle(y: number, titulo: string): number {
    y = ensureSpace(y + 4.0, 10);
    const tituloFmt = titulo.toUpperCase();
    text(tituloFmt, L.margin, y, 10.5, "bold", G.black, { charSpace: 0.4 });
    const larguraTitulo = largura(tituloFmt, 10.5, "bold") + 0.4 * Math.max(tituloFmt.length - 1, 0);
    setFill(G.accent);
    pdf.rect(L.margin, y + 0.9, larguraTitulo, 0.6, "F");
    return y + 6.4;
  }

  const stripBold = (s: string) => s.replace(/\*\*/g, "");

  function renderRich(
    conteudo: string,
    x: number,
    y: number,
    size: number,
    corBase: RGB,
    maxWidth: number,
    lineHeight = 3.7,
    corNegrito: RGB = G.black,
  ): number {
    const partes = conteudo.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    const palavras: { w: string; bold: boolean }[] = [];
    partes.forEach((parte) => {
      const isBold = parte.startsWith("**") && parte.endsWith("**");
      const limpo = isBold ? parte.slice(2, -2) : parte;
      limpo.split(" ").filter(Boolean).forEach((w) => palavras.push({ w, bold: isBold }));
    });

    const linhas = splitText(stripBold(conteudo), maxWidth, size, "normal");

    let cursor = 0;
    let curY = y;

    linhas.forEach((linhaTexto, li) => {
      const numPalavrasLinha = linhaTexto.split(" ").filter(Boolean).length;
      const palavrasLinha = palavras.slice(cursor, cursor + numPalavrasLinha);
      cursor += numPalavrasLinha;

      const blocos: { palavras: string[]; bold: boolean }[] = [];
      palavrasLinha.forEach((p) => {
        const ultimo = blocos[blocos.length - 1];
        if (ultimo && ultimo.bold === p.bold) ultimo.palavras.push(p.w);
        else blocos.push({ palavras: [p.w], bold: p.bold });
      });

      let cursorX = x;
      blocos.forEach((bloco, bi) => {
        const temProximo = bi < blocos.length - 1;
        const runText = bloco.palavras.join(" ") + (temProximo ? " " : "");
        const style = bloco.bold ? "bold" : "normal";
        const cor = bloco.bold ? corNegrito : corBase;
        text(runText, cursorX, curY, size, style, cor);
        cursorX += largura(runText, size, style);
      });

      if (li < linhas.length - 1) curY += lineHeight;
    });

    return curY;
  }

  function bullet(y: number, linha: string): number {
    const larguraTexto = L.width - 5;
    const linhasEstimadas = splitText(stripBold(linha), larguraTexto, 8.6, "normal");
    y = ensureSpace(y, linhasEstimadas.length * 3.7 + 1.0);
    text("•", L.margin + 0.5, y, 8.6, "normal", G.softText);
    const yFinal = renderRich(linha, L.margin + 4.5, y, 8.6, G.text, larguraTexto);
    return yFinal + 3.4;
  }

  function linhaComData(y: number, esquerda: string, direita: string, corEsquerda: RGB = G.black): number {
    const wEsq = largura(esquerda, 9.4, "bold");
    const wDir = largura(direita, 8.2, "normal");
    const cabemLadoALado = L.margin + wEsq + 6 + wDir <= PW - L.margin;

    text(esquerda, L.margin, y, 9.4, "bold", corEsquerda);
    if (cabemLadoALado) {
      text(direita, PW - L.margin, y, 8.2, "normal", G.muteText, { align: "right" });
      return y + 4.1;
    }
    y += 3.6;
    text(direita, L.margin, y, 8.2, "normal", G.muteText);
    return y + 3.8;
  }

  function linhaGrupo(y: number, rotulo: string, itens: string, discreto = false): number {
    const size = discreto ? 8.2 : 8.8;
    const corLabel = discreto ? G.softText : G.black;
    const corItens = discreto ? G.muteText : G.text;
    const label = `${rotulo}: `;
    const offsetX = L.margin + largura(label, size, "bold");
    const larguraDisponivel = PW - L.margin - offsetX;
    const linhas = splitText(itens, larguraDisponivel, size, "normal");

    y = ensureSpace(y, Math.max(linhas.length, 1) * 3.7 + 0.7);
    text(label, L.margin, y, size, "bold", corLabel);
    text(linhas, offsetX, y, size, "normal", corItens);
    return y + Math.max(linhas.length, 1) * 3.7 + 1.3;
  }

  let y = L.contentTop - 1;

  const nomeBaselineY = y + 5.6;
  text(dados.nomeCompleto, L.margin, nomeBaselineY, 17, "bold", G.accent);
  y = nomeBaselineY + 6.0;
  text(dados.headline, L.margin, y, 10.6, "normal", G.black);
  y += 4.6;

  const linha1Contato = [dados.contato.email, dados.contato.telefone, dados.localizacao]
    .filter(Boolean)
    .join("   ·   ");
  const linha2Contato = [dados.contato.linkedin, dados.contato.github, dados.contato.portfolio]
    .filter(Boolean)
    .join("   ·   ");

  [linha1Contato, linha2Contato].forEach((linhaTexto) => {
    if (!linhaTexto) return;
    const linhas = splitText(linhaTexto, L.width, 8.4, "normal");
    text(linhas, L.margin, y, 8.4, "normal", G.softText);
    y += linhas.length * 3.5;
  });

  if (dados.disponibilidade) {
    y += 0.6;
    text(dados.disponibilidade, L.margin, y, 8.2, "normal", G.muteText);
    y += 2.6;
  }

  if (dados.destaques?.length) {
    y += 0.4;
    const destaquesTexto = dados.destaques.join("   ·   ");
    const linhasDestaques = splitText(destaquesTexto, L.width, 8.6, "bold");
    text(linhasDestaques, L.margin, y, 8.6, "bold", G.accent);
    y += linhasDestaques.length * 3.7 + 0.3;
  }

  y += 0.8;
  hr(y, G.black, 0.5);
  y += 1.5;

  y = sectionTitle(y, "Resumo");
  const linhasResumo = splitText(dados.resumo, L.width, 8.8, "normal");
  y = ensureSpace(y, linhasResumo.length * 3.7 + 2.2);
  text(linhasResumo, L.margin, y, 8.8, "normal", G.text);
  y += linhasResumo.length * 3.7 + 3.4;

  y = sectionTitle(y, "Habilidades técnicas");
  dados.stack.forEach((grupo: GrupoHabilidades) => {
    const discreto = grupo.categoria.includes("em estudo");
    y = linhaGrupo(y, grupo.categoria, grupo.itens.join(", "), discreto);
  });
  if (dados.metodologias?.length) {
    y = linhaGrupo(y, "Metodologias", dados.metodologias.join(", "));
  }
  y += 1.4;

  if (dados.projetos.length) {
    y = sectionTitle(y, "Projetos");
    dados.projetos.forEach((p: any, i: number) => {
      const larguraDesc = L.width;
      const linkSufixo = p.link ? `   —   ${p.link}` : "";
      const linhaStack = `Stack: ${p.stack.join(", ")}${p.destaque ? `  ·  ${p.destaque}` : ""}`;
      const espacamentoFinal = i < dados.projetos.length - 1 ? 4.4 : 2.5;

      y = ensureSpace(y, 3.6 + 8);
      text(p.nome, L.margin, y, 9.4, "bold", G.accent);
      const wNome = largura(p.nome, 9.4, "bold");
      text(linkSufixo, L.margin + wNome, y, 8.2, "normal", G.muteText);
      y += 4.2;
      y = bullet(y, p.descricao);
      y = renderRich(linhaStack, L.margin, y, 7.8, G.softText, larguraDesc, 3.6) + espacamentoFinal;
    });
    y += 1.4;
  }

  y = sectionTitle(y, "Experiência profissional");
  dados.experiencia.forEach((exp: any, i: number) => {
    y = ensureSpace(y, 13);
    const periodoLabel = `${exp.periodo}${exp.atual ? " (atual)" : ""} · ${exp.local}`;
    y = linhaComData(y, `${exp.cargo} — ${exp.empresa}`, periodoLabel);
    exp.bullets.forEach((b: string) => {
      y = bullet(y, b);
    });
    if (i < dados.experiencia.length - 1) y += 2.4;
  });
  y += 0.6;

  y = sectionTitle(y, "Formação");
  dados.formacao.forEach((f: any, i: number) => {
    y = ensureSpace(y, 10);
    const periodoLabel = [f.periodo, f.cargaHoraria, f.local].filter(Boolean).join(" · ");
    y = linhaComData(y, f.titulo, periodoLabel);
    text(f.instituicao, L.margin, y, 8.2, "normal", G.softText);
    y += 3.3;
    f.bullets?.forEach((b: string) => {
      y = bullet(y, b);
    });
    if (i < dados.formacao.length - 1) y += 1.6;
  });
  y += 0.6;

  y = sectionTitle(y, "Idiomas");
  const linhaIdiomasTexto = dados.idiomas.map((idm: any) => `${idm.idioma} — ${idm.nivel}`).join("   ·   ");
  const linhasIdiomas = splitText(linhaIdiomasTexto, L.width, 8.8, "normal");
  y = ensureSpace(y, linhasIdiomas.length * 3.9 + 1.5);
  text(linhasIdiomas, L.margin, y, 8.8, "normal", G.text);
  y += linhasIdiomas.length * 3.9;

  const totalPages = pdf.getNumberOfPages();
  const geradoEm = new Date().toLocaleDateString("pt-BR");
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    hr(PH - 11, G.line, 0.15);
    text(`Gerado em ${geradoEm}`, L.margin, PH - 7, 7, "normal", G.muteText);
    text(`Página ${p} de ${totalPages}`, PW - L.margin, PH - 7, 7, "normal", G.muteText, {
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

export function gerarPdfCurriculo(
  dados: CurriculoData = dadosCurriculo,
): { ok: true; fileName: string } {
  const { pdf, fileName } = construirPdfCurriculo(dados);
  pdf.save(fileName);
  return { ok: true, fileName };
}

export async function gerarPdfBlobCurriculo(
  dados: CurriculoData = dadosCurriculo,
): Promise<{ ok: true; file: File; fileName: string }> {
  const { pdf, fileName } = construirPdfCurriculo(dados);
  const blob = pdf.output("blob") as Blob;
  const file = new File([blob], fileName, { type: "application/pdf" });
  return { ok: true, file, fileName };
}

export { construirPdfCurriculo };