'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

type MessageRole = 'user' | 'assistant' | 'system'

interface TerminalMessage {
  id: string
  role: MessageRole
  content: string
  streaming?: boolean
}

/* ─────────────────────────────────────────────────────────────
   STATIC COMMANDS — funcionam offline, sem API
───────────────────────────────────────────────────────────── */

const STATIC_COMMANDS: Record<string, string> = {
  help: `Comandos disponíveis:
  whoami       → quem sou eu
  stack        → tecnologias que uso
  available    → minha disponibilidade atual
  location     → onde fico
  contact      → formas de contato
  education    → formação
  experience   → experiência profissional
  mbti         → perfil MBTI
  clear        → limpar terminal
  help         → esta mensagem`,

  whoami: `Victor Manoel Soares Silva Alves
Frontend Developer · Salvador, Bahia — BR
Focado em interfaces premium, acessíveis e orientadas ao produto.`,

  stack: `Core:       React · TypeScript · Next.js · CSS3
Proficiente: Tailwind · Git · Figma · Motion · Node.js
Aprendendo:  Three.js · GSAP · Vercel AI SDK · Jest`,

  available: `Status: Disponível para novas oportunidades
Próxima abertura: em breve
Agendar call: contato@victormssalves.com`,

  location: `Salvador, Bahia — Brasil
Fuso horário: BRT (UTC-3)
Trabalho remoto: sim`,

  contact: `Email:    contato@victormssalves.com
GitHub:   github.com/gitvictoralves
LinkedIn: linkedin.com/in/victormssalves
Cal.com:  cal.com/victor`,

  education: `2024–presente  Desenvolvimento Front-end (Autodidata)
               React, TypeScript, Next.js, Tailwind, Git

2018–2023      Inglês Avançado — CEFR B1
               CCAA · 528h · TOEFL ETS 520`,

  experience: `Jun 2025–atual  Operador de Telemarketing — Tel Centro de Contatos
               Atendimento INSS · Resolução de demandas em alto volume

Fev–Abr 2025   Estagiário Administrativo — Hotel Luar de Itapuã
               Conferência de reservas · Controle financeiro`,

  mbti: `MBTI: INTJ-A — O Arquiteto
Estratégico · Analítico · Introvertido · Autônomo
"Sistemas claros. Soluções elegantes."`,
}

/* ─────────────────────────────────────────────────────────────
   SUGGESTIONS — atalhos rápidos
───────────────────────────────────────────────────────────── */

const SUGGESTIONS = [
  'whoami',
  'stack',
  'available',
  'contact',
  'Me fala sobre o portfólio',
  'Quais são seus projetos?',
  'Como você aprendeu a programar?',
]

/* ─────────────────────────────────────────────────────────────
   WELCOME MESSAGE
───────────────────────────────────────────────────────────── */

const WELCOME: TerminalMessage = {
  id: 'welcome',
  role: 'system',
  content: `Bem-vindo ao terminal de Victor M.S.S. Alves.
Digite "help" para ver os comandos disponíveis, ou faça qualquer pergunta — a IA responde em primeira pessoa.`,
}

/* ─────────────────────────────────────────────────────────────
   SYSTEM PROMPT — contexto completo para o modelo
───────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `Você é Victor Manoel Soares Silva Alves, um desenvolvedor Front-end de Salvador, Bahia, Brasil. Responda sempre em primeira pessoa, de forma direta e honesta, como se estivesse em uma conversa técnica informal.

Sobre você:
- Desenvolvedor Front-end focado em interfaces premium, acessíveis e orientadas ao produto
- Stack principal: React, TypeScript, Next.js, Tailwind CSS
- Aprendendo: Three.js, GSAP, Vercel AI SDK, Jest
- Fuso horário: BRT (UTC-3), trabalho 100% remoto
- MBTI: INTJ-A (O Arquiteto)
- Idiomas: Português nativo, Inglês B1 (TOEFL 520)

Experiência profissional:
- Jun 2025–presente: Operador de Telemarketing na Tel Centro de Contatos (atendimento INSS, alto volume, resolução de demandas)
- Fev–Abr 2025: Estagiário Administrativo no Hotel Luar de Itapuã (reservas, controle financeiro)

Formação:
- 2024–presente: Desenvolvimento Front-end autodidata (projetos com deploy em Vercel/GitHub Pages)
- 2018–2023: Inglês Avançado no CCAA (528h, aproveitamento 84,71%, TOEFL 520)

Projetos / portfólio:
- Este portfólio interativo (Next.js, React, TypeScript, GSAP, Three.js, Vercel AI SDK)
- Foco em cinematic UX, glassmorphism, motion design e acessibilidade

Valores e filosofia:
- Cada detalhe importa, do design ao deploy
- Acessibilidade é feature, não afterthought
- Prefere sistemas claros a soluções complexas
- Código legível é mais valioso que código "inteligente"

Contato:
- Email: contato@victormssalves.com
- GitHub: github.com/gitvictoralves
- LinkedIn: linkedin.com/in/victormssalves
- Agendar call: cal.com/victor

Regras de resposta:
1. Sempre em primeira pessoa ("eu uso", "eu aprendi", "meu projeto")
2. Respostas curtas e diretas — máximo 4 parágrafos
3. Tom técnico informal, sem formalidade excessiva
4. Se não souber algo específico, diga honestamente
5. Nunca quebre o personagem`

/* ─────────────────────────────────────────────────────────────
   HOOK — streaming de resposta via Anthropic API
───────────────────────────────────────────────────────────── */

