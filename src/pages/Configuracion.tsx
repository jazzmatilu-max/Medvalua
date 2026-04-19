import { useState } from "react";
import { User, Bell, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Configuracion() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const renderMenu = () => (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">Personaliza tu experiencia</p>
      </div>

      {[
        { icon: User, title: "Perfil", desc: "Datos personales y profesionales" },
        { icon: Bell, title: "Notificaciones", desc: "Preferencias de alertas" },
        { icon: Shield, title: "Seguridad", desc: "Contraseña y autenticación" },
      ].map((item) => (
        <div
          key={item.title}
          className="glass-card-hover p-5 cursor-pointer"
          onClick={() => setSelectedSection(item.title)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPerfil = () => (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedSection(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Perfil</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input id="fullName" placeholder="Ingresa tu nombre completo" />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" placeholder="Ingresa tu correo electrónico" />
        </div>
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  );

  const renderNotificaciones = () => (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedSection(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notificaciones</h1>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="citas">Notificaciones de Citas</Label>
          <Switch id="citas" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="alertas">Alertas del Sistema</Label>
          <Switch id="alertas" />
        </div>
      </div>
    </div>
  );

  const renderSeguridad = () => (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedSection(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Seguridad</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">Contraseña Actual</Label>
          <Input id="currentPassword" type="password" placeholder="Ingresa tu contraseña actual" />
        </div>
        <div>
          <Label htmlFor="newPassword">Nueva Contraseña</Label>
          <Input id="newPassword" type="password" placeholder="Ingresa tu nueva contraseña" />
        </div>
        <Button>Cambiar Contraseña</Button>
      </div>
    </div>
  );

  if (selectedSection === "Perfil") return renderPerfil();
  if (selectedSection === "Notificaciones") return renderNotificaciones();
  if (selectedSection === "Seguridad") return renderSeguridad();
  return renderMenu();
}
