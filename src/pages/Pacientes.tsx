import { useEffect, useState, useRef } from "react";
import { Users, Search, Plus, Trash2, FileDown, ArrowDown, X, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { ChapterResult } from "@/contexts/DeficiencyContext";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Patient {
  id: string;
  full_name: string;
  document_id: string;
  diagnosis: string | null;
  pcl_result: number | null;
  notes: string | null;
  created_at: string;
}

interface FormState {
  full_name: string;
  document_id: string;
  diagnosis: string;
  pcl_result: string;
  notes: string;
  chapterBreakdown: ChapterResult[];
}

export default function Pacientes() {
  const { user } = useAuth();
  const { combinedValue, chapterResults } = useDeficiency();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ full_name: "", document_id: "", diagnosis: "", pcl_result: "", notes: "", chapterBreakdown: [] });
  const dialogRef = useRef<HTMLDivElement>(null);

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
    if (!form.full_name.trim()) { toast.error("Ingresa el nombre del paciente"); return; }
    if (!form.document_id.trim()) { toast.error("Ingresa el documento del paciente"); return; }
    
    let notesData = form.notes;
    if (form.chapterBreakdown.length > 0) {
      const breakdownText = form.chapterBreakdown.map(c => `${c.chapterName}: ${c.value.toFixed(2)}%`).join(" | ");
      notesData = notesData ? `${notesData}\n\nDesglose por Capítulo: ${breakdownText}` : `Desglose por Capítulo: ${breakdownText}`;
    }
    
    if (editingPatientId) {
      // Actualizar paciente existente
      const { error } = await supabase.from("patients").update({
        full_name: form.full_name,
        document_id: form.document_id,
        diagnosis: form.diagnosis || null,
        pcl_result: form.pcl_result ? parseFloat(form.pcl_result) : null,
        notes: notesData || null,
      }).eq("id", editingPatientId);
      
      if (error) { toast.error(error.message); return; }
      toast.success("Paciente actualizado exitosamente");
    } else {
      // Crear nuevo paciente
      const { error } = await supabase.from("patients").insert({
        user_id: user.id,
        full_name: form.full_name,
        document_id: form.document_id,
        diagnosis: form.diagnosis || null,
        pcl_result: form.pcl_result ? parseFloat(form.pcl_result) : null,
        notes: notesData || null,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Paciente registrado exitosamente");
    }
    
    handleClearForm();
    setOpen(false);
    fetchPatients();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Paciente eliminado");
    fetchPatients();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatientId(patient.id);
    
    // Extraer desglose de capítulos si existe
    let chapterBreakdown: ChapterResult[] = [];
    if (patient.notes && patient.notes.includes("Desglose por Capítulo:")) {
      const breakdownStart = patient.notes.indexOf("Desglose por Capítulo:") + "Desglose por Capítulo:".length;
      const breakdownText = patient.notes.substring(breakdownStart).trim();
      const chapters = breakdownText.split(" | ");
      chapterBreakdown = chapters.map((ch, idx) => {
        const [name, value] = ch.split(": ");
        return {
          chapterId: `chapter_${idx}`,
          chapterName: name,
          value: parseFloat(value) || 0
        };
      });
    }
    
    // Cargar datos en el formulario
    const notesWithoutBreakdown = patient.notes ? patient.notes.split("\n\nDesglose por Capítulo:")[0] : "";
    setForm({
      full_name: patient.full_name,
      document_id: patient.document_id,
      diagnosis: patient.diagnosis || "",
      pcl_result: patient.pcl_result ? patient.pcl_result.toString() : "",
      notes: notesWithoutBreakdown,
      chapterBreakdown
    });
    
    setOpen(true);
    // Scroll hacia el diálogo
    setTimeout(() => {
      dialogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleClearForm = () => {
    setEditingPatientId(null);
    setForm({ full_name: "", document_id: "", diagnosis: "", pcl_result: "", notes: "", chapterBreakdown: [] });
  };

  const handleDragFromCalculator = () => {
    if (combinedValue !== null && chapterResults.length > 0) {
      setForm({ 
        ...form, 
        pcl_result: combinedValue.toString(),
        chapterBreakdown: [...chapterResults]
      });
      toast.success("Información de calculadora aplicada");
    } else {
      toast.error("No hay resultados en la calculadora");
    }
  };

  const handleClearChapterBreakdown = () => {
    setForm({ ...form, chapterBreakdown: [], pcl_result: "" });
    toast.success("Desglose eliminado");
  };

  const exportPatientPDF = (patient: Patient) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header bar
    doc.setFillColor(0, 71, 171); // cobalt
    doc.rect(0, 0, pageW, 32, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MedValua 1507", 14, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Informe de Paciente — Decreto 1507 de 2014", 14, 24);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, pageW - 14, 24, { align: "right" });

    let y = 44;

    // Patient info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${patient.full_name}`, 14, y);
    y += 6;
    doc.text(`Documento: ${patient.document_id}`, 14, y);
    y += 6;
    doc.text(`Diagnóstico: ${patient.diagnosis || "N/A"}`, 14, y);
    y += 12;

    // Extract chapter breakdown from notes if available
    let chapterData: any[] = [];
    if (patient.notes && patient.notes.includes("Desglose por Capítulo:")) {
      const breakdownStart = patient.notes.indexOf("Desglose por Capítulo:") + "Desglose por Capítulo:".length;
      const breakdownText = patient.notes.substring(breakdownStart).trim();
      const chapters = breakdownText.split(" | ");
      chapterData = chapters.map(ch => {
        const [name, value] = ch.split(": ");
        return [name, value];
      });
    }

    // PCL Result and breakdown
    if (patient.pcl_result !== null) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("RESULTADO PCL", 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Deficiencia Integral: ${patient.pcl_result}%`, 14, y);
      y += 12;

      // Chapter breakdown table
      if (chapterData.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("DESGLOSE POR CAPÍTULO", 14, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [["Capítulo", "Deficiencia (%)"]],
          body: chapterData,
          theme: "grid",
          headStyles: { fillColor: [0, 71, 171], fontSize: 9 },
          bodyStyles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        y = (doc as any).lastAutoTable.finalY + 8;
      }
    }

    // Notes (excluding chapter breakdown)
    if (patient.notes) {
      const notesText = patient.notes.split("\n\nDesglose por Capítulo:")[0];
      if (notesText.trim()) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("NOTAS ADICIONALES", 14, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(notesText, pageW - 28);
        doc.text(lines, 14, y);
      }
    }

    doc.save(`Informe_${patient.full_name.replace(/\s+/g, '_')}.pdf`);
    toast.success("PDF generado");
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
        <Dialog open={open} onOpenChange={(newOpen) => {
          if (!newOpen) handleClearForm();
          setOpen(newOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto" ref={dialogRef}>
            <DialogHeader>
              <DialogTitle>
                {editingPatientId ? "Editar Paciente" : "Registrar Paciente"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input placeholder="Nombre completo" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <Input placeholder="Número de documento" value={form.document_id} onChange={(e) => setForm({ ...form, document_id: e.target.value })} required />
              <Input placeholder="Diagnóstico" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
              <Input type="number" step="0.01" min="0" max="100" placeholder="Resultado PCL (%)" value={form.pcl_result} onChange={(e) => setForm({ ...form, pcl_result: e.target.value })} />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleDragFromCalculator} className="flex-1">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Arrastrar de Calculadora
                </Button>
              </div>

              {form.chapterBreakdown.length > 0 && (
                <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Desglose por Capítulo</h4>
                    <button type="button" onClick={handleClearChapterBreakdown} className="p-1 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {form.chapterBreakdown.map((chapter) => (
                      <div key={chapter.chapterId} className="flex items-center justify-between text-sm p-2 rounded bg-background/50">
                        <span className="text-foreground">{chapter.chapterName}</span>
                        <span className="font-semibold text-primary">{chapter.value.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Input placeholder="Notas adicionales" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 gradient-primary text-primary-foreground border-0">
                  {editingPatientId ? "Actualizar Paciente" : "Guardar Paciente"}
                </Button>
                {editingPatientId && (
                  <Button type="button" variant="outline" onClick={handleClearForm} className="flex-1">
                    Cancelar Edición
                  </Button>
                )}
              </div>
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
                <button onClick={() => handleEditPatient(p)} className="p-2 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors" title="Editar paciente">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => exportPatientPDF(p)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Descargar PDF">
                  <FileDown className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Eliminar paciente">
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
