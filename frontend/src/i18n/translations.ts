export type Lang = 'es' | 'en';

export interface Translations {
  // Header
  nav_destinos: string;
  nav_como: string;
  nav_suite: string;
  header_cta: string;

  // HeroSection
  hero_badge: string;
  hero_h1_line1: string;
  hero_h1_line2_pre: string;
  hero_h1_line2_cursive: string;
  hero_subtitle: string;
  hero_placeholder: string;
  hero_examples_label: string;
  hero_example_1: string;
  hero_example_2: string;
  hero_example_3: string;

  // StatsBar
  stat_destinos_label: string;
  stat_destinos_sub: string;
  stat_concentracion_label: string;
  stat_concentracion_sub: string;
  stat_datos_label: string;
  stat_datos_sub: string;
  stat_documentos_label: string;
  stat_documentos_sub: string;

  // ChatSection
  chat_overline: string;
  chat_title: string;
  chat_subtitle: string;
  chat_bar_title: string;

  // ChatWindow empty state
  cw_empty_title: string;
  cw_empty_subtitle: string;
  cw_chip_1: string;
  cw_chip_2: string;
  cw_chip_3: string;

  // ChatInput
  ci_placeholder: string;
  ci_hint: string;

  // StatusSidebar
  ss_examples_title: string;
  ss_examples: string[];
  ss_how_title: string;
  ss_how_steps: string[];

  // HowItWorksSection
  hiw_overline: string;
  hiw_title: string;
  hiw_sub: string;
  hiw_steps: { step: string; title: string; body: string }[];

  // Footer
  footer_tagline: string;
  footer_stack_label: string;
  footer_suite_label: string;
  footer_active: string;
  footer_suite: { name: string; reto: number; role: string; color: string; active?: boolean }[];
  footer_copyright: string;

  // MessageBubble
  mb_you: string;
  mb_sage: string;
  mb_thumbup: string;
  mb_thumbdown: string;
}

