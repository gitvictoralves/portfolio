<div align="center">

# Style Guide — Premium Interactive Resume

### Design system, visual tokens, motion principles and component guidelines.

</div>

---

# 1. Design Philosophy

This project's visual identity is inspired by the intersection of **executive software** and **cinematic experience**. The goal is not beauty for its own sake — every visual decision must serve clarity, depth, and emotional resonance.

Key references: Apple, Stripe, Vercel, Linear, Raycast, Arc Browser.

### Core principles

| Principle | Description |
|---|---|
| **Clarity** | No visual noise. Every element earns its place. |
| **Depth** | Layered surfaces, light, and shadow create a sense of space. |
| **Restraint** | Less animation is more. Motion highlights, never decorates. |
| **Emotional design** | Interactions should feel satisfying, never mechanical. |
| **Accessibility first** | Beautiful and usable by everyone, always. |

---

# 2. Color System

## 2.1 Base palette

The system uses a dark-first approach. All colors are defined as CSS custom properties and must be used via Tailwind tokens — never hardcoded hex values in components.

### Neutral (base surfaces)

```css
--color-neutral-950: #08090a;   /* deepest background */
--color-neutral-900: #0d0e10;   /* primary background */
--color-neutral-800: #141518;   /* card surface */
--color-neutral-500: #1c1d21;   /* elevated surface */
--color-neutral-400: #26272d;   /* border / divider */
--color-neutral-500: #3a3b42;   /* muted border */
--color-neutral-400: #6b6c75;   /* disabled / placeholder */
--color-neutral-300: #9a9ba6;   /* secondary text */
--color-neutral-200: #c8c9d1;   /* primary text muted */
--color-neutral-100: #e8e9ee;   /* primary text */
--color-neutral-50:  #f5f5f8;   /* headings / high contrast */
```

### Accent — Electric Indigo

The single chromatic accent. Used sparingly for CTAs, highlights, and active states.

```css
--color-accent-900: #0f0a2e;
--color-accent-800: #1a1050;
--color-accent-700: #251678;
--color-accent-600: #2f1ca0;
--color-accent-500: #4f35d6;   /* primary accent */
--color-accent-400: #7a62e8;   /* hover / glow source */
--color-accent-300: #a491f2;
--color-accent-200: #c9bef8;
--color-accent-100: #e8e3fd;
```

### Semantic colors

```css
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error:   #ef4444;
--color-info:    #38bdf8;
```

## 2.2 Ambient palette (per section)

Each major section emits a subtle background color shift via CSS `@property`. The shift is applied to the `--ambient-hue` custom property and transitions over 800ms.

| Section | Hue | Feel |
|---|---|---|
| Hero | 240° (blue-indigo) | aspirational, deep |
| Identity Card | 260° (indigo-violet) | personal, warm |
| Tech Orbit | 210° (cyan-blue) | technical, cool |
| Timeline | 180° (teal) | growth, forward |
| Projects | 250° (indigo) | creative, focused |
| Terminal | 120° (green) | hacker, precise |
| Dashboard | 200° (sky) | data, clarity |

```css
@property --ambient-hue {
  syntax: '<number>';
  initial-value: 240;
  inherits: false;
}

.ambient-bg {
  background: radial-gradient(
    ellipse 80% 50% at 50% -10%,
    hsl(var(--ambient-hue) 60% 8% / 0.6),
    transparent
  );
  transition: --ambient-hue 800ms ease;
}
```

## 2.3 Glass surfaces

Glassmorphism is the core surface treatment. Three tiers:

```css
/* Tier 1 — subtle (background panels) */
.glass-1 {
  background: rgb(255 255 255 / 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(255 255 255 / 0.06);
}

/* Tier 2 — medium (cards, modals) */
.glass-2 {
  background: rgb(255 255 255 / 0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgb(255 255 255 / 0.10);
}

/* Tier 3 — prominent (identity card, featured elements) */
.glass-3 {
  background: rgb(255 255 255 / 0.09);
  backdrop-filter: blur(24px);
  border: 1px solid rgb(255 255 255 / 0.14);
}
```

