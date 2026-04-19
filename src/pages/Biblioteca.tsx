import { useState } from "react";
import { BookOpen, Search, Lock, Unlock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { useDeficiency } from "@/contexts/DeficiencyContext";

const chapters = [
  { id: "cap-1", num: "I", title: "Disposiciones Generales", desc: "Definiciones, ámbito de aplicación y procedimientos" },
  { id: "cap-2", num: "II", title: "Sistema Musculoesquelético", desc: "Extremidades superiores, inferiores, columna vertebral" },
  { id: "cap-3", num: "III", title: "Sistema Nervioso", desc: "Central, periférico, epilepsia, trastornos del sueño" },
  { id: "cap-4", num: "IV", title: "Sistema Cardiovascular", desc: "Enfermedades coronarias, valvulares, arritmias" },
  { id: "cap-5", num: "V", title: "Sistema Respiratorio", desc: "Asma, EPOC, enfermedades intersticiales" },
  { id: "cap-6", num: "VI", title: "Sistema Digestivo", desc: "Esófago, estómago, intestino, hígado" },
  { id: "cap-7", num: "VII", title: "Sistema Urinario", desc: "Riñón, vejiga, vías urinarias" },
  { id: "cap-8", num: "VIII", title: "Sistema Reproductivo", desc: "Órganos reproductivos masculinos y femeninos" },
  { id: "cap-9", num: "IX", title: "Piel y Anexos", desc: "Dermatitis, cicatrices, quemaduras" },
  { id: "cap-10", num: "X", title: "Sistema Visual", desc: "Agudeza visual, campo visual, anexos oculares" },
  { id: "cap-11", num: "XI", title: "Sistema Auditivo", desc: "Hipoacusia, vértigo, equilibrio" },
  { id: "cap-12", num: "XII", title: "Sistema Endocrino", desc: "Tiroides, diabetes, suprarrenales" },
];

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const { unlockedChapters } = useUnlockedChapters();
  const { chapterResults } = useDeficiency();

  const filtered = chapters.filter(
    (ch) =>
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nueva Calificación</h1>
        <p className="text-muted-foreground mt-1">Decreto 1507 de 2014 — Selecciona un capítulo</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar capítulos, sistemas o palabras clave..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((ch) => {
          const isUnlocked = unlockedChapters.includes(ch.id);
          const result = chapterResults.find((r) => r.chapterId === ch.id);
          return (
            <div
              key={ch.id}
              className={`glass-card-hover p-5 cursor-pointer ${!isUnlocked ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-cobalt flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  {ch.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{ch.title}</h3>
                    {result ? (
                      <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    ) : isUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                  {result && (
                    <p className="text-xs font-semibold text-success mt-1">Deficiencia: {result.value}%</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