function useTerminal() {
  const [messages, setMessages] = useState<TerminalMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    // Adiciona ao histórico de comandos
    setHistory(prev => [trimmed, ...prev.slice(0, 49)])
    setHistoryIndex(-1)
    setInput('')

    // Comando "clear"
    if (trimmed.toLowerCase() === 'clear') {
      setMessages([WELCOME])
      return
    }

    // Adiciona mensagem do usuário
    const userMsg: TerminalMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }
    setMessages(prev => [...prev, userMsg])

    // Verifica se é comando estático
    const staticKey = trimmed.toLowerCase().replace(/[^a-z]/g, '')
    const staticReply = STATIC_COMMANDS[staticKey]

    if (staticReply) {
      const assistantMsg: TerminalMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: staticReply,
      }
      setMessages(prev => [...prev, assistantMsg])
      return
    }

    // Chamada streaming à API
    setIsLoading(true)
    const assistantId = crypto.randomUUID()
    const streamingMsg: TerminalMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    }
    setMessages(prev => [...prev, streamingMsg])

    abortRef.current = new AbortController()

    try {
      // Monta histórico de mensagens para o modelo (exclui mensagens de sistema)
      const chatHistory = messages
        .filter(m => m.role !== 'system')
        .concat(userMsg)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          system: SYSTEM_PROMPT,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) throw new Error('API error')
      if (!response.body) throw new Error('No body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const delta = parsed.delta?.text ?? ''
              if (delta) {
                accumulated += delta
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: accumulated }
                      : m
                  )
                )
              }
            } catch {
              // ignora linhas malformadas
            }
          }
        }
      }

      // Finaliza streaming
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, streaming: false } : m
        )
      )
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Erro ao conectar com a IA. Tente um comando estático como "help".', streaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (history.length === 0) return
    const next = direction === 'up'
      ? Math.min(historyIndex + 1, history.length - 1)
      : Math.max(historyIndex - 1, -1)
    setHistoryIndex(next)
    setInput(next === -1 ? '' : history[next])
  }, [history, historyIndex])

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setMessages(prev =>
      prev.map(m => m.streaming ? { ...m, streaming: false } : m)
    )
  }, [])

  return { messages, input, setInput, isLoading, sendMessage, navigateHistory, abort }
}

/* ─────────────────────────────────────────────────────────────
   CURSOR BLINK
───────────────────────────────────────────────────────────── */

function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      className="inline-block w-[7px] h-[14px] align-middle ml-0.5"
      style={{ background: 'var(--color-success)' }}
      aria-hidden="true"
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   MESSAGE ROW
───────────────────────────────────────────────────────────── */