> **Rule:** Never stack more than two glass layers on top of each other. Beyond two, legibility breaks and performance degrades.

---

# 3. Typography

## 3.1 Type scale

The system uses two typefaces: **Geist** (sans-serif, all UI) and **Geist Mono** (monospace, terminal and code).

```css
--font-sans: 'Geist', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', monospace;
```

### Scale

| Token | Size | Line height | Weight | Usage |
|---|---|---|---|---|
| `text-display` | 72px | 1.05 | 600 | Hero headline |
| `text-h1` | 48px | 1.1 | 600 | Section titles |
| `text-h2` | 32px | 1.2 | 500 | Subsection titles |
| `text-h3` | 24px | 1.3 | 500 | Card titles |
| `text-h4` | 18px | 1.4 | 500 | Labels, nav items |
| `text-body-lg` | 18px | 1.7 | 400 | Lead paragraphs |
| `text-body` | 16px | 1.7 | 400 | Body text |
| `text-body-sm` | 14px | 1.6 | 400 | Secondary text |
| `text-caption` | 12px | 1.5 | 400 | Metadata, hints |
| `text-mono` | 14px | 1.6 | 400 | Terminal, code |

## 3.2 Type treatments

### Gradient text (headings only)

Reserved for the primary hero headline and section openers. Never used on body text or labels.

```css
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--color-neutral-50) 0%,
    var(--color-neutral-300) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Accent variant — use max once per page */
.text-gradient-accent {
  background: linear-gradient(
    135deg,
    var(--color-accent-300) 0%,
    var(--color-accent-500) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Animated text (GSAP SplitText)

Used on the hero headline and major section entrances. Characters split and animate individually on scroll entry.

```ts
// Standard entrance config
const tl = gsap.timeline();
tl.from(split.chars, {
  opacity: 0,
  y: 24,
  rotateX: -40,
  stagger: 0.02,
  duration: 0.6,
  ease: 'power3.out',
});
```

---

# 4. Spacing & Layout

## 4.1 Spacing scale

Based on a 4px base unit.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

## 4.2 Layout grid

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Breakpoints */
--screen-sm:  640px;
--screen-md:  768px;
--screen-lg:  1024px;
--screen-xl:  1280px;
--screen-2xl: 1536px;
```

## 4.3 Section rhythm

Every major section follows the same vertical structure:

```
section padding-top:    96px  (--space-24)
eyebrow label:          present
section title:          h2
section description:    body-lg, max-width 640px
section content:        varies
section padding-bottom: 96px  (--space-24)
```

---

# 5. Border Radius

```css
--radius-sm:   4px;   /* badges, chips, tags */
--radius-md:   8px;   /* inputs, buttons */
--radius-lg:   12px;  /* cards */
--radius-xl:   16px;  /* modals, panels */
--radius-2xl:  24px;  /* identity card */
--radius-full: 9999px; /* pills, avatars */
```

---

# 6. Shadows & Glows

Shadows are used sparingly and only to reinforce elevation — never for decoration.

```css
/* Elevation shadows (dark mode) */
--shadow-sm: 0 1px 3px rgb(0 0 0 / 0.4);
--shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
--shadow-lg: 0 8px 32px rgb(0 0 0 / 0.6);

/* Accent glow — interactive elements only */
--glow-accent: 0 0 24px rgb(79 53 214 / 0.35);
--glow-accent-strong: 0 0 48px rgb(79 53 214 / 0.5);

/* Semantic glows */
--glow-success: 0 0 20px rgb(34 197 94 / 0.3);
--glow-error:   0 0 20px rgb(239 68 68 / 0.3);
```

> **Rule:** Glows are applied on hover or active state only — never as a default resting state. The identity card is the single exception.

---

# 7. Motion & Animation

## 7.1 Principles

- **Purposeful:** every animation communicates a state change or guides attention.
- **Fast:** entrances under 500ms, exits under 300ms.
- **Physics-based:** prefer spring easings over linear or ease-in-out.
- **Interruptible:** all animations must be cancellable mid-way.

## 7.2 Duration scale

