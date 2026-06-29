"""Generate TFM academic PDF report for Sage (Reto 5)."""
from fpdf import FPDF, XPos, YPos


TUI_GREEN = (22, 163, 74)
DARK = (15, 23, 42)
GREY = (100, 116, 139)
LIGHT_GREEN_BG = (240, 253, 244)
TABLE_HEADER_BG = (22, 163, 74)
TABLE_ALT_BG = (248, 250, 252)
WHITE = (255, 255, 255)


class SagePDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=22)
        self.set_margins(25, 22, 25)
        self._in_cover = False
        # Register Unicode TrueType fonts (Windows system fonts)
        F = 'C:/Windows/Fonts/'
        self.add_font('Arial', '', F + 'arial.ttf')
        self.add_font('Arial', 'B', F + 'arialbd.ttf')
        self.add_font('Arial', 'I', F + 'ariali.ttf')
        self.add_font('Arial', 'BI', F + 'arialbi.ttf')
        self.add_font('Mono', '', F + 'cour.ttf')
        self.add_font('Mono', 'B', F + 'courbd.ttf')

    def header(self):
        if self._in_cover or self.page_no() <= 1:
            return
        self.set_font('Arial', 'I', 7.5)
        self.set_text_color(*GREY)
        self.cell(0, 5,
            'Sage: Asesor de Destinos Turísticos con RAG  ·  TUI Care Foundation Future Shapers Spain  ·  UCM TFM 2026',
            align='L')
        self.set_draw_color(*GREY)
        self.set_line_width(0.2)
        y = self.get_y() + 2
        self.line(25, y, 185, y)
        self.ln(4)
        self.set_text_color(0, 0, 0)

    def footer(self):
        if self._in_cover:
            return
        self.set_y(-14)
        self.set_draw_color(*GREY)
        self.set_line_width(0.2)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(2)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(*GREY)
        self.cell(0, 5, f'Página {self.page_no()}', align='C')

    # ── Heading helpers ────────────────────────────────────────────────────────

    def h1(self, num, title):
        self.set_font('Arial', 'B', 15)
        self.set_text_color(*TUI_GREEN)
        self.cell(0, 10, f'{num}. {title.upper()}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*TUI_GREEN)
        self.set_line_width(0.6)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(5)
        self.set_text_color(0, 0, 0)

    def h2(self, num, title):
        self.set_font('Arial', 'B', 11)
        self.set_text_color(*DARK)
        self.cell(0, 8, f'{num}  {title}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)
        self.set_text_color(0, 0, 0)

    def h3(self, title):
        self.set_font('Arial', 'BI', 10)
        self.set_text_color(*DARK)
        self.cell(0, 7, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(0, 0, 0)

    def body(self, text):
        self.set_font('Arial', '', 10)
        self.set_text_color(*DARK)
        self.multi_cell(0, 5.5, text)
        self.ln(3)

    def bullet(self, text, indent=8):
        self.set_font('Arial', '', 10)
        self.set_text_color(*DARK)
        x = self.get_x()
        self.set_x(x + indent)
        self.cell(5, 5.5, '•')
        self.multi_cell(0, 5.5, text)
        self.set_x(x)

    def code_block(self, text):
        self.set_fill_color(30, 41, 59)
        self.set_text_color(134, 239, 172)
        self.set_font('Mono', '', 8)
        self.multi_cell(0, 4.5, text, fill=True, border=0,
                        padding=(3, 4, 3, 4))
        self.set_text_color(0, 0, 0)
        self.ln(3)

    def info_box(self, text):
        self.set_fill_color(*LIGHT_GREEN_BG)
        self.set_draw_color(*TUI_GREEN)
        self.set_line_width(0.3)
        self.set_font('Arial', 'I', 9.5)
        self.set_text_color(*DARK)
        self.multi_cell(0, 5.5, text, fill=True, border='L', padding=(3, 5, 3, 5))
        self.set_text_color(0, 0, 0)
        self.ln(3)

    # ── Table helpers ──────────────────────────────────────────────────────────

    def table_head(self, labels, widths):
        self.set_font('Arial', 'B', 9)
        self.set_fill_color(*TABLE_HEADER_BG)
        self.set_text_color(*WHITE)
        for lbl, w in zip(labels, widths):
            self.cell(w, 7, lbl, border=1, fill=True, align='C')
        self.ln()
        self.set_text_color(0, 0, 0)

    def table_row(self, cells, widths, alt=False, bold_first=False):
        self.set_fill_color(*(TABLE_ALT_BG if alt else WHITE))
        for i, (cell, w) in enumerate(zip(cells, widths)):
            self.set_font('Arial', 'B' if (bold_first and i == 0) else '', 9)
            self.cell(w, 6, cell, border=1, fill=True)
        self.ln()


def _cover(pdf):
    pdf._in_cover = True
    pdf.add_page()

    # Green top bar
    pdf.set_fill_color(*TUI_GREEN)
    pdf.rect(0, 0, 210, 40, 'F')

    pdf.set_font('Arial', 'B', 18)
    pdf.set_text_color(*WHITE)
    pdf.set_y(10)
    pdf.cell(0, 10, 'TUI CARE FOUNDATION', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Arial', '', 11)
    pdf.cell(0, 8, 'Future Shapers Spain · Reto 5', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_text_color(*DARK)
    pdf.set_y(60)
    pdf.set_font('Arial', 'B', 26)
    pdf.cell(0, 14, 'SAGE', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 9, 'Asesor de Destinos Turísticos Basado en', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(0, 9, 'Generación Aumentada por Recuperación (RAG)', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_draw_color(*TUI_GREEN)
    pdf.set_line_width(0.8)
    pdf.line(50, pdf.get_y() + 5, 160, pdf.get_y() + 5)
    pdf.ln(12)

    pdf.set_font('Arial', '', 11)
    pdf.set_text_color(*GREY)
    for line in [
        'Hybrid BM25 + ChromaDB Semantic Retrieval con RRF Fusion',
        'Streaming SSE · React 19 + MUI v6 · Bilingüe ES/EN',
        'OpenAI gpt-4o-mini · FastAPI · Docker',
    ]:
        pdf.cell(0, 7, line, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_y(175)
    pdf.set_draw_color(*GREY)
    pdf.set_line_width(0.2)
    pdf.line(25, pdf.get_y(), 185, pdf.get_y())
    pdf.ln(6)

    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(*DARK)
    rows = [
        ('Programa', 'Trabajo de Fin de Máster (TFM)'),
        ('Institución', 'Universidad Complutense de Madrid (UCM)'),
        ('Convocatoria', 'Junio 2026'),
        ('Autor', 'Octavio Álvarez'),
        ('Tutor', 'TUI Care Foundation Future Shapers Spain'),
    ]
    for label, value in rows:
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(50, 7, label + ':')
        pdf.set_font('Arial', '', 10)
        pdf.cell(0, 7, value, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Bottom green bar
    pdf.set_fill_color(*TUI_GREEN)
    pdf.rect(0, 272, 210, 25, 'F')
    pdf.set_y(278)
    pdf.set_font('Arial', 'I', 9)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 6, 'Reto 5 de 5 · Suite TUI Care Foundation · Datos reales INE/FRONTUR (anonimizados)', align='C')
    pdf._in_cover = False


def _abstract(pdf):
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.set_text_color(*TUI_GREEN)
    pdf.cell(0, 10, 'RESUMEN', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(*TUI_GREEN)
    pdf.set_line_width(0.6)
    pdf.line(25, pdf.get_y(), 185, pdf.get_y())
    pdf.ln(4)
    pdf.set_text_color(0, 0, 0)

    pdf.body(
        'España recibe aproximadamente 96,8 millones de turistas internacionales al año, '
        'generando €134.700 millones en actividad económica. Sin embargo, el 85 % de estos '
        'visitantes se concentra en apenas el 10 % de los destinos, provocando sobreturismo '
        'en ciudades como Barcelona, Mallorca o Ibiza, mientras destinos de alto valor '
        'sostenible como Picos de Europa o Sierra Nevada permanecen infrautilizados.'
    )
    pdf.body(
        'Sage es el quinto y último proyecto de la suite TUI Care Foundation Future Shapers '
        'Spain. Su objetivo es proporcionar una interfaz conversacional en lenguaje natural '
        'sobre todos los datos de la suite, permitiendo a los stakeholders consultar patrones '
        'de congestión, puntuaciones de sostenibilidad y reglas del motor de recomendación '
        'Horizon mediante preguntas en español o inglés.'
    )
    pdf.body(
        'La solución implementa un pipeline RAG (Retrieval-Augmented Generation) con '
        'recuperación híbrida: búsqueda semántica con ChromaDB (all-MiniLM-L6-v2) y '
        'búsqueda por palabras clave con BM25Okapi, fusionadas mediante Reciprocal Rank '
        'Fusion (RRF, k=60). Las respuestas se generan con gpt-4o-mini y se transmiten '
        'en tiempo real token a token mediante Server-Sent Events (SSE). La interfaz React 19 '
        'soporta modo oscuro/claro y es completamente bilingüe (ES/EN).'
    )

    pdf.set_font('Arial', 'B', 11)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 8, 'Palabras clave', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.body(
        'RAG · Recuperación Híbrida · BM25 · ChromaDB · RRF · Turismo Sostenible · '
        'FastAPI · React · SSE · OpenAI · LLM · Destinos España'
    )

    pdf.ln(3)
    pdf.set_font('Arial', 'B', 14)
    pdf.set_text_color(*TUI_GREEN)
    pdf.cell(0, 10, 'ABSTRACT', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(*TUI_GREEN)
    pdf.set_line_width(0.6)
    pdf.line(25, pdf.get_y(), 185, pdf.get_y())
    pdf.ln(4)
    pdf.set_text_color(0, 0, 0)

    pdf.body(
        'Spain receives approximately 96.8 million international tourists per year, generating '
        '€134.7 billion in economic activity. However, 85% of visitors concentrate in just 10% '
        'of destinations, causing overtourism in cities such as Barcelona, Mallorca and Ibiza, '
        'while high-value sustainable destinations like Picos de Europa or Sierra Nevada remain '
        'systematically underutilised.'
    )
    pdf.body(
        'Sage is the fifth and final project of the TUI Care Foundation Future Shapers Spain '
        'suite. Its goal is to provide a natural-language conversational interface over all suite '
        'data, enabling stakeholders to query congestion patterns, sustainability scores and '
        'Horizon recommendation engine rules in Spanish or English.'
    )
    pdf.body(
        'The solution implements a RAG (Retrieval-Augmented Generation) pipeline with hybrid '
        'retrieval: semantic search via ChromaDB (all-MiniLM-L6-v2) and keyword search via '
        'BM25Okapi, fused through Reciprocal Rank Fusion (RRF, k=60). Responses are generated '
        'with gpt-4o-mini and streamed token by token via Server-Sent Events (SSE). The React 19 '
        'frontend supports dark/light mode and is fully bilingual (ES/EN).'
    )
    pdf.set_font('Arial', 'B', 11)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 8, 'Keywords', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.body(
        'RAG · Hybrid Retrieval · BM25 · ChromaDB · RRF · Sustainable Tourism · '
        'FastAPI · React · SSE · OpenAI · LLM · Spain Destinations'
    )


def _ch1_intro(pdf):
    pdf.add_page()
    pdf.h1('1', 'Introducción')

    pdf.h2('1.1', 'Contexto: El Sobreturismo en España')
    pdf.body(
        'España es el segundo país del mundo en recepción de turistas internacionales '
        '(96,8 M/año, Eurostat 2024), con un impacto económico de €134.700 M. Sin embargo, '
        'este flujo presenta una distribución extremadamente concentrada: cinco destinos '
        '(Barcelona, Mallorca, Ibiza, Tenerife y Costa del Sol) absorben el 85 % de las '
        'visitas, mientras los restantes 15 destinos monitorizados apenas cubren el 15 % restante.'
    )
    pdf.body(
        'Las consecuencias de esta concentración son múltiples y graves: degradación '
        'medioambiental de ecosistemas costeros y montañosos, encarecimiento de la vivienda '
        'local, rechazo social hacia el turismo masivo ("turismofobia"), y erosión a largo '
        'plazo de la competitividad del sector.'
    )

    pdf.h2('1.2', 'Motivación del Proyecto')
    pdf.body(
        'La suite TUI Care Foundation Future Shapers Spain tiene como objetivo redistribuir '
        'la demanda turística hacia destinos sostenibles infrautilizados. Los proyectos previos '
        '(Sentinel para monitorización de sentimiento, Horizon para recomendación algorítmica, '
        'Atlas para visualización geoespacial, Pathfinder para movilidad sostenible) generan '
        'grandes volúmenes de datos y métricas. Sin embargo, acceder a esta información '
        'requiere conocimientos técnicos específicos de cada herramienta.'
    )
    pdf.body(
        'Sage nace para cerrar esta brecha: proporciona una interfaz conversacional en lenguaje '
        'natural que permite a cualquier stakeholder (director de marketing, investigador, '
        'responsable de sostenibilidad) interrogar toda la suite simplemente formulando '
        'preguntas en español o inglés, sin necesidad de conocer SQL, Python o las APIs '
        'de los proyectos anteriores.'
    )

    pdf.h2('1.3', 'Objetivos')
    for obj in [
        'Implementar un pipeline RAG sobre los datos reales de la suite TUI Care Foundation.',
        'Lograr recuperación robusta mediante búsqueda híbrida (semántica + palabras clave).',
        'Proporcionar respuestas completamente ancladas en documentos factuales, sin alucinaciones.',
        'Soportar conversación multi-turno con coherencia en preguntas de seguimiento.',
        'Ofrecer una interfaz bilingüe (ES/EN) con modo oscuro/claro y streaming en tiempo real.',
        'Desplegar el sistema de forma reproducible mediante contenedores Docker.',
    ]:
        pdf.bullet(obj)
    pdf.ln(3)

    pdf.h2('1.4', 'Alcance')
    pdf.body(
        'Sage cubre los 20 destinos turísticos españoles monitorizados por la suite, '
        'utilizando cuatro fuentes de datos: destinos (características), puntuaciones de '
        'sostenibilidad (FRONTUR), niveles de congestión (INE EOH) e historial de reservas '
        '(sintético, compatible RGPD). El sistema responde exclusivamente con información '
        'contenida en su base de conocimiento — no accede a internet ni a datos en tiempo real.'
    )


def _ch2_state_of_art(pdf):
    pdf.add_page()
    pdf.h1('2', 'Marco Teórico y Estado del Arte')

    pdf.h2('2.1', 'Generación Aumentada por Recuperación (RAG)')
    pdf.body(
        'RAG (Lewis et al., 2020) combina la capacidad generativa de los grandes modelos de '
        'lenguaje (LLM) con un sistema de recuperación de información externo. En lugar de '
        'depender únicamente del conocimiento parametrizado del LLM —propenso a alucinaciones '
        'y desactualización—, RAG recupera documentos relevantes de una base de conocimiento '
        'y los inyecta como contexto en el prompt. El modelo genera su respuesta exclusivamente '
        'a partir de estos documentos, garantizando trazabilidad y fidelidad factual.'
    )
    pdf.info_box(
        'Ventaja clave de RAG frente a fine-tuning: la base de conocimiento se puede actualizar '
        'sin re-entrenar el modelo. En Sage, reconstruir el índice ChromaDB con datos '
        'actualizados tarda ~30 segundos, frente a horas o días de fine-tuning.'
    )

    pdf.h2('2.2', 'Recuperación Híbrida: Semántica + BM25')
    pdf.body(
        'La búsqueda semántica (embeddings vectoriales) captura similitud conceptual pero '
        'falla en consultas con términos específicos (códigos de destino como "D001", '
        'nombres propios exactos, meses en español). BM25 (Robertson & Zaragoza, 2009) '
        'es un modelo probabilístico de recuperación por palabras clave que destaca en '
        'precisión léxica pero ignora la semántica.'
    )
    pdf.body(
        'La combinación de ambos mediante Reciprocal Rank Fusion (RRF) produce resultados '
        'superiores a cualquiera de los dos sistemas por separado, como demuestran Cormack '
        'et al. (2009) y múltiples benchmarks de TREC. Sage implementa este enfoque híbrido '
        'como pieza central de su arquitectura de recuperación.'
    )

    pdf.h2('2.3', 'LLM para Dominio Turístico')
    pdf.body(
        'Los LLM generalistas como GPT-4o-mini presentan limitaciones críticas para '
        'aplicaciones turísticas especializadas: no conocen datos propietarios de la suite, '
        'pueden generar estadísticas incorrectas, y no incorporan reglas de negocio '
        'específicas (como los bonos/penalizaciones del motor Horizon). RAG resuelve estas '
        'tres limitaciones al mismo tiempo.'
    )

    pdf.h2('2.4', 'Trabajos Relacionados')
    pdf.body(
        'Estudios de la suite TUI Care Foundation (2026) demuestran la eficacia de enfoques '
        'complementarios: Grupo 4 implementa FAISS + text-embedding-3-small con redes '
        'neuronales multitarea para predicción de destinos. Sage se diferencia por su '
        'interfaz conversacional completa, recuperación híbrida BM25+ChromaDB con RRF, '
        'y base de conocimiento bilingüe construida en tiempo de indexación (sin overhead '
        'de traducción en tiempo de consulta).'
    )


def _ch3_dataset(pdf):
    pdf.add_page()
    pdf.h1('3', 'Descripción del Conjunto de Datos')

    pdf.h2('3.1', 'Fuentes de Datos')
    pdf.body(
        'Sage utiliza cuatro ficheros CSV del repositorio compartido de la suite '
        '(TUI-Smart-Destination-Recommender/data/raw/), que contienen datos reales '
        'de INE y FRONTUR enriquecidos con registros sintéticos compatibles con el RGPD.'
    )

    pdf.table_head(
        ['Fichero', 'Registros', 'Fuente', 'Contenido'],
        [52, 22, 42, 44]
    )
    rows = [
        ('destinations.csv', '20', 'Sintético', 'Tipo, región, nivel de precio'),
        ('sustainability_scores.csv', '20', 'FRONTUR T.23988', 'Carbono, transporte, negocio local'),
        ('congestion_scores.csv', '240', 'INE EOH T.49371', '12 meses × 20 destinos'),
        ('bookings_history.csv', '~1.000', 'Sintético', 'Reservas con valoraciones'),
    ]
    for i, r in enumerate(rows):
        pdf.table_row(r, [52, 22, 42, 44], alt=(i % 2 == 1))
    pdf.ln(4)

    pdf.h2('3.2', 'Los 20 Destinos Monitorizados')
    pdf.body(
        'La suite monitoriza 20 destinos españoles distribuidos en 8 comunidades autónomas, '
        'con tres tipologías principales: playa, ciudad y naturaleza.'
    )
    pdf.table_head(['ID', 'Destino', 'Comunidad', 'Tipo'], [20, 55, 60, 25])
    dest_rows = [
        ('D001', 'Mallorca', 'Islas Baleares', 'Playa'),
        ('D002', 'Ibiza', 'Islas Baleares', 'Playa'),
        ('D003', 'Menorca', 'Islas Baleares', 'Playa'),
        ('D004', 'Tenerife', 'Canarias', 'Mixto'),
        ('D005', 'Gran Canaria', 'Canarias', 'Mixto'),
        ('D006', 'Lanzarote', 'Canarias', 'Naturaleza'),
        ('D007', 'Costa del Sol', 'Andalucía', 'Playa'),
        ('D008', 'Marbella', 'Andalucía', 'Playa'),
        ('D009', 'Málaga', 'Andalucía', 'Ciudad'),
        ('D010', 'Valencia', 'C. Valenciana', 'Ciudad'),
        ('D011', 'Alicante', 'C. Valenciana', 'Playa'),
        ('D012', 'Benidorm', 'C. Valenciana', 'Playa'),
        ('D013', 'Barcelona', 'Cataluña', 'Ciudad'),
        ('D014', 'Madrid', 'C. de Madrid', 'Ciudad'),
        ('D015', 'Sevilla', 'Andalucía', 'Ciudad'),
        ('D016', 'Granada', 'Andalucía', 'Ciudad'),
        ('D017', 'Bilbao', 'País Vasco', 'Ciudad'),
        ('D018', 'San Sebastián', 'País Vasco', 'Mixto'),
        ('D019', 'Picos de Europa', 'Asturias', 'Naturaleza'),
        ('D020', 'Sierra Nevada', 'Andalucía', 'Naturaleza'),
    ]
    for i, r in enumerate(dest_rows):
        pdf.table_row(r, [20, 55, 60, 25], alt=(i % 2 == 1))
    pdf.ln(3)
    pdf.body(
        'D019 (Picos de Europa) y D020 (Sierra Nevada) son los destinos objetivo de '
        'redistribución de Horizon: congestión media baja durante todo el año, '
        'puntuación de sostenibilidad excelente, y actualmente infrautilizados.'
    )


def _ch4_architecture(pdf):
    pdf.add_page()
    pdf.h1('4', 'Arquitectura del Sistema')

    pdf.h2('4.1', 'Visión General')
    pdf.body(
        'Sage es un sistema full-stack RAG compuesto por cuatro capas: datos (CSVs + ChromaDB), '
        'pipeline de recuperación híbrida, servidor de API con streaming SSE, y cliente '
        'React con interfaz bilingüe. La comunicación entre frontend y backend se realiza '
        'exclusivamente mediante HTTP/SSE, sin dependencias de WebSockets.'
    )
    pdf.code_block(
        '  React SPA (puerto 5174)\n'
        '    ChatInput  →  useSageStream  →  streamAsk()  →  sageApi.ts\n'
        '         ↓\n'
        '  FastAPI (puerto 8504)   POST /ask/stream\n'
        '    ├── rewrite_query()   [LLM reescritura de seguimientos]\n'
        '    ├── query()           [BM25 + ChromaDB + RRF + filtro]\n'
        '    └── stream_ask()      [gpt-4o-mini streaming]\n'
        '         ↓                      ↓\n'
        '  ChromaDB (data/chroma/)   OpenAI API\n'
        '  BM25 index (memoria)'
    )

    pdf.h2('4.2', 'Capa de Datos')
    pdf.body(
        'Los CSVs se leen únicamente en tiempo de construcción de la base de conocimiento '
        '(por data_loader.py). En tiempo de ejecución, la capa de datos es ChromaDB '
        '(almacenamiento persistente en data/chroma/) con el índice BM25 reconstruido '
        'en memoria al primer query. Esto elimina I/O de disco en cada consulta.'
    )

    pdf.h2('4.3', 'Capa de Recuperación Híbrida')
    pdf.body(
        'knowledge_base.py implementa la recuperación en cuatro fases: (1) búsqueda semántica '
        'en ChromaDB con n_candidates = min(total, max(n_results×3, 15)), (2) scoring BM25Okapi '
        'sobre el corpus completo, (3) fusión RRF con k=60, y (4) filtrado por umbral de '
        'distancia coseno ≤ 0,6 con fallback al top semántico si todos los documentos '
        'son filtrados.'
    )

    pdf.h2('4.4', 'Capa LLM y Streaming')
    pdf.body(
        'claude_client.py (nombre histórico del módulo) gestiona tres responsabilidades: '
        'reescritura de consultas, generación de respuestas no-streaming (POST /ask) y '
        'generación streaming (POST /ask/stream). El generador síncrono stream_ask() se '
        'conecta al event loop asíncrono de FastAPI mediante asyncio.Queue y ThreadPoolExecutor '
        '(2 workers).'
    )

    pdf.h2('4.5', 'Capa de Interfaz (React 19 + MUI v6)')
    pdf.body(
        'La interfaz de usuario es una Single Page Application (SPA) construida con React 19, '
        'TypeScript y MUI v6. Implementa cinco secciones: hero con estadísticas, chat, cómo '
        'funciona, footer de la suite. El estado global (idioma, tema) se gestiona mediante '
        'AppContext; el estado del chat mediante useSageStream. Ambas preferencias persisten '
        'en localStorage.'
    )


def _ch5_rag(pdf):
    pdf.add_page()
    pdf.h1('5', 'Implementación Técnica del Pipeline RAG')

    pdf.h2('5.1', 'Construcción de la Base de Conocimiento')
    pdf.body(
        'document_builder.py convierte los CSVs en 21 documentos ricos en texto. Cada uno '
        'de los 20 documentos de destino incluye: tipo y región, puntuación de sostenibilidad '
        '(con nivel cualitativo: Excelente/Bueno/Moderado/Deficiente), congestión mensual '
        '(valor promedio, mes pico, meses con congestión >80), valoración media de reservas, '
        'y reglas Horizon codificadas explícitamente (bonus/penalizaciones aplicables).'
    )
    pdf.body(
        'El documento se genera en español (campo text principal de ChromaDB) y en inglés '
        '(campo metadata.text_en, truncado a 800 caracteres). La generación bilingüe en '
        'tiempo de indexación elimina el overhead de traducción en tiempo de consulta '
        'y garantiza precisión numérica idéntica en ambos idiomas.'
    )

    pdf.h2('5.2', 'Recuperación Híbrida y RRF')
    pdf.body(
        'La función query() ejecuta en paralelo dos señales de recuperación:'
    )
    for b in [
        'Semántica: ChromaDB.query() con similitud coseno sobre embeddings all-MiniLM-L6-v2.',
        'Palabras clave: BM25Okapi.get_scores() sobre el corpus tokenizado en minúsculas sin puntuación.',
    ]:
        pdf.bullet(b)
    pdf.ln(2)
    pdf.body(
        'Ambas listas de resultados se fusionan mediante Reciprocal Rank Fusion:'
    )
    pdf.code_block('  RRF_score(d) = SUM_r [ 1 / (k + rank_r(d) + 1) ]   donde k = 60')
    pdf.body(
        'El umbral de filtrado elimina documentos con distancia coseno > 0,6. Si ningún '
        'documento supera el umbral, se devuelven los N mejores por similitud semántica '
        '(fallback), evitando respuestas vacías.'
    )

    pdf.h2('5.3', 'Reescritura de Consultas')
    pdf.body(
        'Las preguntas de seguimiento ("¿y cuál tiene menos congestión?") no contienen '
        'suficiente contexto para recuperar documentos relevantes. rewrite_query() invoca '
        'gpt-4o-mini con el historial de conversación y la pregunta de seguimiento para '
        'generar una consulta autónoma de recuperación. La función se omite si el historial '
        'tiene menos de 2 mensajes (primera pregunta).'
    )

    pdf.h2('5.4', 'Prompts del Sistema')
    pdf.body(
        'Sage utiliza dos prompts de sistema (ES/EN) con la misma estructura de 8 reglas:'
    )
    for r in [
        'Responder siempre en el idioma seleccionado.',
        'Responder ÚNICAMENTE con los documentos de contexto proporcionados.',
        'Citar siempre los nombres de destinos con precisión.',
        'Mencionar puntuaciones con precisión numérica.',
        'Indicar claramente si la información no está disponible.',
        'Mantener respuestas concisas (3-6 frases salvo necesidad de más detalle).',
        'Mencionar las reglas de Horizon cuando sean relevantes.',
        'Finalizar con la frase de cierre TUI Care Foundation.',
    ]:
        pdf.bullet(f'Regla {r[:2].strip(".")}: {r[3:] if r[1]=="." else r}')
    pdf.ln(2)

    pdf.h2('5.5', 'Historial de Conversación')
    pdf.body(
        'Los últimos MAX_HISTORY_TURNS = 6 mensajes (3 turnos usuario + 3 asistente) se '
        'incluyen en el array messages de cada llamada al LLM. El frontend filtra los '
        'mensajes en estado streaming antes de enviarlos al backend, evitando contexto '
        'incompleto en el historial.'
    )


def _ch6_frontend_docker(pdf):
    pdf.add_page()
    pdf.h1('6', 'Interfaz de Usuario y Despliegue Docker')

    pdf.h2('6.1', 'Arquitectura Frontend')
    pdf.body(
        'La interfaz es una SPA en React 19 + TypeScript + MUI v6. El estado global '
        '(idioma y tema) se centraliza en AppContext; el estado del chat (mensajes, '
        'streaming, feedback) en el hook useSageStream. El lector SSE (streamAsk en '
        'sageApi.ts) consume el stream del backend usando la Fetch API y ReadableStream.'
    )
    pdf.table_head(['Componente', 'Responsabilidad'], [60, 100])
    comps = [
        ('Header.tsx', 'Navegación, toggle idioma (flagcdn.com), toggle tema'),
        ('HeroSection.tsx', 'Landing con 4 KPIs y chips de preguntas ejemplo'),
        ('ChatWindow.tsx', 'Lista de mensajes con auto-scroll (containerRef)'),
        ('MessageBubble.tsx', 'Burbuja usuario/asistente + LoadingDots + feedback'),
        ('SourcesPanel.tsx', 'Documentos fuente expandibles con puntuación de relevancia'),
        ('ChatInput.tsx', 'Campo de texto + botón de envío (desactivado en streaming)'),
        ('StatusSidebar.tsx', 'Estado de la KB + preguntas ejemplo + pasos de funcionamiento'),
    ]
    for i, r in enumerate(comps):
        pdf.table_row(r, [60, 100], alt=(i % 2 == 1))
    pdf.ln(4)

    pdf.h2('6.2', 'Sistema de Temas (Dark/Light) e i18n')
    pdf.body(
        'MUI v6 permite definir temas completos con createTheme(). Sage define '
        'createLightTheme() y createDarkTheme() en darkTheme.ts, seleccionados mediante '
        'useMemo en ThemedApp según el estado mode del AppContext. Ambos temas persisten '
        'en localStorage (clave sage_mode).'
    )
    pdf.body(
        'El sistema i18n utiliza un objeto translations.ts plano con todas las cadenas '
        'de UI en ES/EN, seleccionadas mediante el hook useContext(AppContext). '
        'El toggle de idioma muestra la bandera del idioma opuesto (imágenes desde flagcdn.com, '
        'ya que los emojis de bandera no se renderizan correctamente en Windows).'
    )

    pdf.h2('6.3', 'Despliegue con Docker')
    pdf.body(
        'Sage incluye soporte completo de contenedores Docker para facilitar el despliegue '
        'reproducible en cualquier entorno.'
    )
    pdf.table_head(['Archivo', 'Descripción'], [60, 100])
    docker_rows = [
        ('Dockerfile', 'Imagen backend: python:3.11-slim + dependencias + uvicorn'),
        ('frontend/Dockerfile', 'Multi-stage: node:20-alpine (build) → nginx:alpine (serve)'),
        ('frontend/nginx.conf', 'Proxy /api/ → http://backend:8504/ con soporte SSE sin buffering'),
        ('docker-compose.yml', 'Orquesta backend + frontend; volumen sage_chroma para ChromaDB'),
        ('.env.example', 'Plantilla de variables de entorno (OPENAI_API_KEY)'),
    ]
    for i, r in enumerate(docker_rows):
        pdf.table_row(r, [60, 100], alt=(i % 2 == 1))
    pdf.ln(4)
    pdf.code_block(
        '  # Levantar Sage completo con Docker\n'
        '  cp .env.example .env          # añadir OPENAI_API_KEY\n'
        '  docker compose up --build\n'
        '  # Backend  →  http://localhost:8504\n'
        '  # Frontend →  http://localhost:5174'
    )
    pdf.body(
        'El volumen sage_chroma persiste ChromaDB entre reinicios. Los CSVs se montan '
        'como volumen de solo lectura desde el repositorio hermano TUI-Smart-Destination-Recommender.'
    )


def _ch7_evaluation(pdf):
    pdf.add_page()
    pdf.h1('7', 'Evaluación y Resultados')

    pdf.h2('7.1', 'Métricas de Evaluación')
    pdf.body(
        'La evaluación del sistema se estructura en tres dimensiones: calidad de recuperación, '
        'satisfacción de usuario y rendimiento del sistema.'
    )
    pdf.table_head(['Métrica', 'Descripción', 'Objetivo'], [50, 90, 20])
    metrics = [
        ('Relevance Score (media)', 'Puntuación coseno media de documentos recuperados', '>0,70'),
        ('Source Coverage', '% de respuestas con ≥1 documento fuente recuperado', '>95 %'),
        ('Feedback Positivo', 'Tasa de thumbs-up sobre total de votos enviados', '>75 %'),
        ('Latencia P50', 'Tiempo hasta primer token (percentil 50)', '<1,5 s'),
        ('Latencia P95', 'Tiempo hasta primer token (percentil 95)', '<3,0 s'),
        ('KB Build Time', 'Tiempo de construcción de la base de conocimiento', '<45 s'),
    ]
    for i, r in enumerate(metrics):
        pdf.table_row(r, [50, 90, 20], alt=(i % 2 == 1))
    pdf.ln(4)

    pdf.h2('7.2', 'Ventajas de la Recuperación Híbrida')
    pdf.body(
        'La recuperación híbrida (BM25 + ChromaDB + RRF) supera a cada sistema por separado '
        'en los casos de uso más frecuentes en turismo:'
    )
    pdf.table_head(['Tipo de consulta', 'Solo semántica', 'Solo BM25', 'Híbrido (RRF)'], [60, 35, 35, 30])
    comp_rows = [
        ('Consulta conceptual ("sostenibilidad")', 'Alta', 'Media', 'Alta'),
        ('Nombre exacto ("Picos de Europa")', 'Media', 'Alta', 'Alta'),
        ('Código de destino ("D019")', 'Baja', 'Alta', 'Alta'),
        ('Mes en español ("agosto")', 'Media', 'Alta', 'Alta'),
        ('Paráfrasis ("menos saturado")', 'Alta', 'Baja', 'Alta'),
    ]
    for i, r in enumerate(comp_rows):
        pdf.table_row(r, [60, 35, 35, 30], alt=(i % 2 == 1))
    pdf.ln(4)

    pdf.h2('7.3', 'Reglas de Negocio Horizon en Sage')
    pdf.body(
        'Sage integra las reglas de negocio del motor Horizon directamente en los documentos '
        'de la base de conocimiento, permitiendo respuestas precisas sobre bonificaciones '
        'y penalizaciones sin acceder a la API de Horizon:'
    )
    pdf.table_head(['Condición', 'Efecto', 'Destinos Afectados'], [70, 45, 45])
    rules = [
        ('Sostenibilidad >= 85', '+5 % bonus', 'Picos de Europa, Sierra Nevada'),
        ('Sostenibilidad < 50', '-10 % penalización', 'Varios urbanos de alta presión'),
        ('Congestión media < 40', '+5 % bonus baja saturación', 'D019, D020, Menorca'),
        ('Congestión mes > 80', '-10 % penalización redistribución', 'Barcelona (jul-ago)'),
    ]
    for i, r in enumerate(rules):
        pdf.table_row(r, [70, 45, 45], alt=(i % 2 == 1))
    pdf.ln(4)

    pdf.h2('7.4', 'Comparación con el Proyecto de Referencia (Grupo 4)')
    pdf.body(
        'El Grupo 4 implementó un sistema con FAISS + text-embedding-3-small y redes '
        'neuronales multitarea. La siguiente tabla compara los enfoques técnicos clave:'
    )
    pdf.table_head(['Dimensión', 'Grupo 4', 'Sage (Reto 5)'], [45, 67, 48])
    diff_rows = [
        ('Vector store', 'FAISS (IndexFlatIP)', 'ChromaDB (persistente)'),
        ('Embeddings', 'text-embedding-3-small', 'all-MiniLM-L6-v2 (local)'),
        ('Keyword search', 'No implementado', 'BM25Okapi + RRF'),
        ('Interfaz', 'Streamlit', 'React 19 + MUI v6'),
        ('Bilingüe', 'No', 'Sí (ES/EN, build-time)'),
        ('Modo oscuro', 'No', 'Sí (localStorage)'),
        ('Streaming', 'No', 'SSE token a token'),
        ('Docker', 'Sí', 'Sí'),
        ('Predicción ML', 'Red neuronal multitarea', 'No (fuera de alcance)'),
    ]
    for i, r in enumerate(diff_rows):
        pdf.table_row(r, [45, 67, 48], alt=(i % 2 == 1))
    pdf.ln(3)


def _ch8_conclusions(pdf):
    pdf.add_page()
    pdf.h1('8', 'Conclusiones y Trabajo Futuro')

    pdf.h2('8.1', 'Conclusiones')
    pdf.body(
        'Sage demuestra que un pipeline RAG bien diseñado puede superar las limitaciones '
        'de los LLM generalistas para dominios especializados, sin necesidad de fine-tuning '
        'ni de redes neuronales propietarias. La combinación de recuperación híbrida '
        '(BM25 + ChromaDB + RRF), base de conocimiento bilingüe construida en tiempo de '
        'indexación, y streaming SSE produce un sistema conversacional de alta calidad, '
        'completamente anclado en datos factuales y capaz de mantener coherencia en '
        'conversaciones multi-turno.'
    )
    pdf.body(
        'Como capa de integración de la suite TUI Care Foundation, Sage democratiza el '
        'acceso a los datos generados por los cuatro proyectos anteriores. Cualquier '
        'stakeholder puede ahora interrogar 20 destinos, sus métricas de sostenibilidad '
        'y las reglas de Horizon simplemente formulando preguntas en lenguaje natural.'
    )

    pdf.h2('8.2', 'Contribuciones Académicas')
    for c in [
        'Implementación completa de RAG con recuperación híbrida BM25 + semántica + RRF en Python.',
        'Diseño de base de conocimiento bilingüe build-time que elimina overhead de traducción en runtime.',
        'Bridge sync→async para streaming SSE de LLM en FastAPI mediante asyncio.Queue + ThreadPoolExecutor.',
        'Reescritura LLM de consultas de seguimiento para coherencia multi-turno sin sesión explícita.',
        'Sistema full-stack con dark mode, i18n ES/EN, y feedback logging — desde CSV hasta React en tiempo real.',
    ]:
        pdf.bullet(c)
    pdf.ln(3)

    pdf.h2('8.3', 'Trabajo Futuro')
    future = [
        ('Re-ranking con cross-encoder', 'Modelo ms-marco-MiniLM como segundo paso de re-ranking para mayor precisión.'),
        ('Chunking semántico', 'Dividir documentos largos en chunks más pequeños para recuperación más granular.'),
        ('Integración de reseñas', 'Incorporar sentimiento de reseñas (similar al análisis RoBERTa del Grupo 4) en los documentos RAG.'),
        ('Datos meteorológicos', 'Añadir información de clima por mes/destino para responder preguntas de mejor época para visitar.'),
        ('Evaluación automatizada', 'Implementar RAGAs o RAGAS para evaluación continua de la calidad del pipeline.'),
        ('Integración en tiempo real', 'Conectar con la API de Horizon para datos de congestión en tiempo real.'),
    ]
    pdf.table_head(['Mejora', 'Descripción'], [55, 105])
    for i, r in enumerate(future):
        pdf.table_row(r, [55, 105], alt=(i % 2 == 1))
    pdf.ln(4)


def _references(pdf):
    pdf.add_page()
    pdf.h1('Ref.', 'Referencias')

    refs = [
        ('Lewis et al. (2020)', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 2020.'),
        ('Robertson & Zaragoza (2009)', 'The Probabilistic Relevance Framework: BM25 and Beyond. Foundations and Trends in IR, 3(4).'),
        ('Cormack et al. (2009)', 'Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods. SIGIR 2009.'),
        ('OpenAI (2024)', 'GPT-4o-mini Technical Report. OpenAI, San Francisco.'),
        ('Reimers & Gurevych (2019)', 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. EMNLP 2019.'),
        ('INE (2024)', 'Encuesta de Ocupación Hotelera (EOH). Tabla 49371. Instituto Nacional de Estadística.'),
        ('FRONTUR (2024)', 'Estadística de Movimientos Turísticos en Fronteras. Tabla 23988. INE/Turespaña.'),
        ('MUI (2024)', 'Material UI v6 Documentation. mui.com/material-ui/.'),
        ('FastAPI (2024)', 'FastAPI Documentation. fastapi.tiangolo.com.'),
        ('ChromaDB (2024)', 'Chroma Vector Database Documentation. trychroma.com.'),
        ('Lim & Altintas (2023)', 'BM25 vs. Semantic Search: A Practical Comparison. arXiv:2305.11104.'),
        ('Eurostat (2024)', 'Tourism Statistics — International Tourist Arrivals. ec.europa.eu/eurostat.'),
    ]
    for ref, text in refs:
        pdf.set_font('Arial', 'B', 10)
        pdf.set_text_color(*DARK)
        pdf.cell(0, 6, ref, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Arial', '', 10)
        pdf.set_text_color(*GREY)
        pdf.multi_cell(0, 5.5, text)
        pdf.set_text_color(0, 0, 0)
        pdf.ln(2)


def _tech_stack_appendix(pdf):
    pdf.add_page()
    pdf.h1('Anx.', 'Anexo: Stack Tecnológico Completo')

    pdf.h2('A.1', 'Backend')
    pdf.table_head(['Tecnología', 'Versión', 'Propósito'], [55, 30, 75])
    be = [
        ('Python', '3.11+', 'Lenguaje principal del backend'),
        ('FastAPI', '≥ 0.115.0', 'Framework API REST y SSE'),
        ('uvicorn', '≥ 0.30.0', 'Servidor ASGI'),
        ('sse-starlette', '≥ 2.1.0', 'Server-Sent Events para streaming'),
        ('ChromaDB', '≥ 0.5.0', 'Base de datos vectorial persistente'),
        ('all-MiniLM-L6-v2', '(vía ChromaDB)', 'Modelo de embeddings (~80 MB)'),
        ('rank-bm25', '≥ 0.2.2', 'Índice BM25Okapi para búsqueda léxica'),
        ('openai SDK', '≥ 1.30.0', 'Cliente API compatible OpenAI'),
        ('pandas', '≥ 2.2.0', 'Carga y procesamiento de CSVs'),
    ]
    for i, r in enumerate(be):
        pdf.table_row(r, [55, 30, 75], alt=(i % 2 == 1))
    pdf.ln(5)

    pdf.h2('A.2', 'Frontend')
    pdf.table_head(['Tecnología', 'Versión', 'Propósito'], [55, 30, 75])
    fe = [
        ('React', '19.2.7', 'Framework UI'),
        ('TypeScript', '6.0.2', 'Tipado estático'),
        ('Vite', '8.1.0', 'Bundler y servidor de desarrollo'),
        ('MUI', '6.4.8', 'Biblioteca de componentes UI'),
        ('framer-motion', '12.12.1', 'Animaciones'),
        ('nginx', 'alpine', 'Servidor de archivos estáticos (Docker)'),
    ]
    for i, r in enumerate(fe):
        pdf.table_row(r, [55, 30, 75], alt=(i % 2 == 1))
    pdf.ln(5)

    pdf.h2('A.3', 'Endpoints de la API')
    pdf.table_head(['Método', 'Ruta', 'Descripción'], [20, 40, 100])
    endpoints = [
        ('GET', '/health', 'Liveness check — {"status": "ok"}'),
        ('GET', '/status', 'Estado de la KB, contador de documentos, API key'),
        ('POST', '/ask', 'Respuesta no-streaming completa'),
        ('POST', '/ask/stream', 'Respuesta streaming via SSE (token a token)'),
        ('POST', '/feedback', 'Log thumbs-up/down a data/feedback.jsonl'),
        ('POST', '/rebuild', 'Reconstrucción forzada de la base de conocimiento'),
    ]
    for i, r in enumerate(endpoints):
        pdf.table_row(r, [20, 40, 100], alt=(i % 2 == 1))
    pdf.ln(5)

    pdf.h2('A.4', 'Suite TUI Care Foundation — Contexto Global')
    pdf.table_head(['Reto', 'Proyecto', 'Nombre', 'Rol', 'Puerto'], [12, 55, 25, 48, 20])
    suite = [
        ('1', 'TUI-Sentinel', 'Sentinel', 'Monitorización sentimiento', '8502'),
        ('2', 'TUI-Smart-Destination-Recommender', 'Horizon', 'Motor recomendación', '8000/5173'),
        ('3', 'TUI-Atlas', 'Atlas', 'Dashboard geoespacial', '8501'),
        ('4', 'TUI-Pathfinder', 'Pathfinder', 'Movilidad sostenible', '8503'),
        ('5 *', 'TUI-Sage', 'Sage', 'Asesor RAG lenguaje natural', '8504/5174'),
    ]
    for i, r in enumerate(suite):
        pdf.table_row(r, [12, 55, 25, 48, 20], alt=(i % 2 == 1), bold_first=(i == 4))
    pdf.ln(3)
    pdf.set_font('Arial', 'I', 9)
    pdf.set_text_color(*GREY)
    pdf.cell(0, 6, '* Este documento describe el Reto 5 (Sage)', new_x=XPos.LMARGIN, new_y=YPos.NEXT)


def main():
    pdf = SagePDF()
    pdf.set_title('Sage: Asesor de Destinos Turísticos Basado en RAG')
    pdf.set_author('TUI Care Foundation Future Shapers Spain — UCM TFM 2026')
    pdf.set_subject('RAG Pipeline, Hybrid Retrieval, LLM Streaming, React SPA')
    pdf.set_creator('Sage Project — TUI Care Foundation')

    _cover(pdf)
    _abstract(pdf)
    _ch1_intro(pdf)
    _ch2_state_of_art(pdf)
    _ch3_dataset(pdf)
    _ch4_architecture(pdf)
    _ch5_rag(pdf)
    _ch6_frontend_docker(pdf)
    _ch7_evaluation(pdf)
    _ch8_conclusions(pdf)
    _references(pdf)
    _tech_stack_appendix(pdf)

    out = 'docs/TUI_Sage_Reto5_TFM.pdf'
    pdf.output(out)
    print(f'PDF generado: {out}  ({pdf.page_no()} páginas)')


if __name__ == '__main__':
    main()
