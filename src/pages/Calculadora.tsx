import { useState } from "react";
import { Plus, Trash2, Calculator, RefreshCw, ArrowDownAZ, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { toast } from "sonner";

interface Deficiency {
  id: number;
  label: string;
  value: string;
}

let nextId = 1;

export default function Calculadora() {
  const { chapterResults, combinedValue, clearAll, removeChapterResult } = useDeficiency();
  const [manualDefs, setManualDefs] = useState<Deficiency[]>([
    { id: nextId++, label: "Deficiencia 1", value: "" },
    { id: nextId++, label: "Deficiencia 2", value: "" },
  ]);
  const [manualResult, setManualResult] = useState<number | null>(null);

  const addDeficiency = () => {
    setManualDefs((prev) => [
      ...prev,
      { id: nextId++, label: `Deficiencia ${prev.length + 1}`, value: "" },
    ]);
  };

  const removeDeficiency = (id: number) => {
    if (manualDefs.length <= 2) {
      toast.error("Se requieren al menos 2 deficiencias");
      return;
    }
    const updated = manualDefs.filter((d) => d.id !== id);
    setManualDefs(updated);
    recalculate(updated);
  };

  const updateValue = (id: number, value: string) => {
    const updated = manualDefs.map((d) => (d.id === id ? { ...d, value } : d));
    setManualDefs(updated);
    recalculate(updated);
  };

  const recalculate = (defs: Deficiency[]) => {
    const values = defs.map((d) => parseFloat(d.value));
    if (values.some((v) => isNaN(v))) { setManualResult(null); return; }
    if (values.some((v) => v < 0 || v > 100)) { setManualResult(null); return; }
    // Sort descending per Decreto 1507
    values.sort((a, b) => b - a);
    const decimals = values.map((v) => v / 100);
    let combined = decimals[0];
    for (let i = 1; i < decimals.length; i++) {
      combined = combined + decimals[i] * (1 - combined);
    }
    setManualResult(Math.round(combined * 10000) / 100);
  };

  const calculate = () => {
    const values = manualDefs.map((d) => parseFloat(d.value));
    if (values.some((v) => isNaN(v))) {
      toast.error("Todos los campos deben tener un valor numérico");
      return;
    }
    if (values.some((v) => v < 0 || v > 100)) {
      toast.error("Los valores deben estar entre 0 y 100");
      return;
    }
    recalculate(manualDefs);
    toast.success("Cálculo completado");
  };

  const reset = () => {
    nextId = 1;
    setManualDefs([
      { id: nextId++, label: "Deficiencia 1", value: "" },
      { id: nextId++, label: "Deficiencia 2", value: "" },
    ]);
    setManualResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Calculadora Central</h1>
        <p className="text-muted-foreground mt-1">Valores combinados — Decreto 1507 de 2014</p>
      </div>

      {/* Global chapter results */}
      {chapterResults.length > 0 && (
        <div className="bento-item border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowDownAZ className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Deficiencias por Capítulo (automático)</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { clearAll(); toast.success("Resultados de capítulos eliminados"); }} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-1" /> Borrar todo
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {[...chapterResults].sort((a, b) => b.value - a.value).map((r) => (
              <div key={r.chapterId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                <span className="text-sm text-foreground">{r.chapterName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{r.value}%</span>
                  <button onClick={() => { removeChapterResult(r.chapterId); toast.success(`${r.chapterName} eliminado`); }} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl gradient-cobalt text-primary-foreground">
            <span className="font-medium text-sm">Deficiencia Integral Combinada</span>
            <span className="text-2xl font-bold">{combinedValue?.toFixed(2)}%</span>
          </div>
        </div>
      )}

      {/* Manual calculator */}
      <div className="bento-item">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Calculadora Manual</h3>
        </div>
        <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong>Fórmula:</strong> Los valores se ordenan de mayor a menor y se combinan: A + B × (1 − A). Precisión: 2 decimales.
          </p>
        </div>

        <div className="space-y-3">
          {manualDefs.map((def, idx) => (
            <div key={def.id} className="flex items-center gap-3 animate-scale-in">
              <div className="w-8 h-8 rounded-lg gradient-cobalt flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.01}
                placeholder="% deficiencia"
                value={def.value}
                onChange={(e) => updateValue(def.id, e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">%</span>
              <button
                onClick={() => removeDeficiency(def.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={addDeficiency} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
          <Button variant="outline" onClick={reset}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-3 mt-4">
          <Button onClick={calculate} className="flex-1 btn-crimson h-12 text-base font-semibold">
            <Calculator className="w-5 h-5 mr-2" />
            Calcular Valor Combinado
          </Button>
          {manualResult !== null && (
            <Button variant="outline" onClick={reset} className="h-12 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {manualResult !== null && (
          <div className="text-center mt-6 animate-scale-in">
            <p className="text-sm text-muted-foreground mb-1">Valor Combinado</p>
            <p className="text-5xl font-bold text-gradient-crimson">{manualResult.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              {manualDefs.length} deficiencias • Ordenadas de mayor a menor
            </p>
            <Button variant="ghost" size="sm" onClick={reset} className="mt-2 text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5 mr-1" />Borrar cálculo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
