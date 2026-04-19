import { Link } from "react-router-dom";
import {
  Bone, Brain, Heart, Eye, Ear, Wind, Droplets, Shield,
  Users, FileText, Calculator, CheckCircle, Lock, BarChart3, ArrowRight, Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { CHAPTER_MAP, isChapterUnlocked } from "@/lib/chapters";

const systemCategories = Object.entries(CHAPTER_MAP).map(([id, name]) => {
  const iconMap: Record<string, any> = {
    "cap-1": FileText,
    "cap-2": Bone,
    "cap-3": Brain,
    "cap-4": Heart,
    "cap-5": Wind,
    "cap-6": Droplets,
    "cap-7": Droplets,
    "cap-8": Shield,
    "cap-9": Shield,
    "cap-10": Eye,
    "cap-11": Ear,
    "cap-12": Heart,
  };
  return { id, name, icon: iconMap[id] || FileText };
});

export default function Dashboard() {
  const { unlockedChapters } = useUnlockedChapters();
  const { chapterResults, combinedValue } = useDeficiency();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const getChapterResult = (id: string) => chapterResults.find((r) => r.chapterId === id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido{userName ? `, ${userName}` : ""} a MedValua 1507</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pacientes", value: "—", icon: Users, link: "/pacientes" },
          { label: "Capítulos", value: `${unlockedChapters.length}/12`, icon: CheckCircle, link: "/activacion" },
          { label: "Calificados", value: `${chapterResults.length}`, icon: FileText, link: "/calculadora" },
          { label: "PCL Integral", value: combinedValue !== null ? `${combinedValue.toFixed(1)}%` : "—", icon: BarChart3, link: "/reportes" },
        ].map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/calculadora" className="bento-item md:col-span-2 gradient-cobalt text-primary-foreground group">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Calculadora Central</h3>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            Fórmula A + B × (1 − A) • Valores ordenados de mayor a menor.
          </p>
          {combinedValue !== null && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-foreground/15 rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium">Deficiencia Integral:</span>
              <span className="text-lg font-bold">{combinedValue.toFixed(2)}%</span>
            </div>
          )}
          <span className="block mt-3 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            Abrir Calculadora →
          </span>
        </Link>
        <Link to="/informe" className="bento-item group border-destructive/20">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-6 h-6 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Generar Dictamen</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Exportar informe profesional en PDF.
          </p>
          <span className="inline-block mt-3 text-destructive text-sm font-medium">Generar PDF →</span>
        </Link>
      </div>

      {/* Chapters Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Capítulos del Manual</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {systemCategories.map((sys) => {
            const isUnlocked = isChapterUnlocked(sys.id, unlockedChapters);
            const result = getChapterResult(sys.id);
            const CardWrapper = isUnlocked ? Link : "div";
            const linkProps = isUnlocked ? { to: `/capitulo/${sys.id}` } : {};
            return (
              <CardWrapper
                key={sys.id}
                {...(linkProps as any)}
                className={`category-card relative ${!isUnlocked ? "opacity-50 cursor-not-allowed" : "hover:border-primary/30 hover:shadow-md"}`}
              >
                <div className={`category-icon ${isUnlocked ? "gradient-cobalt" : "bg-muted"} text-primary-foreground`}>
                  {isUnlocked ? <sys.icon className="w-6 h-6" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {sys.name}
                </span>
                {result ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-semibold text-success">{result.value}%</span>
                  </div>
                ) : isUnlocked ? (
                  <span className="text-[10px] text-primary font-medium">Evaluar →</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Bloqueado</span>
                )}
              </CardWrapper>
            );
          })}
        </div>
      </div>

      {/* PDF Button when results exist */}
      {chapterResults.length > 0 && (
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-destructive/20">
          <div>
            <p className="font-semibold text-foreground">Resultado PCL Integral: <span className="text-destructive">{combinedValue?.toFixed(2)}%</span></p>
            <p className="text-xs text-muted-foreground">{chapterResults.length} capítulo(s) evaluado(s)</p>
          </div>
          <Link to="/informe">
            <Button className="btn-crimson h-11 px-6 rounded-xl">
              <Stethoscope className="w-4 h-4 mr-2" />
              Generar Dictamen PDF
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
