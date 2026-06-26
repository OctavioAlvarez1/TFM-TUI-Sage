# Frontend Architecture

## Sage — React 19, MUI v6, Dark Mode, and i18n

---

# 1. Overview

The Sage frontend is a single-page React application built with Vite, TypeScript, and Material UI v6. It provides a landing page with a hero section, a streaming chat interface, and a "how it works" explanation section.

The frontend communicates with the FastAPI backend exclusively via `/api/*` routes, which Vite proxies to `localhost:8504` in development.

---

# 2. Application Entry Point

```
main.tsx
└── App.tsx
    └── AppProvider (context: lang, mode)
        └── ThemedApp
            └── ThemeProvider (MUI theme, swapped based on mode)
                └── CssBaseline
                    └── Chat.tsx (single page)
```

`ThemedApp` is a separate component inside `App.tsx` so it can consume `useApp()` to get `mode` before rendering the `ThemeProvider`. `AppProvider` must wrap `ThemedApp` — it cannot be inside `ThemeProvider`.

---

# 3. Component Hierarchy

```
Chat.tsx (page)
├── Header.tsx
│   ├── Logo (SpaIcon + "SAGE" typography)
│   ├── Nav links (Destinos · Cómo funciona · Suite)
│   ├── Language toggle (flag image from flagcdn.com)
│   ├── Dark/light toggle (DarkModeIcon / LightModeIcon)
│   └── CTA button → scrolls to #chat-widget
│
├── HeroSection.tsx
│   ├── Hero badge ("Reto 5")
│   ├── h1 headline + subtitle
│   ├── StatsBar.tsx (4 KPI cards: destinations, concentration, data points, documents)
│   └── Example question chips → click triggers sendMessage()
│
├── ChatSection.tsx (id="chat")
│   ├── Section header
│   └── Chat widget (id="chat-widget")
│       ├── ChatWindow.tsx (left panel, scrollable)
│       │   ├── Empty state (title + subtitle + chips)
│       │   └── MessageBubble.tsx × N
│       │       ├── User bubble (right-aligned)
│       │       ├── Assistant bubble (left-aligned)
│       │       │   ├── Streamed text content
│       │       │   ├── SourcesPanel.tsx (expandable)
│       │       │   │   └── Source card × N (destination_name, text, relevance)
│       │       │   └── Feedback buttons (ThumbUpAlt / ThumbDownAlt)
│       │       └── LoadingDots.tsx (while isStreaming)
│       ├── StatusSidebar.tsx (right panel)
│       │   ├── StatusChip.tsx (KB status)
│       │   ├── Example questions
│       │   └── How-it-works steps
│       └── ChatInput.tsx (bottom)
│           ├── TextField
│           └── Send button (disabled while isLoading)
│
├── HowItWorksSection.tsx (id="how")
│   └── 4 step cards (Ask · Retrieve · Generate · Answer)
│
└── Footer.tsx (id="footer")
    ├── Suite projects (5 cards with color-coded chips)
    └── Tech stack tags
```

---

# 4. State Management

Global state is provided by `AppContext` — no Redux or external state library.

## AppContext

```typescript
interface AppContextValue {
  lang: 'es' | 'en';
  toggleLang: () => void;
  mode: 'light' | 'dark';
  toggleMode: () => void;
}
```

`lang` and `mode` are initialised from localStorage and written back on every toggle:

```typescript
function getInitialMode(): Mode {
  return (localStorage.getItem('sage_mode') as Mode) ?? 'light';
}
function getInitialLang(): Lang {
  return (localStorage.getItem('sage_lang') as Lang) ?? 'es';
}
```

## useSageStream

Core chat hook. Manages all message state:

```typescript
const { messages, isLoading, error, sendMessage, rateFeedback, clearMessages } = useSageStream();
```

Messages start empty on every page load (no localStorage persistence). `sendMessage()` and `rateFeedback()` use refs (`messagesRef`, `langRef`) to avoid stale closure issues while keeping stable callback references.

---

# 5. Theme System

Two MUI themes are defined in `theme/darkTheme.ts`:

## Light Theme (`createLightTheme()`)

| Token | Value |
|---|---|
| `palette.primary.main` | `#16A34A` |
| `palette.background.default` | `#F8FAFC` |
| `palette.background.paper` | `#FFFFFF` |
| `palette.text.primary` | `#0F172A` |
| `palette.text.secondary` | `#64748B` |