const es: Translations = {
  // Header
  nav_destinos: 'Destinos',
  nav_como: 'Cómo funciona',
  nav_suite: 'Suite TUI',
  header_cta: 'Pregunta a Sage →',

  // HeroSection
  hero_badge: 'PLATAFORMA DE INTELIGENCIA TURÍSTICA',
  hero_h1_line1: 'Turismo inteligente,',
  hero_h1_line2_pre: 'futuro',
  hero_h1_line2_cursive: 'sostenible.',
  hero_subtitle: 'Transformamos datos en decisiones que mejoran los destinos y la experiencia.',
  hero_placeholder: 'Pregunta a Sage sobre cualquier destino...',
  hero_examples_label: 'Ejemplos:',
  hero_example_1: 'Destinos saturados en agosto',
  hero_example_2: 'Bonificaciones de sostenibilidad Horizon',
  hero_example_3: 'Comparar Barcelona y Donostia',

  // StatsBar
  stat_destinos_label: 'Destinos',
  stat_destinos_sub: 'Playas · Ciudades · Naturaleza · Mixto',
  stat_concentracion_label: 'Concentración',
  stat_concentracion_sub: 'en el 10% del territorio',
  stat_datos_label: 'Datos mensuales',
  stat_datos_sub: 'INE · 13 provincias',
  stat_documentos_label: 'Documentos RAG',
  stat_documentos_sub: 'Contexto + fuentes',

  // ChatSection
  chat_overline: 'Pregunta a Sage',
  chat_title: 'Tu Asesor de Destinos con IA',
  chat_subtitle: 'Respuestas fundamentadas en datos reales de sostenibilidad, congestión y el motor de recomendación Horizon.',
  chat_bar_title: 'Sage · Asesor de Destinos',

  // ChatWindow empty state
  cw_empty_title: 'Pregunta a Sage sobre los destinos de España',
  cw_empty_subtitle: 'Respuestas fundamentadas en datos reales. Usa los ejemplos del lateral o escribe tu propia pregunta.',
  cw_chip_1: '20 destinos',
  cw_chip_2: 'Datos INE',
  cw_chip_3: 'Sostenibilidad',

  // ChatInput
  ci_placeholder: 'Pregunta sobre destinos, sostenibilidad, congestión...',
  ci_hint: 'Enter para enviar · Shift+Enter nueva línea · Respuestas basadas en datos TUI',

  // StatusSidebar
  ss_examples_title: 'Preguntas de ejemplo',
  ss_examples: [
    '¿Cuál es el destino más sostenible de España?',
    '¿Qué destinos tienen congestión crítica en verano?',
    '¿Dónde aplica Horizon penalización por redistribución?',
    '¿Qué destinos de playa tienen bonificación de sostenibilidad?',
    'Compara la sostenibilidad de Barcelona y Donostia.',
  ],
  ss_how_title: 'Cómo funciona',
  ss_how_steps: [
    'Tu pregunta se convierte en vector embedding',
    'ChromaDB recupera los 5 docs más relevantes',
    'Claude responde solo desde esos documentos',
    'Se muestran fuentes y scores de relevancia',
  ],

  // HowItWorksSection
  hiw_overline: 'Cómo Funciona',
  hiw_title: 'Cuatro pasos, datos reales, cero invención',
  hiw_sub: 'Un pipeline RAG que recupera datos reales de destinos españoles, fundamenta cada respuesta y la transmite en tiempo real.',
  hiw_steps: [
    {
      step: '01',
      title: 'Pregunta sobre España',
      body: '¿Qué destinos están saturados en agosto? ¿Dónde aplica Horizon bonificaciones? ¿Cómo compara Barcelona con Donostia?',
    },
    {
      step: '02',
      title: 'Recuperación Semántica',
      body: 'ChromaDB convierte tu consulta en un vector y recupera los 5 documentos más relevantes — datos reales de congestión, sostenibilidad y reservas.',
    },
    {
      step: '03',
      title: 'Claude Lee los Datos',
      body: 'El modelo recibe esos documentos y responde únicamente desde ellos. Sin invención — solo INE, FRONTUR y Horizon.',
    },
    {
      step: '04',
      title: 'Respuesta + Fuentes',
      body: 'Cada respuesta se transmite token a token. Debajo encontrarás los documentos fuente y sus puntuaciones de relevancia.',
    },
  ],

  // Footer
  footer_tagline: 'Asesor de destinos turísticos impulsado por RAG. Respuestas fundamentadas en datos reales del INE, FRONTUR y Horizon.',
  footer_stack_label: 'Stack tecnológico',
  footer_suite_label: 'Suite TUI Care Foundation · Future Shapers Spain',
  footer_active: 'ACTIVO',
  footer_suite: [
    { name: 'Sentinel',   reto: 1, role: 'Monitor de Sentimiento', color: '#F97316' },
    { name: 'Horizon',    reto: 2, role: 'Recomendador IA',        color: '#3B82F6' },
    { name: 'Atlas',      reto: 3, role: 'Dashboard Geoespacial',  color: '#A855F7' },
    { name: 'Pathfinder', reto: 4, role: 'Movilidad Sostenible',   color: '#06B6D4' },
    { name: 'Sage',       reto: 5, role: 'Asesor IA RAG',          color: '#22C55E', active: true },
  ],
  footer_copyright: 'UCM TFM 2026 · TUI Care Foundation Future Shapers Spain',

  // MessageBubble
  mb_you: 'Tú',
  mb_sage: 'Sage',
  mb_thumbup: 'Respuesta útil',
  mb_thumbdown: 'Respuesta mejorable',
};

