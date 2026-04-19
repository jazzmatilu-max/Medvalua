import { useState } from "react";
import { Key, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { toast } from "sonner";

export default function Activacion() {
  const { user } = useAuth();
  const { unlockedChapters, refetch } = useUnlockedChapters();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !code.trim()) return;
    setLoading(true);

    const { data: codeData, error: findError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("used", false)
      .maybeSingle();

    if (findError || !codeData) {
      toast.error("Código inválido o ya utilizado");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("access_codes")
      .update({ used: true, used_by: user.id, used_at: new Date().toISOString() } as any)
      .eq("id", codeData.id);

    if (updateError) {
      toast.error("Error al canjear el código");
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("unlocked_chapters")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profileData) {
      toast.error("Error al actualizar el progreso");
      setLoading(false);
      return;
    }

    const unlocked = profileData.unlocked_chapters ?? [];
    if (!unlocked.includes(codeData.chapter_id)) {
      unlocked.push(codeData.chapter_id);
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ unlocked_chapters: unlocked })
        .eq("user_id", user.id);

      if (profileUpdateError) {
        toast.error("Error al actualizar el progreso");
        setLoading(false);
        return;
      }
    }

    const { error: insertError } = await supabase
      .from("user_chapters")
      .insert({ user_id: user.id, chapter_id: codeData.chapter_id });

    if (insertError && !insertError.message.includes("duplicate")) {
      toast.error("Error al desbloquear capítulo");
    } else {
      toast.success(`¡Capítulo desbloqueado exitosamente!`);
      setCode("");
      refetch();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-cobalt flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Activación de Módulos</h1>
        <p className="text-muted-foreground mt-1">Ingresa tu código de acceso para desbloquear capítulos</p>
      </div>

      <form onSubmit={handleRedeem} className="space-y-4">
        <Input
          placeholder="Ingresa tu código (ej: MV-XXXX-XXXX)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="text-center text-lg tracking-widest font-mono h-12"
          required
        />
        <Button type="submit" disabled={loading} className="w-full btn-crimson h-11">
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? "Procesando..." : "Canjear Código"}
        </Button>
      </form>

      {unlockedChapters.length > 0 && (
        <div className="bento-item">
          <h3 className="font-semibold text-foreground mb-3">Módulos Desbloqueados</h3>
          <div className="space-y-2">
            {unlockedChapters.map((ch) => (
              <div key={ch} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground">{ch.replace("cap-", "Capítulo ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
