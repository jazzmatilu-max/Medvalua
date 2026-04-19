import { useEffect, useState } from "react";
import { Shield, Users, Key, Plus, Copy, UserCheck, UserX, BarChart3, Eye, Trash2, Monitor, Mail, Calendar, CheckCircle, XCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getChapterOptions } from "@/lib/chapters";

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  chapters: string[];
  created_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
}

interface AccessCode {
  id: string;
  code: string;
  chapter_id: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export default function AdminConsole() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [selectedChapter, setSelectedChapter] = useState("cap-1");
  const [quantity, setQuantity] = useState("1");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchUsers = async () => {
    // Get auth data via admin function
    const { data: authUsers } = await supabase.rpc("admin_list_users");
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, unlocked_chapters");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const { data: chapters } = await supabase.from("user_chapters").select("user_id, chapter_id");

    const authList = (authUsers as any[]) ?? [];
    const profileList = profiles ?? [];
    const roleList = roles ?? [];
    const chapterList = chapters ?? [];

    const visibleAuthList = authList.filter((au) =>
      profileList.some((p) => p.user_id === au.user_id)
    );

    const mapped: UserProfile[] = visibleAuthList.map((au) => ({
      user_id: au.user_id,
      full_name: profileList.find((p) => p.user_id === au.user_id)?.full_name ?? null,
      email: au.email,
      role: roleList.find((r) => r.user_id === au.user_id)?.role ?? "user",
      chapters: profileList.find((p) => p.user_id === au.user_id)?.unlocked_chapters ?? chapterList.filter((c) => c.user_id === au.user_id).map((c) => c.chapter_id),
      created_at: au.created_at,
      email_confirmed_at: au.email_confirmed_at,
      last_sign_in_at: au.last_sign_in_at,
    }));
    setUsers(mapped);
  };

  const fetchCodes = async () => {
    const { data } = await supabase
      .from("access_codes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setCodes((data as AccessCode[]) ?? []);
  };

  useEffect(() => { fetchUsers(); fetchCodes(); }, []);

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleGenerateCodes = async () => {
    if (!user) return;
    const qty = parseInt(quantity) || 1;
    const newCodes = Array.from({ length: Math.min(qty, 50) }, () => ({
      code: generateCode(),
      chapter_id: selectedChapter,
      created_by_admin_id: user.id,
    }));
    const { error } = await supabase.from("access_codes").insert(newCodes);
    if (error) { toast.error(error.message); return; }
    toast.success(`${newCodes.length} código(s) generado(s)`);
    fetchCodes();
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    if (currentRole === "admin") {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      await supabase.from("user_roles").insert({ user_id: userId, role: "user" as any });
      toast.success("Rol de admin removido");
    } else {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "user");
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
      toast.success("Rol de admin asignado");
    }
    fetchUsers();
  };

  const handleDeleteCode = async (codeId: string) => {
    const { error } = await supabase.from("access_codes").delete().eq("id", codeId);
    if (error) { toast.error(error.message); return; }
    toast.success("Código eliminado");
    fetchCodes();
  };