```css
--duration-instant: 80ms;   /* micro-feedback (button press) */
--duration-fast:    150ms;  /* hover states, tooltips */
--duration-base:    250ms;  /* most transitions */
--duration-slow:    400ms;  /* panel open/close */
--duration-slower:  600ms;  /* page entrances */
--duration-cinematic: 1000ms; /* hero, section reveals */
```

## 7.3 Easing tokens

```css
--ease-out:        cubic-bezier(0.0, 0, 0.2, 1);   /* elements entering */
--ease-in:         cubic-bezier(0.4, 0, 1, 1);     /* elements leaving */
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);   /* repositioning */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* playful, bouncy */
--ease-smooth:     cubic-bezier(0.25, 0.46, 0.45, 0.94); /* silky scroll */
```

## 7.4 Standard animation patterns

### Scroll entrance (Motion for React)

```tsx
const entranceVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.0, 0, 0.2, 1] },
  },
};

// Usage
<motion.div
  variants={entranceVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
/>
```

### Staggered list entrance

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
```

### 3D card tilt (Identity Card)

```tsx
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  rotateX.set(y * -14);  // max 7° tilt
  rotateY.set(x * 14);
};
```

## 7.5 Reduced motion

All motion must respect the user's system preference. Use the `useReducedMotion` hook from Motion for React as the single source of truth.

```tsx
const shouldReduceMotion = useReducedMotion();

const variants = {
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
};
```

> Recruiter Mode forcibly sets `shouldReduceMotion = true` regardless of system preference.

---

# 8. Component Guidelines

## 8.1 Buttons

Three variants only. No other button styles are permitted.

### Primary

Used once per section maximum — the most important action.

```tsx
// Visual: accent background, white text, accent glow on hover
<button className="
  px-6 py-3 rounded-md
  bg-accent-500 text-white font-medium text-sm
  hover:bg-accent-400 hover:shadow-glow-accent
  transition-all duration-150
  focus-visible:ring-2 focus-visible:ring-accent-400
">
  Book a call
</button>
```

### Secondary

Default action button.

```tsx
// Visual: glass surface, subtle border
<button className="
  px-6 py-3 rounded-md
  bg-white/5 border border-white/10 text-neutral-200 text-sm
  hover:bg-white/8 hover:border-white/16
  transition-all duration-150
">
  View project
</button>
```

### Ghost

Low-emphasis actions, inline text-adjacent.

```tsx
// Visual: no background, no border, text only
<button className="
  px-3 py-1.5 rounded-md
  text-neutral-400 text-sm
  hover:text-neutral-100 hover:bg-white/4
  transition-all duration-150
">
  Learn more →
</button>
```

## 8.2 Cards

### Standard card

```tsx
<div className="
  rounded-xl p-6
  bg-white/6 backdrop-blur-md
  border border-white/10
  hover:border-white/16 hover:bg-white/8
  transition-all duration-250
">
  {children}
</div>
```

### Featured card (Projects Galaxy)

```tsx
<div className="
  rounded-xl overflow-hidden
  bg-white/6 backdrop-blur-md
  border border-white/10
  hover:border-accent-500/40
  hover:shadow-[0_0_48px_rgb(79,53,214,0.2)]
  transition-all duration-300
">
  {children}
</div>
```

## 8.3 Badges / chips

```tsx
// Neutral
<span className="px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white/8 text-neutral-300 border border-white/10">
  TypeScript
</span>

// Accent (status: available)
<span className="px-2.5 py-0.5 rounded-sm text-xs font-medium bg-accent-500/15 text-accent-300 border border-accent-500/25">
  Available
</span>

// Success
<span className="px-2.5 py-0.5 rounded-sm text-xs font-medium bg-success/10 text-success border border-success/20">
  Live
</span>
```

## 8.4 Eyebrow labels

Small, uppercase, tracked labels that introduce sections. Used above `h2` headings.

```tsx
<p className="text-xs font-medium uppercase tracking-widest text-accent-400 mb-3">
  Experience
</p>
```

## 8.5 Dividers

```tsx
// Horizontal rule
<hr className="border-none border-t border-white/8 my-12" />

