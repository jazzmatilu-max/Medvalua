import { HelpCircle, Key, Calculator, BookOpen, Users, FileDown, ArrowRight, Shield, LogIn, Settings, Stethoscope, LayoutDashboard } from "lucide-react";

const sections = [
  {
    icon: LogIn,
    title: "Registro e Inicio de Sesión",
    items: [
      "Para crear una cuenta, haz clic en 'Regístrate' en la pantalla de inicio de sesión.",
      "Completa tu nombre completo, correo electrónico y una contraseña de al menos 6 caracteres.",
      "Recibirás un correo de confirmación. Haz clic en el enlace para verificar tu cuenta.",
      "Si olvidaste tu contraseña, usa la opción '¿Olvidaste tu contraseña?' para recibir un correo de recuperación.",
      "El correo de recuperación contiene un enlace seguro para establecer una nueva contraseña.",
      "Puedes usar el ícono del 'ojito' (👁) para ver u ocultar tu contraseña mientras la escribes.",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Navegación General",
    items: [
      "Usa el menú lateral (Sidebar) para moverte entre las secciones principales.",
      "El Dashboard muestra un resumen con tus capítulos desbloqueados y el estado de tus calificaciones.",
      "Puedes colapsar el sidebar haciendo clic en el ícono de menú en la barra superior.",
      "Los capítulos del Decreto 1507 aparecen en el sidebar con su estado: desbloqueado (✓) o bloqueado (🔒).",
      "Como administrador, todos los capítulos aparecen desbloqueados automáticamente.",
    ],
  },
  {
    icon: Key,
    title: "Activar Módulos con Códigos",
    items: [
      "Ve a la sección 'Activación' en el menú lateral.",
      "Ingresa el código de activación proporcionado (formato MV-XXXX-XXXX).",
      "El capítulo se desbloqueará de forma inmediata y podrás acceder a sus tablas de evaluación.",
      "Cada código es de un solo uso y está vinculado a un capítulo específico del Decreto 1507.",
      "Los capítulos disponibles son: Disposiciones Generales, Sistema Osteomuscular, Sistema Nervioso, Sistema Cardiovascular, Sistema Respiratorio, Sistema Digestivo, Sistema Urinario, Sistema Reproductor, Piel, Sistema Hematopoyético, Sistema Endocrino, Oído/Nariz/Garganta, Sistema Visual y Salud Mental.",
    ],
  },
  {
    icon: Stethoscope,
    title: "Evaluación por Capítulos",
    items: [
      "Cada capítulo contiene tablas de evaluación basadas en el Decreto 1507 de 2014.",
      "Selecciona la clase funcional (I, II, III, IV o V según el caso) para cada condición del paciente.",
      "El sistema calcula automáticamente el porcentaje de deficiencia de cada condición seleccionada.",
      "Los resultados parciales se combinan usando la Fórmula de Valores Combinados (Baltazar).",
      "Al guardar, el resultado del capítulo se envía automáticamente a la calculadora central.",
      "El capítulo de 'Disposiciones Generales' contiene el marco normativo y las reglas generales de calificación (no requiere evaluación numérica).",
    ],
  },
  {
    icon: BookOpen,
    title: "Nueva Calificación (Diccionario de Capítulos)",
    items: [
      "La sección 'Nueva Calificación' funciona como un diccionario de referencia del Decreto 1507.",
      "Puedes consultar todas las tablas, condiciones y rangos de clase para cada capítulo.",
      "Usa el buscador para filtrar condiciones específicas rápidamente.",
      "Desde cada capítulo del diccionario puedes iniciar una evaluación directamente.",
    ],
  },
  {
    icon: Calculator,
    title: "Calculadora de Valores Combinados",
    items: [
      "La calculadora aplica la Fórmula de Baltazar (Decreto 1507 de 2014).",
      "Fórmula: A + B × (1 − A), donde A es el mayor valor y B el siguiente.",
      "Los valores se ordenan automáticamente de mayor a menor antes de combinar.",
      "Si hay más de 2 deficiencias, la fórmula se aplica de forma iterativa con cada valor adicional.",
      "Precisión: 2 decimales. El resultado se muestra en tiempo real en el banner superior.",
      "Puedes eliminar resultados individuales o borrar todos los cálculos desde la calculadora.",
      "Los valores ingresados manualmente también se combinan con los resultados de los capítulos.",
    ],
  },
  {
    icon: Users,
    title: "Gestión de Pacientes",
    items: [
      "En 'Mis Pacientes' puedes registrar nuevos pacientes con nombre, documento y diagnóstico.",
      "Las evaluaciones por capítulo se guardan de forma persistente para cada paciente.",
      "Puedes buscar pacientes por nombre o número de documento.",
      "Cada paciente tiene un historial de evaluaciones que se actualiza automáticamente.",
      "Los datos del paciente se usan para generar informes y dictámenes profesionales.",
    ],
  },
  {
    icon: FileDown,
    title: "Generar Informes PDF",
    items: [
      "Ve a 'Generar Informe' para crear un dictamen profesional.",
      "Completa los datos del paciente, anamnesis y conclusiones.",
      "El informe incluye el desglose de deficiencias por capítulo y el resultado integral combinado.",
      "El PDF se genera con el logo de MedValua 1507, la paleta corporativa (azul y rojo) y espacio para firma.",
      "El botón 'Generar Dictamen PDF' aparece cuando tienes resultados de evaluación disponibles.",
    ],
  },
  {
    icon: Shield,
    title: "Consola de Administración",
    items: [
      "Solo los usuarios con rol de administrador pueden acceder a la Consola Admin.",
      "Desde la consola puedes generar códigos de activación únicos para cada capítulo.",
      "Puedes rastrear qué médico usó cada código y qué módulos tiene desbloqueados.",
      "Es posible eliminar códigos no utilizados desde la lista de códigos generados.",
      "Como administrador, todos los capítulos están desbloqueados automáticamente sin necesidad de códigos.",
    ],
  },
  {
    icon: Settings,
    title: "Configuración y Seguridad",
    items: [
      "Tu sesión se mantiene activa de forma segura. Puedes cerrar sesión en cualquier momento.",
      "Los datos se almacenan de forma segura en la nube con encriptación.",
      "Cada usuario solo puede ver y gestionar sus propios pacientes y evaluaciones.",
      "Las contraseñas requieren un mínimo de 6 caracteres para mayor seguridad.",
      "Si necesitas cambiar tu contraseña, usa la opción de recuperación desde la pantalla de inicio.",
    ],
  },
];

export default function Ayuda() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-cobalt flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manual de Usuario</h1>
          <p className="text-muted-foreground mt-0.5">Guía completa de uso de MedValua 1507</p>
        </div>
      </div>

      <div className="bento-item border-primary/20 bg-primary/5">
        <p className="text-sm text-foreground font-medium">
          📋 MedValua 1507 es una herramienta profesional para la calificación de deficiencias según el Decreto 1507 de 2014 (Colombia). 
          Permite evaluar pacientes por capítulos, calcular valores combinados con la Fórmula de Baltazar y generar dictámenes en PDF.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <details key={sec.title} className="bento-item group">
            <summary className="flex items-center gap-3 cursor-pointer list-none">
              <div className="w-8 h-8 rounded-lg gradient-cobalt flex items-center justify-center flex-shrink-0">
                <sec.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-sm flex-1">{sec.title}</h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <ul className="mt-4 space-y-2 pl-11">
              {sec.items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="bento-item text-center border-primary/20">
        <p className="text-sm text-muted-foreground">
          ¿Necesitas más ayuda? Contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
}
