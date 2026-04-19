import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronRight, ArrowRight, FileText, Table, Info } from "lucide-react";
import { allChapters, ChapterData, EvaluationTable } from "@/data/chapterData";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { Button } from "@/components/ui/button";

export default function NuevaCalificacion() {
  const navigate = useNavigate();
  const { unlockedChapters } = useUnlockedChapters();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const isUnlocked = (chapterId: string) => unlockedChapters.includes(chapterId);

  const toggleChapter = (id: string) => setExpandedChapter(expandedChapter === id ? null : id);
  const toggleTable = (id: string) => setExpandedTable(expandedTable === id ? null : id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-cobalt flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nueva Calificación</h1>
          <p className="text-muted-foreground mt-0.5">Diccionario de capítulos — Decreto 1507 de 2014</p>
        </div>
      </div>

      <div className="bento-item border-primary/10">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Explore cada capítulo del Decreto 1507. Haga clic en un capítulo para ver sus tablas de calificación,
            condiciones evaluables y rangos de deficiencia por clase funcional (I–IV). Desde aquí puede iniciar una evaluación directa.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {allChapters.map((chapter, idx) => {
          const unlocked = isUnlocked(chapter.id);
          const isExpanded = expandedChapter === chapter.id;

          return (
            <div key={chapter.id} className="bento-item overflow-hidden">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg gradient-cobalt flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{chapter.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{chapter.description}</p>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-foreground">{chapter.description}</p>
                    {chapter.tables.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Este capítulo no contiene tablas de calificación directa.</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Tablas disponibles:</strong> {chapter.tables.length} | <strong>Norma:</strong> Decreto 1507 de 2014, Capítulo {idx + 1}
                    </p>
                  </div>

                  {chapter.tables.map((table) => (
                    <TableAccordion
                      key={table.id}
                      table={table}
                      isExpanded={expandedTable === table.id}
                      onToggle={() => toggleTable(table.id)}
                    />
                  ))}

                  {unlocked && chapter.tables.length > 0 && (
                    <Button
                      onClick={() => navigate(`/capitulo/${chapter.id}`)}
                      className="w-full btn-crimson"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Iniciar Evaluación — {chapter.name}
                    </Button>
                  )}

                  {!unlocked && chapter.tables.length > 0 && (
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        🔒 Módulo bloqueado. Ingrese un código de activación para evaluar.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TableAccordion({ table, isExpanded, onToggle }: { table: EvaluationTable; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-2 p-3 hover:bg-muted/30 transition-colors text-left">
        <Table className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{table.title}</p>
          <p className="text-xs text-muted-foreground">{table.description}</p>
        </div>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {isExpanded && (
        <div className="border-t border-border overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-primary/5">
                <th className="text-left p-2 font-semibold text-foreground">Condición</th>
                <th className="text-center p-2 font-semibold text-foreground w-16">Clase I</th>
                <th className="text-center p-2 font-semibold text-foreground w-16">Clase II</th>
                <th className="text-center p-2 font-semibold text-foreground w-16">Clase III</th>
                <th className="text-center p-2 font-semibold text-foreground w-16">Clase IV</th>
                {table.rows.some(r => r.class5 !== undefined) && (
                  <th className="text-center p-2 font-semibold text-foreground w-16">Clase V</th>
                )}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={row.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="p-2 text-foreground">{row.condition}</td>
                  <td className="text-center p-2 text-muted-foreground">{row.class1}%</td>
                  <td className="text-center p-2 text-muted-foreground">{row.class2}%</td>
                  <td className="text-center p-2 text-muted-foreground">{row.class3}%</td>
                  <td className="text-center p-2 font-semibold text-destructive">{row.class4}%</td>
                  {row.class5 !== undefined && (
                    <td className="text-center p-2 font-semibold text-destructive">{row.class5}%</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
