import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Info, Save, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { getChapterById, type EvaluationTable, type EvaluationRow } from "@/data/chapterData";
import { toast } from "sonner";

type Selection = Record<string, { rowId: string; classLevel: number; value: number }>;

function ClassButton({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      <span className="block text-[10px] opacity-70">{label}</span>
      <span className="block text-sm">{value}%</span>
    </button>
  );
}

function EvalTableCard({
  table,
  selections,
  onSelect,
}: {
  table: EvaluationTable;
  selections: Selection;
  onSelect: (tableId: string, rowId: string, classLevel: number, value: number) => void;
}) {
  return (
    <Card className="glass-card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold">{table.title}</CardTitle>
        <CardDescription className="text-xs">{table.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {table.rows.map((row) => {
          const sel = selections[`${table.id}-${row.id}`];
          const classes = [
            { label: "Clase I", value: row.class1 },
            { label: "Clase II", value: row.class2 },
            { label: "Clase III", value: row.class3 },
            { label: "Clase IV", value: row.class4 },
            ...(row.class5 !== undefined ? [{ label: "Clase V", value: row.class5 }] : []),
          ];
          return (
            <div key={row.id} className="p-3 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-foreground mb-2">{row.condition}</p>
              <div className="flex flex-wrap gap-2">
                {classes.map((cl) => (
                  <ClassButton
                    key={cl.label}
                    label={cl.label}
                    value={cl.value}
                    selected={sel?.classLevel === classes.indexOf(cl) + 1}
                    onClick={() => onSelect(table.id, row.id, classes.indexOf(cl) + 1, cl.value)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function ChapterEvaluation() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const chapter = chapterId ? getChapterById(chapterId) : undefined;
  const { unlockedChapters, loading } = useUnlockedChapters();
  const { setChapterResult, chapterResults } = useDeficiency();
  const [selections, setSelections] = useState<Selection>({});

  const isUnlocked = chapterId ? unlockedChapters.includes(chapterId) : false;
  const existingResult = chapterResults.find((r) => r.chapterId === chapterId);

  const handleSelect = (tableId: string, rowId: string, classLevel: number, value: number) => {
    setSelections((prev) => {
      const key = `${tableId}-${rowId}`;
      // Toggle off if same
      if (prev[key]?.classLevel === classLevel) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { rowId, classLevel, value } };
    });
  };

  // Combined value of all selected items in this chapter
  const chapterTotal = useMemo(() => {
    const values = Object.values(selections).map((s) => s.value);
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => b - a);
    const decimals = sorted.map((v) => v / 100);
    let combined = decimals[0];
    for (let i = 1; i < decimals.length; i++) {
      combined = combined + decimals[i] * (1 - combined);
    }
    return Math.round(combined * 10000) / 100;
  }, [selections]);

  const handleSave = () => {
    if (chapterTotal === null || !chapter) return;
    setChapterResult({
      chapterId: chapter.id,
      chapterName: chapter.name,
      value: chapterTotal,
    });
    toast.success(`${chapter.name}: ${chapterTotal}% registrado en la calculadora central`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in text-center py-20">
        <p className="text-muted-foreground">Capítulo no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <Info className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Módulo Bloqueado</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Necesitas un código de activación para acceder a <strong>{chapter.name}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>
          <Button onClick={() => navigate("/activacion")} className="btn-crimson">
            Activar Módulo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{chapter.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
        </div>
        {existingResult && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-bold text-success">{existingResult.value}%</span>
          </div>
        )}
      </div>

      {chapter.tables.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Este capítulo contiene disposiciones generales sin tablas de calificación directas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Info Banner */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Seleccione la clase funcional correspondiente para cada condición evaluada.
              Los valores se combinan automáticamente con la fórmula de Baltazar.
            </p>
          </div>

          {/* Tables */}
          <div className="space-y-4">
            {chapter.tables.map((table) => (
              <EvalTableCard
                key={table.id}
                table={table}
                selections={selections}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* Result + Save */}
          {chapterTotal !== null && (
            <div className="sticky bottom-4 z-10">
              <div className="glass-card p-4 flex items-center justify-between gap-4 border-primary/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deficiencia combinada del capítulo</p>
                    <p className="text-2xl font-bold text-gradient-crimson">{chapterTotal.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{Object.keys(selections).length} ítem(s)</span>
                </div>
                <Button onClick={handleSave} className="btn-crimson h-11 px-6">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar en Calculadora
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
