<div align="center">

# Premium Interactive Resume

### A cinematic front-end portfolio experience built with Next.js, React, TypeScript and modern motion design.

<p align="center">
  <img src="./public/preview/cover.png" alt="Project Preview" width="100%" />
</p>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=for-the-badge&logo=bun)](https://bun.sh/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

# ✨ Overview

This project is not just a portfolio.

It was designed as a **next-generation interactive resume experience**, combining:
- cinematic storytelling,
- premium UI/UX,
- modern front-end engineering,
- motion design,
- accessibility,
- and immersive interface systems.

The goal is to transform a traditional curriculum into a memorable digital product experience — one that communicates engineering quality, design thinking, and product vision through every interaction.

---

# 🎯 Main Concept

The website simulates a hybrid between:

- Executive SaaS dashboard
- Operating system UI
- Interactive portfolio
- Product showcase
- Personal brand platform

Two audience modes coexist in the same experience: a **Recruiter Mode** for fast, linear reading, and the full cinematic experience for those who want to explore.

---

# 🧠 Features

## 🌌 Cinematic Landing Page
- Dynamic hero section
- Layered glassmorphism
- Animated gradients
- Mouse-reactive spotlight
- Smooth scroll storytelling (Lenis v2)
- Motion-based typography (GSAP SplitText)

---

## 🪪 Interactive Identity Card
Real-time profile card containing:
- location,
- current focus,
- stack,
- languages,
- **real availability** (Cal.com API),
- MBTI,
- status indicators.

With:
- 3D hover tilt,
- glow effects,
- smooth transitions,
- dynamic lighting.

---

## 👔 Recruiter Mode
A single toggle transforms the entire experience into a clean, animation-free, linear layout — readable like a traditional CV. Designed for hiring managers who want information fast.

Features:
- all animations disabled (`prefers-reduced-motion` respected),
- layout restructured for top-to-bottom reading,
- server-side PDF generation on demand.

---

## 🌈 Ambient Mode
The background subtly shifts color temperature as the user scrolls between sections — implemented entirely with CSS `@property` and `color-mix()`, with zero JavaScript overhead.

---

## 🛰️ Tech Orbit Visualization
An interactive technology ecosystem where:
- skills orbit dynamically,
- technologies connect visually,
- proficiency changes intensity,
- stack hierarchy becomes intuitive.

---

## 📈 Executive Metrics Dashboard
A premium analytics section displaying real data from the GitHub GraphQL API:
- projects completed,
- technologies mastered,
- live GitHub activity and streak,
- years of study,
- deployment metrics,
- learning progression.

Data is refreshed via Next.js ISR — always fresh, never slow.

---

## 🧩 Interactive Timeline
Professional and educational journey with:
- horizontal scroll storytelling,
- animated cards,
- experience deep dives,
- architecture breakdowns,
- project insights.

---

## 💻 AI-Powered Terminal
A fully interactive terminal powered by the **Vercel AI SDK 4** with streaming responses. An injected system prompt gives the model full context about Victor — so it responds in first person, accurately.

```bash
> whoami
Victor Manoel Soares Silva Alves

> stack
Next.js, React, TypeScript, Three.js...

> available?
Yes — next opening is next week. Book a call: cal.com/victor

> tell me about the fintech project
That was a dashboard for real-time transaction monitoring...
```

Static commands work offline. AI responses stream in real time.

---

## 🔭 Project Lens

When a project card is clicked, the **View Transition API** (native in Next.js 16) smoothly recontextualizes the entire layout around that project — no modal, no new route. The page breathes open to reveal architecture breakdowns, stack visualizations, and deployment links.

---

## 🚀 Projects Galaxy

A showcase system featuring:

- cinematic project cards,
- hover previews,
- animated transitions,
- stack visualization,
- deployment links,
- architecture highlights.

---

## 🎨 Advanced UI/UX

Built with:

- glassmorphism,
- layered depth,
- executive dark mode (no flash via `next-themes`),
- responsive systems,
- accessibility-first philosophy.

---

# 🛠️ Tech Stack

## Core

- Next.js 16
- React 19 (with Server Actions and the `use()` hook)
- TypeScript 5
- Tailwind CSS 4
- **Bun** (runtime, package manager and test runner)

---

## UI & Design

- shadcn/ui
- Motion Primitives
- Radix UI
- Lucide Icons
- Vaul (gesture-driven mobile drawer)
- next-themes (flash-free theme switching)

---

## Animation & Motion

- **Motion for React v11** (formerly Framer Motion — renamed and restructured)
- GSAP 3.12 with SplitText (now free) and ScrollTrigger
- Lenis v2 (smooth scroll)

---

## 3D & Graphics

- Three.js r168+ (with experimental WebGPU Renderer)
- React Three Fiber 8
- Drei
- @react-three/xr
- Spline v3 (new API)

---

## Data Visualization

- Observable Plot
- Recharts
- D3.js

---

## Data & State

- nuqs (URL-synced state for filters and tabs)
- Zod 3
- React Hook Form
- Plaiceholder (blur image placeholders)

---

## AI & Integrations

- Vercel AI SDK 4 (streaming terminal)
- Cal.com API (real availability in the identity card)
- GitHub GraphQL API (live dashboard metrics)

---

## Developer Experience

- ESLint
- Prettier
- Husky
- @vercel/analytics
- @vercel/speed-insights

---

# 📂 Project Structure

```bash
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── terminal/
│           └── route.ts
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── sections/     # Hero, Timeline, Projects...
│   ├── animations/   # reusable motion wrappers
│   └── shared/       # Navbar, Footer, SmoothScroll...
├── features/
├── hooks/
├── lib/
├── styles/
├── shaders/
├── modes/            # recruiter mode logic
├── ai/               # terminal prompts and AI config
├── transitions/      # View Transition API configs
├── ambient/          # per-section color tokens
├── data/
├── content/
├── utils/
└── public/
    ├── fonts/
    └── preview/
```

---

# 🎥 Design Philosophy

This project follows a strong visual identity inspired by:

- Apple
- Stripe
- Vercel
- Linear
- Raycast
- Arc Browser

Principles:

- clarity,
- depth,
- responsiveness,
- emotional design,
- premium interactions.

---

# 🌙 Visual System

## Executive Glass Theme

Main characteristics:

- blurred translucent surfaces,
- radial gradients,
- subtle grid overlays,
- semantic glows,
- cinematic motion,
- responsive layouts,
- ambient color shifts per section.

---

# ♿ Accessibility

Accessibility is treated as a core feature:

- keyboard navigation,
- screen reader support,
- `prefers-reduced-motion` support (also powers Recruiter Mode),
- semantic HTML,
- proper contrast,
- responsive typography.

---

# ⚡ Performance

Optimized with:

- App Router
- Server Components
- ISR for live data (GitHub, Cal.com)
- Image optimization with blur placeholders (Plaiceholder)
- Lazy loading
- Code splitting
- GPU-accelerated animations
- @vercel/speed-insights for real-user monitoring

---

# 🌍 Internationalization

Planned support:

- Portuguese (BR)
- English (US)

---

# 📱 Responsive Experience

Fully responsive across:

- mobile (with Vaul gesture drawers),
- tablet,
- ultrawide displays,
- high-density screens.

---

# 🧪 Future Ideas

- Voice interactions
- Interactive 3D environment (WebXR via @react-three/xr)
- Audio-reactive particles
- CMS integration for project management
- Multiplayer cursor presence (for live demos)

---

# 🚀 Running Locally

## Prerequisites

Make sure you have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Clone the repository

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

## Install dependencies

```bash
bun install
```

## Set up environment variables

```bash
cp .env.example .env.local
```

Required variables:

```env
ANTHROPIC_API_KEY=        # AI-powered terminal
CAL_API_KEY=              # real availability in the identity card
GITHUB_TOKEN=             # live metrics dashboard
NEXT_PUBLIC_SITE_URL=     # public URL for the deployment
```

## Start development server

```bash
bun dev
```

---

# 📦 Build for production

```bash
bun run build
```

---

# ☁️ Deployment

Recommended platform: **Vercel**

The project uses ISR and Server Actions that require a Node.js runtime — Vercel is the natural fit. Netlify works with the `@netlify/plugin-nextjs` adapter.

> Bun is used locally as the package manager and runtime. Vercel's build pipeline uses Node.js — this is expected and fully compatible.

---

# 👨‍💻 About Me

## Victor Manoel Soares Silva Alves

Frontend developer focused on:

- modern interfaces,
- premium user experiences,
- accessibility,
- scalable front-end architecture,
- and product-oriented development.

Background in customer service and administrative operations, bringing strong communication and user empathy into software development.

---

# 📬 Contact

- Email: [contato@victormssalves.com](mailto:contato@victormssalves.com)
- GitHub: github.com/gitvictoralves
- LinkedIn: linkedin.com/in/victor-manoel-soares-silva-alves

---

# 📄 License

This project is licensed under the MIT License.