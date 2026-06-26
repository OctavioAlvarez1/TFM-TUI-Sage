import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Lang } from '../i18n/translations';

type Mode = 'light' | 'dark';

interface AppContextValue {
  mode: Mode;
  toggleMode: () => void;
  lang: Lang;
  toggleLang: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function getInitialMode(): Mode {
  try {
    const stored = localStorage.getItem('sage_mode');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch { /* ignore */ }
  return 'light';
}

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem('sage_lang');
    if (stored === 'es' || stored === 'en') return stored;
  } catch { /* ignore */ }
  return 'es';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [lang, setLang] = useState<Lang>(getInitialLang);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('sage_mode', next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'es' ? 'en' : 'es';
      try { localStorage.setItem('sage_lang', next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ mode, toggleMode, lang, toggleLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