function MessageRow({ msg }: { msg: TerminalMessage }) {
  const shouldReduce = useReducedMotion()

  if (msg.role === 'system') {
    return (
      <div className="mb-4">
        <span
          className="text-xs font-medium uppercase tracking-widest mr-2"
          style={{ color: 'var(--color-accent-400)' }}
        >
          sistema
        </span>
        <pre
          className="inline font-mono text-sm whitespace-pre-wrap leading-relaxed"
          style={{ color: 'var(--color-neutral-400)' }}
        >
          {msg.content}
        </pre>
      </div>
    )
  }

  if (msg.role === 'user') {
    return (
      <motion.div
        initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-2 mb-2"
      >
        <span
          className="font-mono text-sm select-none shrink-0 mt-px"
          style={{ color: 'var(--color-accent-400)' }}
        >
          ›
        </span>
        <span
          className="font-mono text-sm"
          style={{ color: 'var(--color-neutral-100)' }}
        >
          {msg.content}
        </span>
      </motion.div>
    )
  }

  // assistant
  return (
    <motion.div
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5 ml-4"
    >
      <pre
        className="font-mono text-sm whitespace-pre-wrap leading-[1.65]"
        style={{ color: 'var(--color-neutral-300)' }}
      >
        {msg.content}
        {msg.streaming && <BlinkCursor />}
      </pre>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUGGESTION CHIPS
───────────────────────────────────────────────────────────── */

function SuggestionChips({ onSelect }: { onSelect: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Sugestões de comandos">
      {SUGGESTIONS.map(s => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          role="listitem"
          className="px-3 py-1 rounded-md font-mono text-xs transition-all duration-150"
          style={{
            background: 'rgb(255 255 255 / 0.04)',
            border: '1px solid rgb(255 255 255 / 0.08)',
            color: 'var(--color-neutral-400)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = 'rgb(79 53 214 / 0.12)'
            el.style.borderColor = 'rgb(79 53 214 / 0.3)'
            el.style.color = 'var(--color-accent-300)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background = 'rgb(255 255 255 / 0.04)'
            el.style.borderColor = 'rgb(255 255 255 / 0.08)'
            el.style.color = 'var(--color-neutral-400)'
          }}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function Terminal() {
  const { messages, input, setInput, isLoading, sendMessage, navigateHistory, abort } = useTerminal()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Auto-scroll ao fundo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus no input ao montar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Esconde sugestões após o primeiro envio
  const handleSend = useCallback((text: string) => {
    setShowSuggestions(false)
    sendMessage(text)
  }, [sendMessage])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      navigateHistory('up')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      navigateHistory('down')
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      abort()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Terminal window */}
      <div
        className="glass-2 rounded-xl overflow-hidden"
        style={{ border: '1px solid rgb(255 255 255 / 0.10)' }}
        role="region"
        aria-label="Terminal interativo"
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgb(255 255 255 / 0.03)',
            borderBottom: '1px solid rgb(255 255 255 / 0.06)',
          }}
        >
          {/* Traffic lights */}
          <div className="flex gap-1.5" aria-hidden="true">
            {['var(--color-error)', 'var(--color-warning)', 'var(--color-success)'].map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: c, opacity: 0.7 }}
              />
            ))}
          </div>

          {/* Title */}
          <span
            className="flex-1 text-center text-xs font-mono"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            victor@portfolio — bash
          </span>

          {/* Keyboard hint */}
          {isLoading && (
            <button
              onClick={abort}
              className="text-xs font-mono transition-colors"
              style={{ color: 'var(--color-neutral-400)' }}
              aria-label="Cancelar geração (Ctrl+C)"
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-error)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-neutral-400)' }}
            >
              ^C
            </button>
          )}
        </div>

        {/* Output area */}
        <div
          className="p-5 overflow-y-auto"
          style={{ minHeight: 320, maxHeight: 480, scrollbarWidth: 'none' }}
          onClick={() => inputRef.current?.focus()}
          aria-live="polite"
          aria-atomic="false"
        >
          {/* Sugestões */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SuggestionChips onSelect={handleSend} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensagens */}
          {messages.map(msg => (
            <MessageRow key={msg.id} msg={msg} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="ml-4 mb-4">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="font-mono text-xs"
                style={{ color: 'var(--color-neutral-400)' }}
              >
                gerando resposta...
              </motion.span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: '1px solid rgb(255 255 255 / 0.06)' }}
        >
          <span
            className="font-mono text-sm select-none"
            style={{ color: 'var(--color-accent-400)' }}
            aria-hidden="true"
          >
            ›
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando ou pergunta…"
            disabled={isLoading}
            aria-label="Entrada do terminal"
            className="flex-1 bg-transparent font-mono text-sm outline-none"
            style={{
              color: 'var(--color-neutral-100)',
              caretColor: 'var(--color-success)',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {input && (
            <kbd
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{
                color: 'var(--color-neutral-400)',
                background: 'rgb(255 255 255 / 0.04)',
                border: '1px solid rgb(255 255 255 / 0.08)',
              }}
              aria-hidden="true"
            >
              ↵
            </kbd>
          )}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs font-mono" style={{ color: 'var(--color-neutral-400)' }}>
        ↑↓ histórico · ^C cancelar · &apos;clear&apos; limpar tela · qualquer pergunta usa IA
      </p>
    </div>
  )
}