// Gradient fade rule (decorative, sections)
<div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-16" />
```

## 8.6 Status indicator (Identity Card)

Animated pulse dot indicating online/available status.

```tsx
<span className="relative flex h-2.5 w-2.5">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
</span>
```

---

# 9. Iconography

Icons are provided by **Lucide React**. Usage rules:

- Default size: `16px` inline, `20px` standalone, `24px` feature icons.
- Stroke width: `1.5px` always — never the default `2px`.
- Color: inherit from parent text color. Never hardcode icon color.
- Decorative icons must have `aria-hidden="true"`.
- Interactive icon-only buttons must have `aria-label`.

```tsx
import { ArrowRight } from 'lucide-react';

// Correct usage
<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
```

---

# 10. Grid overlays

A subtle dot grid is applied to the hero and certain section backgrounds. It is purely decorative and must never interfere with content legibility.

```css
.grid-overlay {
  background-image: radial-gradient(
    circle,
    rgb(255 255 255 / 0.06) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  pointer-events: none;
}
```

---

# 11. Scroll behavior

Smooth scroll is managed globally by **Lenis v2**. Do not use CSS `scroll-behavior: smooth` — it conflicts with Lenis.

```ts
// src/lib/lenis.ts
import Lenis from 'lenis';

export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});
```

> Lenis must be paused when a modal or drawer is open, and resumed on close.

---

# 12. Recruiter Mode

When Recruiter Mode is active, the following overrides apply globally:

```css
[data-mode="recruiter"] * {
  animation: none !important;
  transition: none !important;
  backdrop-filter: none !important;
}

[data-mode="recruiter"] .glass-1,
[data-mode="recruiter"] .glass-2,
[data-mode="recruiter"] .glass-3 {
  background: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-400);
}

[data-mode="recruiter"] .ambient-bg {
  background: none;
}
```

Layout switches from the cinematic grid to a single-column max-width 720px centered layout, mimicking a traditional CV.

---

# 13. Accessibility checklist

Every component must pass the following before being merged:

- [ ] Color contrast ratio ≥ 4.5:1 for body text (WCAG AA)
- [ ] Color contrast ratio ≥ 3:1 for large text and UI components
- [ ] All interactive elements reachable by `Tab` key
- [ ] Focus styles visible and not removed (`outline: none` is forbidden without a custom focus ring)
- [ ] `aria-label` present on all icon-only buttons
- [ ] Decorative images have `alt=""`, informative images have descriptive `alt`
- [ ] `prefers-reduced-motion` respected (via `useReducedMotion`)
- [ ] Screen reader tested with VoiceOver (macOS) and NVDA (Windows)

---

# 14. Naming conventions

### Files & folders

```
PascalCase    → React components      (IdentityCard.tsx)
kebab-case    → pages, routes, utils  (identity-card.ts)
camelCase     → hooks, helpers        (useScrollProgress.ts)
SCREAMING     → constants             (SECTION_IDS.ts)
```

### CSS / Tailwind

Custom classes follow BEM-lite: `block__element--modifier`.

```
.card           → block
.card__header   → element
.card--featured → modifier
```

### Component props

```ts
// Boolean props: is / has / can / should
isLoading, hasError, canExpand, shouldAnimate

// Event handlers: on + PastTense
onCardClick, onSectionEnter, onTerminalSubmit

// Render props / children: render + Subject
renderHeader, renderActions
```

---

# 15. Do's and Don'ts

### Do

- Use the glass surface tiers consistently.
- Keep animations under 500ms for interactive elements.
- Test every component in Recruiter Mode.
- Use `useReducedMotion` before any animation.
- Apply glow effects only on hover or active states.
- Keep the accent color (`indigo-500`) rare — it loses power if overused.

### Don't

- Don't hardcode hex values. Always use CSS custom properties.
- Don't use more than two glass layers stacked.
- Don't add `scroll-behavior: smooth` to CSS — Lenis handles this.
- Don't use `outline: none` without a custom focus ring replacement.
- Don't add decorative animations to content that conveys meaning.
- Don't use font weights above 600.
- Don't use the accent color on backgrounds larger than a button.

---

*Last updated: 2026 — maintained alongside the project. When the design evolves, update this document first.*