import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface ChapterResult {
  chapterId: string;
  chapterName: string;
  value: number; // percentage 0-100
}

interface DeficiencyContextType {
  chapterResults: ChapterResult[];
  setChapterResult: (result: ChapterResult) => void;
  removeChapterResult: (chapterId: string) => void;
  clearAll: () => void;
  combinedValue: number | null;
}

const DeficiencyContext = createContext<DeficiencyContextType>({
  chapterResults: [],
  setChapterResult: () => {},
  removeChapterResult: () => {},
  clearAll: () => {},
  combinedValue: null,
});

export const useDeficiency = () => useContext(DeficiencyContext);

function calculateCombined(results: ChapterResult[]): number | null {
  if (results.length === 0) return null;
  // Sort descending per Decreto 1507
  const sorted = [...results].sort((a, b) => b.value - a.value);
  const decimals = sorted.map((r) => r.value / 100);
  let combined = decimals[0];
  for (let i = 1; i < decimals.length; i++) {
    combined = combined + decimals[i] * (1 - combined);
  }
  return Math.round(combined * 10000) / 100;
}

export function DeficiencyProvider({ children }: { children: ReactNode }) {
  const [chapterResults, setChapterResults] = useState<ChapterResult[]>([]);

  const setChapterResult = useCallback((result: ChapterResult) => {
    setChapterResults((prev) => {
      const filtered = prev.filter((r) => r.chapterId !== result.chapterId);
      return [...filtered, result];
    });
  }, []);

  const removeChapterResult = useCallback((chapterId: string) => {
    setChapterResults((prev) => prev.filter((r) => r.chapterId !== chapterId));
  }, []);

  const clearAll = useCallback(() => setChapterResults([]), []);

  const combinedValue = calculateCombined(chapterResults);

  return (
    <DeficiencyContext.Provider value={{ chapterResults, setChapterResult, removeChapterResult, clearAll, combinedValue }}>
      {children}
    </DeficiencyContext.Provider>
  );
}