## Dark Theme (`createDarkTheme()`)

| Token | Value |
|---|---|
| `palette.primary.main` | `#22C55E` |
| `palette.background.default` | `#0D1117` |
| `palette.background.paper` | `#161B22` |
| `palette.text.primary` | `#E6EDF3` |
| `palette.text.secondary` | `#8B949E` |

The theme is swapped in `ThemedApp` via `useMemo`:

```typescript
const theme = useMemo(
  () => mode === 'dark' ? createDarkTheme() : createLightTheme(),
  [mode]
);
```

---

# 6. Internationalization (i18n)

All UI strings are defined in `i18n/translations.ts` as a flat object per language:

```typescript
const translations = {
  es: {
    nav_destinos: 'Destinos',
    hero_h1: 'Tu asesor de destinos turísticos inteligente',
    chat_placeholder: '¿Qué destino te gustaría explorar?',
    // ...
  },
  en: {
    nav_destinos: 'Destinations',
    hero_h1: 'Your intelligent tourism destination advisor',
    chat_placeholder: 'What destination would you like to explore?',
    // ...
  },
}
```

Usage in components:

```typescript
const { lang } = useApp();
const T = translations[lang];
// <Typography>{T.hero_h1}</Typography>
```

Translation keys cover: header navigation, hero section, stats bar, chat section, ChatInput, StatusSidebar, HowItWorksSection, MessageBubble labels, and Footer suite projects.

---

# 7. Language Toggle

The language toggle button in the header shows a flag image (not emoji text, which does not render correctly on Windows):

```tsx
<Box
  component="img"
  src={lang === 'es'
    ? 'https://flagcdn.com/w40/us.png'   // current: ES → show EN flag
    : 'https://flagcdn.com/w40/es.png'}  // current: EN → show ES flag
  alt={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
  sx={{ width: 22, height: 'auto', display: 'block', borderRadius: '2px' }}
/>
```

The tooltip explains the action in the opposite language: "Switch to English" when currently in Spanish, "Cambiar a español" when in English.

When the language changes, `langRef.current` in `useSageStream` is updated immediately via `useEffect`, so the next request uses the correct language without requiring a page reload.

---

# 8. Chat Scroll Behaviour

Two distinct scroll behaviours are implemented:

## Container Auto-Scroll (ChatWindow)

When new messages arrive, only the chat container scrolls — not the page:

```typescript
const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const el = containerRef.current;
  if (el) el.scrollTop = el.scrollHeight;
}, [messages]);
```

Using `scrollTop` instead of `scrollIntoView` prevents the page from jumping when the assistant is streaming tokens.

## Parallax Scroll-to-Chat (Hero CTA)

Clicking the CTA button in the hero or header scrolls to the chat widget:

```typescript
document.getElementById('chat-widget')?.scrollIntoView({ block: 'center' });
```

The target is `#chat-widget` (the widget itself) with `block: 'center'`, not `#chat` (the section), which would show only the section heading due to padding.

---

# 9. Message Bubbles

## User Bubble

```
Right-aligned, rounded (top-left and bottom corners)
Light mode: background #F0FDF4, border #BBF7D0
Dark mode:  background #1B3929, border #2D6A4F
```

## Assistant Bubble

```
Left-aligned, rounded (top-right and bottom corners)
Light mode: background #FFFFFF, border theme.palette.divider
Dark mode:  background #1C2128, border theme.palette.divider
```

## Feedback Buttons

Thumb icons (MUI `ThumbUpAltIcon`, `ThumbDownAltIcon`) appear below each completed assistant message:

- Default: grey, outlined
- Active (thumbs up): green (#16A34A)
- Active (thumbs down): red (#EF4444)
- Clicking the same button again toggles off (feedback set to null)

---

# 10. Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8504',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

All frontend API calls use the `/api` prefix. Vite strips it and forwards to the FastAPI backend on port 8504. No CORS or API base URL configuration is needed in the frontend code.

---

# 11. Build and Development

```bash
# Development (hot reload)
cd frontend
npm run dev
# → http://localhost:5174

# Production build
npm run build
# Output: frontend/dist/

# Lint
npm run lint
# Uses oxlint (fast Rust-based linter)
```
