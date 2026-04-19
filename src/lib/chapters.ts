/**
 * Mapeo global consistente de IDs técnicos a nombres de capítulos.
 * Usado en Activacion, Dashboard, Sidebar y AdminConsole.
 * 
 * ⚠️ IMPORTANTE: "I · Disposiciones Generales" está desbloqueado por defecto
 * para TODOS los usuarios sin necesidad de código de activación.
 */
export const CHAPTER_MAP: Record<string, string> = {
  "cap-1": "I · Disposiciones Generales",
  "cap-2": "II · Osteomuscular",
  "cap-3": "III · Nervioso",
  "cap-4": "IV · Cardiovascular",
  "cap-5": "V · Respiratorio",
  "cap-6": "VI · Digestivo",
  "cap-7": "VII · Urinario",
  "cap-8": "VIII · Reproductivo",
  "cap-9": "IX · Piel y Anexos",
  "cap-10": "X · Visual",
  "cap-11": "XI · Auditivo",
  "cap-12": "XII · Endocrino",
};

/**
 * Convierte un ID técnico (cap-1) a su nombre amigable.
 * Ej: "cap-7" -> "VII · Urinario"
 */
export const getChapterName = (chapterId: string): string => {
  return CHAPTER_MAP[chapterId] || chapterId;
};

/**
 * Limpia array de capítulos: elimina duplicados y valores vacíos.
 */
export const cleanChapters = (chapters: string[]): string[] => {
  return Array.from(new Set(chapters)).filter(ch => ch && ch.length > 0);
};

/**
 * Obtiene la lista de capítulos disponibles en formato de opciones (id, label).
 * Usado en AdminConsole y formularios de selección.
 */
export const getChapterOptions = () => {
  return Object.entries(CHAPTER_MAP).map(([id, label]) => ({
    id,
    label,
  }));
};

/**
 * Verifica si un capítulo está desbloqueado para un usuario.
 * El primer capítulo ("I · Disposiciones Generales") siempre está desbloqueado.
 */
export const isChapterUnlocked = (chapterId: string, unlockedChapters: string[]): boolean => {
  // El primer capítulo siempre está desbloqueado
  if (chapterId === "cap-1") {
    return true;
  }
  return unlockedChapters.includes(chapterId);
};