  const useAccessCode = async (code: string, userId: string) => {
    // Find the code
    const { data: codeData, error: fetchError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (fetchError || !codeData) {
      throw new Error("Código no encontrado");
    }

    if (codeData.used) {
      throw new Error("Código ya usado");
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from("access_codes")
      .update({
        used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq("id", codeData.id);

    if (updateError) {
      throw new Error(`Error actualizando código: ${updateError.message}`);
    }

    // Add chapter to user_chapters
    const { error: insertError } = await supabase
      .from("user_chapters")
      .insert({
        user_id: userId,
        chapter_id: codeData.chapter_id,
      });

    if (insertError) {
      throw new Error(`Error desbloqueando capítulo: ${insertError.message}`);
    }

    return codeData.chapter_id;
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) {
      toast.error(`Error eliminando usuario: ${error.message}`);
      return;
    }
    toast.success("Usuario eliminado de la consola");
    fetchUsers();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado");
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "—";
    const u = users.find((u) => u.user_id === userId);
    return u?.full_name || u?.email || userId.slice(0, 8) + "...";
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-cobalt flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Consola de Administración</h1>
            <p className="text-muted-foreground mt-0.5">Gestión de usuarios, códigos y monitoreo</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-2">
          <Monitor className="w-4 h-4" />
          {showPreview ? "Cerrar Vista Previa" : "Vista de Usuario"}
        </Button>
      </div>

      {/* Non-admin preview */}
      {showPreview && (
        <div className="bento-item border-primary/20 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Vista previa — Así ven los usuarios normales la app</h3>
          </div>
          <div className="rounded-xl border overflow-hidden bg-background" style={{ height: "500px" }}>
            <iframe
              src={`${window.location.origin}/?preview=user`}
              className="w-full h-full border-0"
              title="Vista de usuario"
            />
          </div>
          <p className="text-xs text-muted-foreground">Los usuarios no-admin ven módulos bloqueados con candado según sus códigos activados.</p>
        </div>
      )}

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Usuarios</TabsTrigger>
          <TabsTrigger value="codes"><Key className="w-4 h-4 mr-2" />Códigos</TabsTrigger>
          <TabsTrigger value="monitor"><BarChart3 className="w-4 h-4 mr-2" />Monitor</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Usuarios Registrados ({users.length})</h3>
            <Button variant="outline" size="sm" onClick={fetchUsers}>Actualizar</Button>
          </div>
          {users.map((u) => (
            <div key={u.user_id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{u.full_name || "Sin nombre"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{u.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Registro: {formatDate(u.created_at)}
                    </span>
                    {u.email_confirmed_at ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />Email verificado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <XCircle className="w-3 h-3" />Sin verificar
                      </span>
                    )}
                    {u.last_sign_in_at && (
                      <span className="flex items-center gap-1">
                        <LogIn className="w-3 h-3" />
                        Último ingreso: {formatDate(u.last_sign_in_at)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {u.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => toggleAdmin(u.user_id, u.role)}>
                    {u.role === "admin" ? (
                      <><UserX className="w-3.5 h-3.5 mr-1" />Quitar Admin</>
                    ) : (
                      <><UserCheck className="w-3.5 h-3.5 mr-1" />Hacer Admin</>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedUser(selectedUser === u.user_id ? null : u.user_id)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  {u.user_id !== user?.id && (
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(u.user_id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              {selectedUser === u.user_id && (
                <div className="p-3 rounded-lg bg-muted/30 animate-fade-in">
                  <p className="text-xs font-semibold text-foreground mb-2">Módulos Desbloqueados ({u.chapters.length}/12)</p>
                  {u.chapters.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {u.chapters.map((ch) => (
                        <span key={ch} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {ch}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Ningún módulo desbloqueado</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No hay usuarios registrados</p>
          )}
        </TabsContent>

        {/* CODES TAB */}
        <TabsContent value="codes" className="space-y-6 mt-6">
          <div className="bento-item space-y-4">
            <h3 className="font-semibold text-foreground">Generar Códigos de Activación</h3>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {getChapterOptions().map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>{ch.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" min="1" max="50" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-24" placeholder="Cant." />
              <Button onClick={handleGenerateCodes} className="gradient-cobalt text-primary-foreground border-0">
                <Plus className="w-4 h-4 mr-2" />Generar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {codes.map((c) => (
              <div key={c.id} className="glass-card p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-wrap">
                  <code className="font-mono text-sm text-foreground">{c.code}</code>
                  <span className="text-xs text-muted-foreground">{c.chapter_id}</span>
                  {c.used && c.used_by && (
                    <span className="text-xs text-muted-foreground">→ {getUserName(c.used_by)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.used ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {c.used ? "Usado" : "Disponible"}
                  </span>
                  {!c.used && (
                    <button onClick={() => copyCode(c.code)} className="p-1.5 rounded hover:bg-muted transition-colors">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <button onClick={() => handleDeleteCode(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {codes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay códigos generados</p>
            )}
          </div>
        </TabsContent>

        {/* MONITOR TAB */}
        <TabsContent value="monitor" className="space-y-4 mt-6">
          <div className="bento-item">
            <h3 className="font-semibold text-foreground mb-3">Resumen del Sistema</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <p className="text-2xl font-bold text-primary">{users.length}</p>
                <p className="text-xs text-muted-foreground">Usuarios</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <p className="text-2xl font-bold text-primary">{users.filter((u) => u.role === "admin").length}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <p className="text-2xl font-bold text-primary">{codes.filter((c) => !c.used).length}</p>
                <p className="text-xs text-muted-foreground">Códigos Disponibles</p>
              </div>
              <div className="p-4 rounded-xl bg-destructive/5 text-center">
                <p className="text-2xl font-bold text-destructive">{codes.filter((c) => c.used).length}</p>
                <p className="text-xs text-muted-foreground">Códigos Usados</p>
              </div>
            </div>
          </div>
          <div className="bento-item">
            <h3 className="font-semibold text-foreground mb-3">Usuarios sin verificar email</h3>
            <div className="space-y-2">
              {users.filter((u) => !u.email_confirmed_at).map((u) => (
                <div key={u.user_id} className="flex items-center justify-between p-2 bg-amber-500/5 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-foreground">{u.full_name || u.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(u.created_at)}</span>
                </div>
              ))}
              {users.filter((u) => !u.email_confirmed_at).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">Todos los usuarios han verificado su email ✓</p>
              )}
            </div>
          </div>
          <div className="bento-item">
            <h3 className="font-semibold text-foreground mb-3">Activaciones Recientes</h3>
            <div className="space-y-2">
              {codes.filter((c) => c.used).slice(0, 10).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs">{c.code}</code>
                    <span className="text-xs text-muted-foreground">{c.chapter_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{getUserName(c.used_by)}</span>
                    {c.used_at && <span>• {new Date(c.used_at).toLocaleDateString("es-CO")}</span>}
                  </div>
                </div>
              ))}
              {codes.filter((c) => c.used).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Sin activaciones aún</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
