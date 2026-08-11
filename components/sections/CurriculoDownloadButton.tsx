"use client";

import { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { gerarPdfCurriculo } from "@/lib/pdf/gerar-pdf-curriculo";

/* ─────────────────────────────────────────────────────────────
   Botão de download do currículo — segue a variante "Secondary"
   do STYLE.md (glass surface, borda sutil). O CONTEÚDO do PDF
   gerado NÃO segue esse style guide de propósito: currículo
   precisa ser ATS-friendly (ver gerar-pdf-curriculo.ts).
───────────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "done";

export function CurriculoDownloadButton() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      // pequeno delay artificial evitado — jsPDF é síncrono e rápido;
      // o estado "loading" cobre o próprio tempo de execução.
      gerarPdfCurriculo();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      console.error("Erro ao gerar PDF do currículo:", err);
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      aria-label="Baixar currículo em PDF"
      className="
        inline-flex items-center gap-2
        px-5 py-2.5 rounded-md text-sm font-medium
        bg-white/5 border border-white/10 text-[var(--color-neutral-200)]
        hover:bg-white/8 hover:border-white/16
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
      "
    >
      {status === "loading" ? (
        <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />
      ) : status === "done" ? (
        <Check size={15} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Download size={15} strokeWidth={1.5} aria-hidden="true" />
      )}
      {status === "done" ? "Baixado" : "Baixar Currículo (PDF)"}
    </button>
  );
}

export default CurriculoDownloadButton;