const en: Translations = {
  // Header
  nav_destinos: 'Destinations',
  nav_como: 'How it works',
  nav_suite: 'TUI Suite',
  header_cta: 'Ask Sage →',

  // HeroSection
  hero_badge: 'TOURISM INTELLIGENCE PLATFORM',
  hero_h1_line1: 'Smart tourism,',
  hero_h1_line2_pre: 'sustainable',
  hero_h1_line2_cursive: 'future.',
  hero_subtitle: 'We turn data into decisions that improve destinations and the visitor experience.',
  hero_placeholder: 'Ask Sage about any destination...',
  hero_examples_label: 'Examples:',
  hero_example_1: 'Overcrowded destinations in August',
  hero_example_2: 'Horizon sustainability bonuses',
  hero_example_3: 'Compare Barcelona and Donostia',

  // StatsBar
  stat_destinos_label: 'Destinations',
  stat_destinos_sub: 'Beaches · Cities · Nature · Mixed',
  stat_concentracion_label: 'Concentration',
  stat_concentracion_sub: 'in 10% of the territory',
  stat_datos_label: 'Monthly data points',
  stat_datos_sub: 'INE · 13 provinces',
  stat_documentos_label: 'RAG Documents',
  stat_documentos_sub: 'Context + sources',

  // ChatSection
  chat_overline: 'Ask Sage',
  chat_title: 'Your AI Destination Advisor',
  chat_subtitle: 'Answers grounded in real sustainability, congestion and Horizon recommendation-engine data.',
  chat_bar_title: 'Sage · Destination Advisor',

  // ChatWindow empty state
  cw_empty_title: 'Ask Sage about Spain\'s destinations',
  cw_empty_subtitle: 'Answers grounded in real data. Use the sidebar examples or type your own question.',
  cw_chip_1: '20 destinations',
  cw_chip_2: 'INE data',
  cw_chip_3: 'Sustainability',

  // ChatInput
  ci_placeholder: 'Ask about destinations, sustainability, congestion...',
  ci_hint: 'Enter to send · Shift+Enter new line · Answers based on TUI data',

  // StatusSidebar
  ss_examples_title: 'Example questions',
  ss_examples: [
    'What is the most sustainable destination in Spain?',
    'Which destinations have critical congestion in summer?',
    'Where does Horizon apply a redistribution penalty?',
    'Which beach destinations have a sustainability bonus?',
    'Compare the sustainability of Barcelona and Donostia.',
  ],
  ss_how_title: 'How it works',
  ss_how_steps: [
    'Your question is converted into a vector embedding',
    'ChromaDB retrieves the 5 most relevant docs',
    'Claude answers only from those documents',
    'Sources and relevance scores are shown',
  ],

  // HowItWorksSection
  hiw_overline: 'How It Works',
  hiw_title: 'Four steps, real data, zero hallucination',
  hiw_sub: 'A RAG pipeline that retrieves real data about Spanish destinations, grounds every answer, and streams it in real time.',
  hiw_steps: [
    {
      step: '01',
      title: 'Ask about Spain',
      body: 'Which destinations are overcrowded in August? Where does Horizon apply bonuses? How does Barcelona compare to Donostia?',
    },
    {
      step: '02',
      title: 'Semantic Retrieval',
      body: 'ChromaDB turns your query into a vector and retrieves the 5 most relevant documents — real congestion, sustainability and booking data.',
    },
    {
      step: '03',
      title: 'Claude Reads the Data',
      body: 'The model receives those documents and answers solely from them. No hallucination — only INE, FRONTUR and Horizon.',
    },
    {
      step: '04',
      title: 'Answer + Sources',
      body: 'Each answer is streamed token by token. Below it you\'ll find the source documents and their relevance scores.',
    },
  ],

  // Footer
  footer_tagline: 'RAG-powered tourism destination advisor. Answers grounded in real INE, FRONTUR and Horizon data.',
  footer_stack_label: 'Tech stack',
  footer_suite_label: 'TUI Care Foundation Suite · Future Shapers Spain',
  footer_active: 'ACTIVE',
  footer_suite: [
    { name: 'Sentinel',   reto: 1, role: 'Sentiment Monitor',      color: '#F97316' },
    { name: 'Horizon',    reto: 2, role: 'AI Recommender',         color: '#3B82F6' },
    { name: 'Atlas',      reto: 3, role: 'Geospatial Dashboard',   color: '#A855F7' },
    { name: 'Pathfinder', reto: 4, role: 'Sustainable Mobility',   color: '#06B6D4' },
    { name: 'Sage',       reto: 5, role: 'RAG AI Advisor',         color: '#22C55E', active: true },
  ],
  footer_copyright: 'UCM TFM 2026 · TUI Care Foundation Future Shapers Spain',

  // MessageBubble
  mb_you: 'You',
  mb_sage: 'Sage',
  mb_thumbup: 'Helpful answer',
  mb_thumbdown: 'Could be improved',
};

export const translations: Record<Lang, Translations> = { es, en };
