import { useDeficiency } from "@/contexts/DeficiencyContext";
import { getChapterName } from "@/lib/chapters";
import { BarChart3, FileDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reportes() {
  const { chapterResults, combinedValue, clearAll } = useDeficiency();

  const sorted = [...chapterResults].sort((a, b) => b.value - a.value);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pantalla de Liquidación</h1>
        <p className="text-muted-foreground mt-1">Resumen final de la calificación PCL</p>
      </div>

      {/* Result circle */}
      <div className="flex flex-col items-center gap-4">
        <div className="result-circle">
          <div className="text-center">
            <p className="text-4xl font-bold text-destructive-foreground">
              {combinedValue !== null ? combinedValue.toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-destructive-foreground/80 uppercase tracking-wider mt-1">% Deficiencia</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Deficiencia Integral — Decreto 1507</p>
      </div>

      {/* Breakdown */}
      {sorted.length > 0 ? (
        <div className="bento-item space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Desglose por Capítulo
          </h3>
          <div className="space-y-2">
            {sorted.map((r, idx) => (
              <div key={r.chapterId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="w-7 h-7 rounded-lg gradient-cobalt flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.chapterName}</p>
                  <p className="text-xs text-muted-foreground">{r.chapterName ?? getChapterName(r.chapterId)}</p>
                </div>
                <span className="text-lg font-bold text-primary">{r.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl gradient-crimson text-destructive-foreground mt-4">
            <span className="font-semibold">Total Deficiencia Integral</span>
            <span className="text-3xl font-bold">{combinedValue?.toFixed(2)}%</span>
          </div>
        </div>
      ) : (
        <div className="bento-item text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Sin calificaciones aún</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Completa la evaluación de capítulos para ver el resumen de liquidación.
          </p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={clearAll} className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Todo
          </Button>
        </div>
      )}
    </div>
  );
}
