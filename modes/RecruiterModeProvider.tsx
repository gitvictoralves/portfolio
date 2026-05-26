'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

interface RecruiterModeContextValue {
  /** Whether recruiter mode is currently active */
  isRecruiterMode: boolean
  /** Toggle recruiter mode on/off */
  toggle: () => void
  /** Explicitly enable */
  enable: () => void
  /** Explicitly disable */
  disable: () => void
}

/* ─────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────── */

const RecruiterModeContext = createContext<RecruiterModeContextValue | null>(null)

/* ─────────────────────────────────────────────────────────────
   Storage key
───────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'recruiter-mode'

/* ─────────────────────────────────────────────────────────────
   Provider
───────────────────────────────────────────────────────────── */

interface RecruiterModeProviderProps {
  children: ReactNode
  /** Default value — used only when no persisted preference exists */
  defaultEnabled?: boolean
}

export function RecruiterModeProvider({
  children,
  defaultEnabled = false,
}: RecruiterModeProviderProps) {
  const [isRecruiterMode, setIsRecruiterMode] = useState<boolean>(defaultEnabled)

  /* ── Rehydrate from localStorage on mount ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setIsRecruiterMode(stored === 'true')
      }
    } catch {
      // localStorage unavailable (SSR guard, private mode, etc.)
    }
  }, [])

  /* ── Sync to localStorage + DOM attribute on change ── */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isRecruiterMode))
    } catch {
      // ignore
    }

    // Apply/remove data-mode="recruiter" on <body> so globals.css
    // overrides ([data-mode="recruiter"] *) work without prop drilling.
    if (isRecruiterMode) {
      document.body.setAttribute('data-mode', 'recruiter')
    } else {
      document.body.removeAttribute('data-mode')
    }
  }, [isRecruiterMode])

  const toggle = useCallback(() => setIsRecruiterMode((prev) => !prev), [])
  const enable = useCallback(() => setIsRecruiterMode(true), [])
  const disable = useCallback(() => setIsRecruiterMode(false), [])

  return (
    <RecruiterModeContext.Provider
      value={{ isRecruiterMode, toggle, enable, disable }}
    >
      {/*
        data-mode is set on <body> via useEffect above so that the CSS
        selector [data-mode="recruiter"] * in globals.css catches every
        descendant regardless of where in the tree it lives.

        We also set it here as a fallback for the immediate subtree
        (avoids a one-frame flash before the effect runs).
      */}
      <div data-recruiter-root={isRecruiterMode ? 'true' : undefined}>
        {children}
      </div>
    </RecruiterModeContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────────── */

/**
 * Returns the recruiter mode context.
 * Must be used inside <RecruiterModeProvider>.
 *
 * @example
 * const { isRecruiterMode, toggle } = useRecruiterMode()
 */
export function useRecruiterMode(): RecruiterModeContextValue {
  const ctx = useContext(RecruiterModeContext)

  if (!ctx) {
    throw new Error(
      'useRecruiterMode must be used inside <RecruiterModeProvider>. ' +
        'Make sure the provider wraps your page in layout.tsx or page.tsx.',
    )
  }

  return ctx
}