import { useState } from "react";
import { FileDown, Edit3, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Informe() {
  const { chapterResults, combinedValue } = useDeficiency();
  const sorted = [...chapterResults].sort((a, b) => b.value - a.value);

  const [patientName, setPatientName] = useState("");
  const [patientDoc, setPatientDoc] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [anamnesis, setAnamnesis] = useState("");
  const [conclusions, setConclusions] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorReg, setDoctorReg] = useState("");

  const exportPDF = () => {
    if (!patientName.trim()) {
      toast.error("Ingresa el nombre del paciente");
      return;
    }

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
    doc.text("Informe de Calificación — Decreto 1507 de 2014", 14, 24);
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
    doc.text(`Nombre: ${patientName}`, 14, y);
    y += 6;
    doc.text(`Documento: ${patientDoc || "N/A"}`, 14, y);
    y += 6;
    doc.text(`Diagnóstico: ${diagnosis || "N/A"}`, 14, y);
    y += 12;

    // Anamnesis
    if (anamnesis.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("ANAMNESIS", 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(anamnesis, pageW - 28);
      doc.text(lines, 14, y);
      y += lines.length * 4.5 + 8;
    }

    // Results table
    if (sorted.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("DESGLOSE DE DEFICIENCIAS POR CAPÍTULO", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["#", "Capítulo", "Deficiencia (%)"]],
        body: sorted.map((r, i) => [
          String(i + 1),
          r.chapterName,
          `${r.value.toFixed(2)}%`,
        ]),
        theme: "grid",
        headStyles: { fillColor: [0, 71, 171], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      // Combined result
      doc.setFillColor(220, 20, 60); // crimson
      doc.roundedRect(14, y, pageW - 28, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("DEFICIENCIA INTEGRAL COMBINADA", 20, y + 10);
      doc.text(`${combinedValue?.toFixed(2)}%`, pageW - 20, y + 10, { align: "right" });
      y += 26;
    }

    // Conclusions
    doc.setTextColor(0, 0, 0);
    if (conclusions.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("CONCLUSIONES", 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const cLines = doc.splitTextToSize(conclusions, pageW - 28);
      doc.text(cLines, 14, y);
      y += cLines.length * 4.5 + 16;
    } else {
      y += 10;
    }

    // Signature
    if (y > 240) { doc.addPage(); y = 30; }
    doc.setDrawColor(180);
    doc.line(14, y + 20, 90, y + 20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(doctorName || "Médico Evaluador", 14, y + 26);
    doc.text(doctorReg ? `Reg. Médico: ${doctorReg}` : "", 14, y + 32);

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text("Documento generado por MedValua 1507 — Decreto 1507 de 2014", pageW / 2, pageH - 8, { align: "center" });

    doc.save(`Informe_PCL_${patientName.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF generado exitosamente");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-cobalt flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Generar Informe</h1>
          <p className="text-muted-foreground mt-0.5">Plantilla profesional de dictamen PCL</p>
        </div>
      </div>

      {/* Patient data */}
      <div className="bento-item space-y-4">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary" /> Datos del Paciente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Nombre completo *" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          <Input placeholder="Número de documento" value={patientDoc} onChange={(e) => setPatientDoc(e.target.value)} />
        </div>
        <Input placeholder="Diagnóstico principal" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
      </div>

      {/* Anamnesis */}
      <div className="bento-item space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Anamnesis</h3>
        <Textarea
          placeholder="Describa la historia clínica relevante del paciente..."
          rows={4}
          value={anamnesis}
          onChange={(e) => setAnamnesis(e.target.value)}
        />
      </div>

      {/* Preview of chapter results */}
      {sorted.length > 0 && (
        <div className="bento-item space-y-3 border-primary/20">
          <h3 className="font-semibold text-foreground text-sm">Deficiencias Registradas</h3>
          <div className="space-y-2">
            {sorted.map((r, i) => (
              <div key={r.chapterId} className="flex items-center justify-between p-2 bg-muted/40 rounded-lg">
                <span className="text-sm text-foreground">{i + 1}. {r.chapterName}</span>
                <span className="text-sm font-bold text-primary">{r.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl gradient-crimson text-destructive-foreground">
            <span className="font-medium text-sm">Deficiencia Integral</span>
            <span className="text-xl font-bold">{combinedValue?.toFixed(2)}%</span>
          </div>
        </div>
      )}

      {/* Conclusions */}
      <div className="bento-item space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Conclusiones</h3>
        <Textarea
          placeholder="Conclusiones del dictamen y recomendaciones..."
          rows={4}
          value={conclusions}
          onChange={(e) => setConclusions(e.target.value)}
        />
      </div>

      {/* Doctor info */}
      <div className="bento-item space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Datos del Evaluador</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Nombre del médico evaluador" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
          <Input placeholder="Registro médico" value={doctorReg} onChange={(e) => setDoctorReg(e.target.value)} />
        </div>
      </div>

      <Button onClick={exportPDF} className="w-full btn-crimson h-12 text-base font-semibold">
        <FileDown className="w-5 h-5 mr-2" />
        Descargar PDF Profesional
      </Button>
    </div>
  );
}
