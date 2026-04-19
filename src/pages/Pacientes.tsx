import { useEffect, useState } from "react";
import { Users, Search, Plus, Trash2, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Patient {
  id: string;
  full_name: string;
  document_id: string;
  diagnosis: string | null;
  pcl_result: number | null;
  notes: string | null;
  created_at: string;
}

export default function Pacientes() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", document_id: "", diagnosis: "", pcl_result: "", notes: "" });

  const fetchPatients = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setPatients((data as Patient[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("patients").insert({
      user_id: user.id,
      full_name: form.full_name,
      document_id: form.document_id,
      diagnosis: form.diagnosis || null,
      pcl_result: form.pcl_result ? parseFloat(form.pcl_result) : null,
      notes: form.notes || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Paciente registrado");
    setForm({ full_name: "", document_id: "", diagnosis: "", pcl_result: "", notes: "" });
    setOpen(false);
    fetchPatients();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Paciente eliminado");
    fetchPatients();
  };

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.document_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mis Pacientes</h1>
          <p className="text-muted-foreground mt-1">Registro de evaluaciones PCL</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Paciente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input placeholder="Nombre completo" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <Input placeholder="Número de documento" value={form.document_id} onChange={(e) => setForm({ ...form, document_id: e.target.value })} required />
              <Input placeholder="Diagnóstico" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
              <Input type="number" step="0.01" min="0" max="100" placeholder="Resultado PCL (%)" value={form.pcl_result} onChange={(e) => setForm({ ...form, pcl_result: e.target.value })} />
              <Input placeholder="Notas adicionales" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
                Guardar Paciente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o documento..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="bento-item flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Sin pacientes aún</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Agrega tu primer paciente para comenzar a realizar evaluaciones.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{p.full_name}</p>
                <p className="text-xs text-muted-foreground">Doc: {p.document_id}</p>
                {p.diagnosis && <p className="text-xs text-muted-foreground mt-1">{p.diagnosis}</p>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {p.pcl_result !== null && (
                  <span className="text-lg font-bold text-primary">{p.pcl_result}%</span>
                )}
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
