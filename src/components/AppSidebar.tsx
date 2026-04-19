import {
  LayoutDashboard, Users, Calculator, Settings,
  Key, Shield, LogOut, Activity, FileText, BarChart3,
  HelpCircle, Stethoscope, Bone, Brain, Heart, Wind,
  Droplets, Eye, Ear, Lock, CheckCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { useUnlockedChapters } from "@/hooks/useUnlockedChapters";
import { isChapterUnlocked } from "@/lib/chapters";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Nueva Calificación", url: "/nueva-calificacion", icon: FileText },
  { title: "Calculadora Central", url: "/calculadora", icon: Calculator },
  { title: "Mis Pacientes", url: "/pacientes", icon: Users },
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
  { title: "Generar Informe", url: "/informe", icon: Stethoscope },
  { title: "Activación", url: "/activacion", icon: Key },
  { title: "Ayuda", url: "/ayuda", icon: HelpCircle },
];

const chapterItems = [
  { id: "cap-1", title: "I · Disposiciones Generales", icon: FileText },
  { id: "cap-2", title: "II · Osteomuscular", icon: Bone },
  { id: "cap-3", title: "III · Nervioso", icon: Brain },
  { id: "cap-4", title: "IV · Cardiovascular", icon: Heart },
  { id: "cap-5", title: "V · Respiratorio", icon: Wind },
  { id: "cap-6", title: "VI · Digestivo", icon: Droplets },
  { id: "cap-7", title: "VII · Urinario", icon: Droplets },
  { id: "cap-8", title: "VIII · Reproductivo", icon: Shield },
  { id: "cap-9", title: "IX · Piel y Anexos", icon: Shield },
  { id: "cap-10", title: "X · Visual", icon: Eye },
  { id: "cap-11", title: "XI · Auditivo", icon: Ear },
  { id: "cap-12", title: "XII · Endocrino", icon: Heart },
];

const settingsItems = [
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin, signOut, user } = useAuth();
  const { combinedValue, chapterResults } = useDeficiency();
  const { unlockedChapters } = useUnlockedChapters();
  const isSuperAdminUser = user?.email === "jazzherre28@gmail.com";

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="sidebar-glow border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-cobalt flex items-center justify-center flex-shrink-0">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-sidebar-primary-foreground">MedValua</span>
              <span className="text-[10px] text-sidebar-foreground/60 tracking-widest uppercase">1507</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] tracking-widest uppercase">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chapters */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] tracking-widest uppercase">
            Capítulos 1507
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapterItems.map((ch) => {
                const unlocked = isAdmin || isSuperAdminUser || isChapterUnlocked(ch.id, unlockedChapters);
                const result = chapterResults.find((r) => r.chapterId === ch.id);
                return (
                  <SidebarMenuItem key={ch.id}>
                    <SidebarMenuButton asChild={unlocked} isActive={isActive(`/capitulo/${ch.id}`)} tooltip={ch.title} className={`${!unlocked ? "opacity-40 cursor-default" : ""}`}>
                      {unlocked ? (
                        <NavLink to={`/capitulo/${ch.id}`} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                          {result ? (
                            <CheckCircle className="mr-2 h-4 w-4 text-success flex-shrink-0" />
                          ) : (
                            <ch.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                          )}
                          {!collapsed && (
                            <span className="truncate text-xs">
                              {ch.title}
                              {result && <span className="ml-1 text-success font-semibold">({result.value}%)</span>}
                            </span>
                          )}
                        </NavLink>
                      ) : (
                        <span className="flex items-center">
                          <Lock className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                          {!collapsed && <span className="truncate text-xs">{ch.title}</span>}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Combined value indicator */}
        {!collapsed && chapterResults.length > 0 && (
          <div className="mx-3 my-2 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Deficiencia Integral</p>
            <p className="text-lg font-bold text-gradient-crimson mt-0.5">
              {combinedValue?.toFixed(2) ?? "—"}%
            </p>
            <p className="text-[10px] text-sidebar-foreground/40">{chapterResults.length} capítulo(s)</p>
          </div>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] tracking-widest uppercase">
              Administración
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Consola Admin">
                    <NavLink to="/admin" className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Shield className="mr-2 h-4 w-4" />
                      {!collapsed && <span>Consola Admin</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-1">
        {!collapsed && user && (
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}