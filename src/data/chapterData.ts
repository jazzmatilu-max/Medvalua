export interface EvaluationRow {
  id: string;
  condition: string;
  class1: number;
  class2: number;
  class3: number;
  class4: number;
  class5?: number;
}

export interface EvaluationTable {
  id: string;
  title: string;
  description: string;
  rows: EvaluationRow[];
}

export interface ChapterData {
  id: string;
  name: string;
  description: string;
  tables: EvaluationTable[];
}

// Cap I - Disposiciones Generales
const cap1: ChapterData = {
  id: "cap-1",
  name: "Disposiciones Generales",
  description: "Marco normativo, principios generales y metodología de calificación del Decreto 1507 de 2014.",
  tables: [
    {
      id: "t1-1",
      title: "Tabla 1.1 — Clases de Deficiencia (Escala General)",
      description: "Clasificación general de deficiencias según el porcentaje de pérdida de capacidad laboral. Referencia para todos los capítulos.",
      rows: [
        { id: "r1", condition: "Clase I — Deficiencia mínima (0–5%)", class1: 0, class2: 1, class3: 2, class4: 5 },
        { id: "r2", condition: "Clase II — Deficiencia leve (6–15%)", class1: 6, class2: 8, class3: 11, class4: 15 },
        { id: "r3", condition: "Clase III — Deficiencia moderada (16–25%)", class1: 16, class2: 18, class3: 21, class4: 25 },
        { id: "r4", condition: "Clase IV — Deficiencia severa (26–50%)", class1: 26, class2: 32, class3: 40, class4: 50 },
        { id: "r5", condition: "Clase V — Deficiencia máxima (>50%)", class1: 51, class2: 60, class3: 70, class4: 75 },
      ],
    },
    {
      id: "t1-2",
      title: "Tabla 1.2 — Factores de Ponderación por Grado de Severidad",
      description: "Factores de ajuste según el grado de severidad dentro de cada clase funcional.",
      rows: [
        { id: "r1", condition: "Grado 0 — Límite inferior de la clase", class1: 0, class2: 0, class3: 0, class4: 0 },
        { id: "r2", condition: "Grado 1 — Leve dentro de la clase", class1: 1, class2: 1, class3: 1, class4: 1 },
        { id: "r3", condition: "Grado 2 — Moderado dentro de la clase", class1: 2, class2: 2, class3: 2, class4: 2 },
        { id: "r4", condition: "Grado 3 — Severo dentro de la clase", class1: 3, class2: 3, class3: 3, class4: 3 },
        { id: "r5", condition: "Grado 4 — Límite superior de la clase", class1: 4, class2: 4, class3: 4, class4: 4 },
      ],
    },
    {
      id: "t1-3",
      title: "Tabla 1.3 — Carga de Adherencia al Tratamiento (CAT)",
      description: "Factores de ajuste según la carga del tratamiento médico que soporta el paciente.",
      rows: [
        { id: "r1", condition: "Sin tratamiento o tratamiento ocasional", class1: 0, class2: 0, class3: 0, class4: 0 },
        { id: "r2", condition: "Tratamiento intermitente (medicamentos periódicos)", class1: 1, class2: 2, class3: 3, class4: 4 },
        { id: "r3", condition: "Tratamiento continuo (medicación diaria)", class1: 2, class2: 3, class3: 5, class4: 7 },
        { id: "r4", condition: "Tratamiento invasivo o complejo (diálisis, oxígeno, etc.)", class1: 3, class2: 5, class3: 7, class4: 10 },
      ],
    },
    {
      id: "t1-4",
      title: "Tabla 1.4 — Carga de Enfermedad (CE)",
      description: "Valoración del impacto de la enfermedad en las actividades de la vida diaria del paciente.",
      rows: [
        { id: "r1", condition: "Sin impacto en AVD (actividades de la vida diaria)", class1: 0, class2: 0, class3: 0, class4: 0 },
        { id: "r2", condition: "Impacto leve — dificultad ocasional en AVD", class1: 1, class2: 2, class3: 3, class4: 4 },
        { id: "r3", condition: "Impacto moderado — requiere ayuda parcial en AVD", class1: 2, class2: 4, class3: 6, class4: 8 },
        { id: "r4", condition: "Impacto severo — dependiente en la mayoría de AVD", class1: 4, class2: 7, class3: 10, class4: 15 },
        { id: "r5", condition: "Impacto total — dependiente en todas las AVD", class1: 6, class2: 10, class3: 15, class4: 20 },
      ],
    },
    {
      id: "t1-5",
      title: "Tabla 1.5 — Criterios Generales de Calificación",
      description: "Resumen de los criterios principales para la asignación de clase y grado de deficiencia.",
      rows: [
        { id: "r1", condition: "Diagnóstico confirmado por especialista", class1: 0, class2: 1, class3: 2, class4: 3 },
        { id: "r2", condition: "Hallazgos clínicos objetivos documentados", class1: 0, class2: 1, class3: 2, class4: 3 },
        { id: "r3", condition: "Resultados de estudios complementarios (imagenología, laboratorio)", class1: 0, class2: 1, class3: 2, class4: 3 },
        { id: "r4", condition: "Impacto funcional en actividades laborales", class1: 0, class2: 1, class3: 2, class4: 3 },
        { id: "r5", condition: "Pronóstico y evolución de la patología", class1: 0, class2: 1, class3: 2, class4: 3 },
      ],
    },
  ],
};

