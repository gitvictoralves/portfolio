'use client'

import { motion, AnimatePresence } from 'motion/react'
import { BriefcaseBusiness, Sparkles } from 'lucide-react'
import { useRecruiterMode } from './RecruiterModeProvider'

/* ─────────────────────────────────────────────────────────────
   Tooltip
───────────────────────────────────────────────────────────── */

function Tooltip({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 8, scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0.0, 0, 0.2, 1] as [number, number, number, number] }}
      role="tooltip"
      className="
        absolute right-full mr-3 top-1/2 -translate-y-1/2
        whitespace-nowrap px-3 py-1.5 rounded-md
        glass-2 text-xs font-medium text-[var(--color-neutral-200)]
        border border-white/10 pointer-events-none
      "
    >
      {label}
      {/* Arrow */}
      <span
        aria-hidden="true"
        className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0
          border-t-[5px] border-t-transparent
          border-b-[5px] border-b-transparent
          border-l-[5px] border-l-white/10"
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Toggle
───────────────────────────────────────────────────────────── */

export function RecruiterModeToggle() {
  const { isRecruiterMode, toggle } = useRecruiterMode()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 1.8,
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
        }}
        className="relative group"
      >
        {/* Tooltip — shown on hover */}
        <AnimatePresence>
          <motion.div
            key="tooltip-wrapper"
            initial={false}
            className="hidden group-hover:block"
          >
            <Tooltip
              label={
                isRecruiterMode
                  ? 'Sair do modo recrutador'
                  : 'Modo recrutador — layout limpo, sem animações'
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={toggle}
          aria-pressed={isRecruiterMode}
          aria-label={
            isRecruiterMode
              ? 'Desativar modo recrutador'
              : 'Ativar modo recrutador'
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.0, 0, 0.2, 1] as [number, number, number, number] }}
          className={`
            relative flex items-center gap-2.5
            px-4 py-2.5 rounded-full
            text-xs font-medium
            border
            transition-colors duration-[var(--duration-base)]
            focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
            focus-visible:outline-none
            ${
              isRecruiterMode
                ? `
                  bg-[var(--color-accent-500)] text-white
                  border-[var(--color-accent-400)]/50
                  shadow-[var(--glow-accent)]
                `
                : `
                  glass-2 text-[var(--color-neutral-300)]
                  border-white/10
                  hover:text-[var(--color-neutral-100)]
                  hover:border-white/16
                `
            }
          `}
        >
          {/* Icon swap */}
          <AnimatePresence mode="wait" initial={false}>
            {isRecruiterMode ? (
              <motion.span
                key="briefcase"
                initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                <BriefcaseBusiness
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </motion.span>
            ) : (
              <motion.span
                key="sparkles"
                initial={{ opacity: 0, rotate: 20, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -20, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Label swap */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isRecruiterMode ? 'on' : 'off'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {isRecruiterMode ? 'Modo recrutador' : 'Recruiter mode'}
            </motion.span>
          </AnimatePresence>

          {/* Active indicator dot */}
          <AnimatePresence>
            {isRecruiterMode && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                className="relative flex h-1.5 w-1.5"
                aria-hidden="true"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  )
}