// Cap II - Osteomuscular
const cap2: ChapterData = {
  id: "cap-2",
  name: "Sistema Osteomuscular",
  description: "Deficiencias del sistema músculo-esquelético: columna vertebral, extremidades superiores e inferiores, pelvis.",
  tables: [
    {
      id: "t2-1",
      title: "Tabla 2.1 — Columna Cervical (Arcos de Movimiento)",
      description: "Deficiencia por limitación de arcos de movimiento en columna cervical.",
      rows: [
        { id: "r1", condition: "Flexión / Extensión limitada leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Flexión / Extensión limitada moderada", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r3", condition: "Flexión / Extensión limitada severa", class1: 4, class2: 8, class3: 12, class4: 18 },
        { id: "r4", condition: "Rotación limitada leve", class1: 1, class2: 2, class3: 4, class4: 6 },
        { id: "r5", condition: "Rotación limitada moderada", class1: 2, class2: 4, class3: 6, class4: 10 },
        { id: "r6", condition: "Rotación limitada severa", class1: 3, class2: 6, class3: 10, class4: 15 },
      ],
    },
    {
      id: "t2-2",
      title: "Tabla 2.2 — Columna Lumbar",
      description: "Deficiencia por limitación de arcos de movimiento en columna lumbar.",
      rows: [
        { id: "r1", condition: "Flexión limitada leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Flexión limitada moderada", class1: 3, class2: 5, class3: 8, class4: 13 },
        { id: "r3", condition: "Flexión limitada severa", class1: 5, class2: 8, class3: 13, class4: 20 },
        { id: "r4", condition: "Extensión limitada leve", class1: 1, class2: 2, class3: 4, class4: 6 },
        { id: "r5", condition: "Extensión limitada moderada", class1: 2, class2: 4, class3: 6, class4: 10 },
        { id: "r6", condition: "Extensión limitada severa", class1: 3, class2: 6, class3: 10, class4: 15 },
      ],
    },
    {
      id: "t2-3",
      title: "Tabla 2.3 — Extremidad Superior",
      description: "Deficiencia por limitación funcional en hombro, codo, muñeca y mano.",
      rows: [
        { id: "r1", condition: "Hombro — Limitación leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Hombro — Limitación moderada", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r3", condition: "Hombro — Limitación severa", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r4", condition: "Codo — Limitación leve", class1: 1, class2: 2, class3: 4, class4: 6 },
        { id: "r5", condition: "Codo — Limitación moderada", class1: 2, class2: 4, class3: 7, class4: 10 },
        { id: "r6", condition: "Muñeca/Mano — Limitación leve", class1: 1, class2: 2, class3: 3, class4: 5 },
        { id: "r7", condition: "Muñeca/Mano — Limitación moderada", class1: 2, class2: 4, class3: 6, class4: 9 },
      ],
    },
    {
      id: "t2-4",
      title: "Tabla 2.4 — Extremidad Inferior",
      description: "Deficiencia por limitación funcional en cadera, rodilla, tobillo y pie.",
      rows: [
        { id: "r1", condition: "Cadera — Limitación leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Cadera — Limitación moderada", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r3", condition: "Cadera — Limitación severa", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r4", condition: "Rodilla — Limitación leve", class1: 1, class2: 3, class3: 5, class4: 7 },
        { id: "r5", condition: "Rodilla — Limitación moderada", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r6", condition: "Tobillo/Pie — Limitación leve", class1: 1, class2: 2, class3: 3, class4: 5 },
        { id: "r7", condition: "Tobillo/Pie — Limitación moderada", class1: 2, class2: 4, class3: 6, class4: 9 },
      ],
    },
  ],
};

// Cap III - Nervioso
const cap3: ChapterData = {
  id: "cap-3",
  name: "Sistema Nervioso Central y Periférico",
  description: "Deficiencias del sistema nervioso: cerebro, médula espinal, nervios craneales y periféricos.",
  tables: [
    {
      id: "t3-1",
      title: "Tabla 3.1 — Alteraciones del Estado de Conciencia y Epilepsia",
      description: "Deficiencia por trastornos convulsivos y alteraciones de conciencia.",
      rows: [
        { id: "r1", condition: "Epilepsia controlada con medicación, sin crisis en >1 año", class1: 3, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "Epilepsia con crisis ocasionales (1-4/año) con tratamiento", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r3", condition: "Epilepsia con crisis frecuentes (>4/año) pese a tratamiento", class1: 10, class2: 18, class3: 25, class4: 35 },
        { id: "r4", condition: "Estado post-comatoso con secuelas leves", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r5", condition: "Estado post-comatoso con secuelas moderadas", class1: 15, class2: 25, class3: 35, class4: 50 },
      ],
    },
    {
      id: "t3-2",
      title: "Tabla 3.2 — Trastornos del Movimiento y la Coordinación",
      description: "Deficiencia por alteraciones motoras de origen central.",
      rows: [
        { id: "r1", condition: "Hemiparesia leve — marcha independiente", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r2", condition: "Hemiparesia moderada — requiere ayuda parcial", class1: 10, class2: 20, class3: 30, class4: 40 },
        { id: "r3", condition: "Hemiparesia severa — dependiente para AVD", class1: 20, class2: 35, class3: 50, class4: 65 },
        { id: "r4", condition: "Paraparesia leve", class1: 5, class2: 10, class3: 18, class4: 25 },
        { id: "r5", condition: "Paraparesia moderada", class1: 15, class2: 25, class3: 35, class4: 50 },
        { id: "r6", condition: "Paraparesia severa / Paraplejia", class1: 30, class2: 45, class3: 60, class4: 75 },
        { id: "r7", condition: "Ataxia leve", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r8", condition: "Ataxia moderada-severa", class1: 10, class2: 20, class3: 30, class4: 45 },
      ],
    },
    {
      id: "t3-3",
      title: "Tabla 3.3 — Nervios Craneales",
      description: "Deficiencia por lesiones de nervios craneales.",
      rows: [
        { id: "r1", condition: "Parálisis facial periférica parcial", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Parálisis facial periférica completa", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r3", condition: "Neuralgia del trigémino controlada", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r4", condition: "Neuralgia del trigémino refractaria", class1: 5, class2: 10, class3: 18, class4: 25 },
        { id: "r5", condition: "Alteración de pares bajos (IX-XII) leve", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r6", condition: "Alteración de pares bajos (IX-XII) severa", class1: 8, class2: 15, class3: 22, class4: 30 },
      ],
    },
    {
      id: "t3-4",
      title: "Tabla 3.4 — Neuropatías Periféricas",
      description: "Deficiencia por lesiones de nervios periféricos.",
      rows: [
        { id: "r1", condition: "Neuropatía sensitiva pura leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Neuropatía sensitivo-motora leve", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r3", condition: "Neuropatía sensitivo-motora moderada", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r4", condition: "Neuropatía sensitivo-motora severa", class1: 10, class2: 20, class3: 30, class4: 40 },
        { id: "r5", condition: "Síndrome del túnel del carpo leve", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r6", condition: "Síndrome del túnel del carpo severo post-quirúrgico", class1: 3, class2: 6, class3: 10, class4: 15 },
      ],
    },
    {
      id: "t3-5",
      title: "Tabla 3.5 — Trastornos Cognitivos y del Comportamiento",
      description: "Deficiencia por alteraciones neurocognitivas post-lesión cerebral.",
      rows: [
        { id: "r1", condition: "Déficit cognitivo leve (MMSE 21-25)", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Déficit cognitivo moderado (MMSE 15-20)", class1: 8, class2: 15, class3: 22, class4: 30 },
        { id: "r3", condition: "Déficit cognitivo severo (MMSE <15)", class1: 20, class2: 35, class3: 50, class4: 65 },
        { id: "r4", condition: "Trastorno del comportamiento leve", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r5", condition: "Trastorno del comportamiento moderado", class1: 8, class2: 15, class3: 22, class4: 30 },
        { id: "r6", condition: "Trastorno del comportamiento severo", class1: 15, class2: 25, class3: 40, class4: 55 },
      ],
    },
  ],
};

// Cap IV - Cardiovascular
const cap4: ChapterData = {
  id: "cap-4",
  name: "Sistema Cardiovascular",
  description: "Deficiencias del corazón y grandes vasos: enfermedad coronaria, valvulopatías, arritmias, vasculopatías periféricas.",
  tables: [
    {
      id: "t4-1",
      title: "Tabla 4.1 — Enfermedad Coronaria y Miocardiopatías",
      description: "Clasificación funcional según NYHA y fracción de eyección.",
      rows: [
        { id: "r1", condition: "NYHA I — Asintomático, FEVI >50%", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "NYHA II — Síntomas con actividad ordinaria, FEVI 40-50%", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "NYHA III — Síntomas con actividad menor, FEVI 30-39%", class1: 15, class2: 22, class3: 30, class4: 40 },
        { id: "r4", condition: "NYHA IV — Síntomas en reposo, FEVI <30%", class1: 30, class2: 45, class3: 60, class4: 75 },
        { id: "r5", condition: "Post-infarto sin síntomas residuales, FEVI >50%", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r6", condition: "Miocardiopatía dilatada FEVI 30-40%", class1: 15, class2: 25, class3: 35, class4: 50 },
      ],
    },
    {
      id: "t4-2",
      title: "Tabla 4.2 — Valvulopatías",
      description: "Deficiencia por enfermedad valvular cardíaca.",
      rows: [
        { id: "r1", condition: "Valvulopatía leve, asintomática", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "Valvulopatía moderada, síntomas con esfuerzo", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r3", condition: "Valvulopatía severa, síntomas con mínimo esfuerzo", class1: 15, class2: 25, class3: 35, class4: 50 },
        { id: "r4", condition: "Post-reemplazo valvular con buena función", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r5", condition: "Post-reemplazo valvular con disfunción protésica", class1: 15, class2: 25, class3: 35, class4: 50 },
      ],
    },
    {
      id: "t4-3",
      title: "Tabla 4.3 — Arritmias Cardíacas",
      description: "Deficiencia por trastornos del ritmo cardíaco.",
      rows: [
        { id: "r1", condition: "Arritmia controlada con medicación, sin síncope", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "Arritmia con síncope ocasional pese a tratamiento", class1: 8, class2: 15, class3: 22, class4: 30 },
        { id: "r3", condition: "Portador de marcapasos, buena captura", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r4", condition: "Portador de DAI con descargas infrecuentes", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r5", condition: "Portador de DAI con descargas frecuentes", class1: 10, class2: 20, class3: 28, class4: 38 },
      ],
    },
    {
      id: "t4-4",
      title: "Tabla 4.4 — Enfermedad Vascular Periférica",
      description: "Deficiencia por vasculopatías arteriales y venosas.",
      rows: [
        { id: "r1", condition: "Claudicación intermitente >200m", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Claudicación intermitente 100-200m", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "Claudicación intermitente <100m", class1: 10, class2: 18, class3: 25, class4: 35 },
        { id: "r4", condition: "Dolor en reposo o lesiones tróficas", class1: 20, class2: 30, class3: 40, class4: 55 },
        { id: "r5", condition: "Insuficiencia venosa crónica leve (C2-C3)", class1: 2, class2: 4, class3: 6, class4: 10 },
        { id: "r6", condition: "Insuficiencia venosa crónica severa (C5-C6)", class1: 8, class2: 15, class3: 22, class4: 30 },
        { id: "r7", condition: "Linfedema crónico moderado-severo", class1: 5, class2: 10, class3: 18, class4: 25 },
      ],
    },
    {
      id: "t4-5",
      title: "Tabla 4.5 — Hipertensión Arterial",
      description: "Deficiencia por daño de órgano blanco secundario a HTA.",
      rows: [
        { id: "r1", condition: "HTA controlada, sin daño de órgano blanco", class1: 0, class2: 2, class3: 3, class4: 5 },
        { id: "r2", condition: "HTA con daño de órgano blanco leve", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r3", condition: "HTA con daño de órgano blanco moderado", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r4", condition: "HTA con daño de órgano blanco severo", class1: 10, class2: 18, class3: 28, class4: 40 },
      ],
    },
  ],
};

// Cap V - Respiratorio
const cap5: ChapterData = {
  id: "cap-5",
  name: "Sistema Respiratorio",
  description: "Deficiencias del aparato respiratorio: asma, EPOC, fibrosis, hipertensión pulmonar.",
  tables: [
    {
      id: "t5-1",
      title: "Tabla 5.1 — Asma y Enfermedad Obstructiva",
      description: "Deficiencia según espirometría (FEV1) y requerimiento terapéutico.",
      rows: [
        { id: "r1", condition: "FEV1 >80%, asma leve intermitente", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "FEV1 60-80%, asma persistente moderada", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "FEV1 40-59%, EPOC moderado-severo", class1: 10, class2: 20, class3: 28, class4: 38 },
        { id: "r4", condition: "FEV1 <40%, insuficiencia respiratoria", class1: 25, class2: 38, class3: 50, class4: 65 },
      ],
    },
    {
      id: "t5-2",
      title: "Tabla 5.2 — Enfermedad Restrictiva y Fibrosis",
      description: "Deficiencia por enfermedad pulmonar intersticial y restrictiva.",
      rows: [
        { id: "r1", condition: "CVF >80%, disnea con esfuerzo intenso", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "CVF 60-80%, disnea con esfuerzo moderado", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r3", condition: "CVF 40-59%, disnea con esfuerzo leve", class1: 15, class2: 25, class3: 35, class4: 45 },
        { id: "r4", condition: "CVF <40%, disnea en reposo / O₂ domiciliario", class1: 30, class2: 45, class3: 55, class4: 70 },
      ],
    },
  ],
};

// Cap VI - Digestivo
const cap6: ChapterData = {
  id: "cap-6",
  name: "Sistema Digestivo",
  description: "Deficiencias del aparato digestivo: esófago, estómago, intestino, hígado, páncreas.",
  tables: [
    {
      id: "t6-1",
      title: "Tabla 6.1 — Tracto Gastrointestinal Superior",
      description: "Deficiencia por patología esofágica y gástrica.",
      rows: [
        { id: "r1", condition: "Disfagia leve, dieta modificada", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Disfagia moderada, alimentación semisólida", class1: 5, class2: 10, class3: 18, class4: 25 },
        { id: "r3", condition: "Gastrectomía parcial con buena tolerancia", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r4", condition: "Gastrectomía total o síndrome de dumping", class1: 10, class2: 18, class3: 25, class4: 35 },
      ],
    },
    {
      id: "t6-2",
      title: "Tabla 6.2 — Hígado y Vías Biliares",
      description: "Deficiencia por enfermedad hepática crónica.",
      rows: [
        { id: "r1", condition: "Child-Pugh A — Hepatopatía compensada", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Child-Pugh B — Hepatopatía moderada", class1: 10, class2: 18, class3: 28, class4: 38 },
        { id: "r3", condition: "Child-Pugh C — Hepatopatía severa/cirrosis", class1: 25, class2: 38, class3: 50, class4: 65 },
      ],
    },
  ],
};

// Cap VII - Urinario
const cap7: ChapterData = {
  id: "cap-7",
  name: "Sistema Urinario",
  description: "Deficiencias del aparato urinario: riñón, uréteres, vejiga, uretra.",
  tables: [
    {
      id: "t7-1",
      title: "Tabla 7.1 — Función Renal",
      description: "Deficiencia según tasa de filtración glomerular (TFG).",
      rows: [
        { id: "r1", condition: "TFG 60-89 ml/min (ERC estadio 2)", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "TFG 30-59 ml/min (ERC estadio 3)", class1: 8, class2: 15, class3: 22, class4: 30 },
        { id: "r3", condition: "TFG 15-29 ml/min (ERC estadio 4)", class1: 20, class2: 30, class3: 42, class4: 55 },
        { id: "r4", condition: "TFG <15 ml/min o diálisis (ERC estadio 5)", class1: 35, class2: 50, class3: 60, class4: 75 },
      ],
    },
    {
      id: "t7-2",
      title: "Tabla 7.2 — Vejiga y Vía Urinaria",
      description: "Deficiencia por trastornos de la vejiga.",
      rows: [
        { id: "r1", condition: "Incontinencia leve / urgencia controlada", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Incontinencia moderada", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "Vejiga neurogénica con cateterismo", class1: 10, class2: 18, class3: 28, class4: 38 },
        { id: "r4", condition: "Derivación urinaria permanente", class1: 15, class2: 25, class3: 35, class4: 48 },
      ],
    },
  ],
};

// Cap VIII - Reproductivo
const cap8: ChapterData = {
  id: "cap-8",
  name: "Sistema Reproductivo",
  description: "Deficiencias del sistema reproductivo masculino y femenino.",
  tables: [
    {
      id: "t8-1",
      title: "Tabla 8.1 — Sistema Reproductivo",
      description: "Deficiencia por alteraciones reproductivas.",
      rows: [
        { id: "r1", condition: "Disfunción sexual con tratamiento efectivo", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "Disfunción sexual refractaria a tratamiento", class1: 5, class2: 10, class3: 15, class4: 20 },
        { id: "r3", condition: "Pérdida anatómica parcial de órganos reproductivos", class1: 3, class2: 8, class3: 12, class4: 18 },
        { id: "r4", condition: "Pérdida anatómica completa de órganos reproductivos", class1: 8, class2: 15, class3: 22, class4: 28 },
      ],
    },
  ],
};

// Cap IX - Piel y Anexos
const cap9: ChapterData = {
  id: "cap-9",
  name: "Piel y Anexos",
  description: "Deficiencias por alteraciones cutáneas: cicatrices, quemaduras, dermatitis, úlceras crónicas.",
  tables: [
    {
      id: "t9-1",
      title: "Tabla 9.1 — Dermatitis y Dermatosis Crónicas",
      description: "Deficiencia por enfermedades cutáneas crónicas.",
      rows: [
        { id: "r1", condition: "Dermatitis crónica <10% superficie corporal", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "Dermatitis crónica 10-30% superficie corporal", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r3", condition: "Dermatitis crónica >30% superficie corporal", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r4", condition: "Psoriasis severa refractaria", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r5", condition: "Urticaria crónica severa", class1: 3, class2: 5, class3: 10, class4: 15 },
      ],
    },
    {
      id: "t9-2",
      title: "Tabla 9.2 — Cicatrices y Quemaduras",
      description: "Deficiencia por secuelas cicatriciales y quemaduras.",
      rows: [
        { id: "r1", condition: "Cicatriz no deformante <5% superficie", class1: 1, class2: 2, class3: 3, class4: 5 },
        { id: "r2", condition: "Cicatriz deformante en zona no expuesta", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r3", condition: "Cicatriz deformante en zona expuesta (cara/manos)", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r4", condition: "Quemadura con retracción cicatricial funcional", class1: 8, class2: 15, class3: 22, class4: 32 },
        { id: "r5", condition: "Quemadura extensa >30% con secuelas funcionales", class1: 15, class2: 25, class3: 38, class4: 50 },
      ],
    },
    {
      id: "t9-3",
      title: "Tabla 9.3 — Úlceras Cutáneas Crónicas y Desfiguramiento",
      description: "Deficiencia por úlceras crónicas y desfiguramiento permanente.",
      rows: [
        { id: "r1", condition: "Úlcera crónica pequeña, controlada", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Úlcera crónica extensa, recurrente", class1: 5, class2: 12, class3: 18, class4: 28 },
        { id: "r3", condition: "Desfiguramiento facial leve", class1: 3, class2: 5, class3: 10, class4: 15 },
        { id: "r4", condition: "Desfiguramiento facial moderado-severo", class1: 8, class2: 15, class3: 25, class4: 35 },
        { id: "r5", condition: "Alopecia cicatricial extensa", class1: 2, class2: 5, class3: 8, class4: 12 },
      ],
    },
  ],
};

// Cap X - Visual
const cap10: ChapterData = {
  id: "cap-10",
  name: "Sistema Visual",
  description: "Deficiencias de la visión: agudeza visual, campo visual, visión binocular.",
  tables: [
    {
      id: "t10-1",
      title: "Tabla 10.1 — Agudeza Visual",
      description: "Deficiencia según agudeza visual corregida (mejor ojo / peor ojo).",
      rows: [
        { id: "r1", condition: "AV 20/30 — 20/40 (leve bilateral)", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "AV 20/50 — 20/80 (moderada)", class1: 5, class2: 10, class3: 18, class4: 25 },
        { id: "r3", condition: "AV 20/100 — 20/200 (severa)", class1: 15, class2: 25, class3: 35, class4: 50 },
        { id: "r4", condition: "AV <20/200 o ceguera legal monocular", class1: 20, class2: 30, class3: 42, class4: 55 },
        { id: "r5", condition: "Ceguera bilateral", class1: 40, class2: 55, class3: 70, class4: 85 },
      ],
    },
    {
      id: "t10-2",
      title: "Tabla 10.2 — Campo Visual",
      description: "Deficiencia por pérdida de campo visual.",
      rows: [
        { id: "r1", condition: "Hemianopsia homónima", class1: 10, class2: 18, class3: 25, class4: 35 },
        { id: "r2", condition: "Cuadrantanopsia", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "Escotoma central bilateral", class1: 15, class2: 25, class3: 38, class4: 50 },
        { id: "r4", condition: "Constricción concéntrica (campo <20°)", class1: 20, class2: 32, class3: 45, class4: 60 },
      ],
    },
  ],
};

// Cap XI - Auditivo
const cap11: ChapterData = {
  id: "cap-11",
  name: "Sistema Auditivo",
  description: "Deficiencias de la audición y el equilibrio vestibular.",
  tables: [
    {
      id: "t11-1",
      title: "Tabla 11.1 — Pérdida Auditiva",
      description: "Deficiencia según promedio tonal audiométrico (PTA) bilateral.",
      rows: [
        { id: "r1", condition: "PTA 26-40 dB (hipoacusia leve)", class1: 2, class2: 5, class3: 8, class4: 10 },
        { id: "r2", condition: "PTA 41-55 dB (hipoacusia moderada)", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r3", condition: "PTA 56-70 dB (hipoacusia moderada-severa)", class1: 10, class2: 18, class3: 25, class4: 35 },
        { id: "r4", condition: "PTA 71-90 dB (hipoacusia severa)", class1: 15, class2: 25, class3: 38, class4: 50 },
        { id: "r5", condition: "PTA >90 dB (hipoacusia profunda / cofosis)", class1: 25, class2: 38, class3: 50, class4: 65 },
      ],
    },
    {
      id: "t11-2",
      title: "Tabla 11.2 — Trastornos Vestibulares",
      description: "Deficiencia por alteraciones del equilibrio.",
      rows: [
        { id: "r1", condition: "Vértigo episódico controlado", class1: 2, class2: 5, class3: 8, class4: 12 },
        { id: "r2", condition: "Vértigo frecuente con limitación moderada", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r3", condition: "Inestabilidad permanente, riesgo de caída", class1: 10, class2: 20, class3: 30, class4: 42 },
      ],
    },
  ],
};

// Cap XII - Endocrino
const cap12: ChapterData = {
  id: "cap-12",
  name: "Sistema Endocrino",
  description: "Deficiencias por trastornos endocrinos: tiroides, suprarrenales, páncreas endocrino, hipófisis.",
  tables: [
    {
      id: "t12-1",
      title: "Tabla 12.1 — Diabetes Mellitus",
      description: "Deficiencia según control metabólico y complicaciones.",
      rows: [
        { id: "r1", condition: "DM controlada con dieta/metformina, sin complicaciones", class1: 1, class2: 3, class3: 5, class4: 8 },
        { id: "r2", condition: "DM con insulina, buen control, sin complicaciones", class1: 3, class2: 6, class3: 10, class4: 15 },
        { id: "r3", condition: "DM con complicaciones microvasculares leves", class1: 5, class2: 12, class3: 18, class4: 25 },
        { id: "r4", condition: "DM con complicaciones severas (nefropatía/retinopatía)", class1: 15, class2: 25, class3: 35, class4: 50 },
        { id: "r5", condition: "DM inestable, hipoglucemias severas recurrentes", class1: 20, class2: 30, class3: 42, class4: 55 },
      ],
    },
    {
      id: "t12-2",
      title: "Tabla 12.2 — Trastornos Tiroideos y Otras Endocrinopatías",
      description: "Deficiencia por hipotiroidismo, hipertiroidismo y otras alteraciones endocrinas.",
      rows: [
        { id: "r1", condition: "Hipotiroidismo controlado con levotiroxina", class1: 1, class2: 2, class3: 3, class4: 5 },
        { id: "r2", condition: "Hipotiroidismo con síntomas persistentes", class1: 3, class2: 5, class3: 8, class4: 12 },
        { id: "r3", condition: "Hipertiroidismo refractario", class1: 5, class2: 10, class3: 15, class4: 22 },
        { id: "r4", condition: "Insuficiencia suprarrenal con reemplazo", class1: 3, class2: 8, class3: 12, class4: 18 },
        { id: "r5", condition: "Hipopituitarismo con reemplazo hormonal", class1: 5, class2: 10, class3: 15, class4: 22 },
      ],
    },
  ],
};

export const allChapters: ChapterData[] = [
  cap1, cap2, cap3, cap4, cap5, cap6, cap7, cap8, cap9, cap10, cap11, cap12,
];

export function getChapterById(id: string): ChapterData | undefined {
  return allChapters.find((c) => c.id === id);
}
