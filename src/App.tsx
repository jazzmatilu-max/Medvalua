import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DeficiencyProvider } from "@/contexts/DeficiencyContext";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import NuevaCalificacion from "./pages/NuevaCalificacion";
import Biblioteca from "./pages/Biblioteca";
import Calculadora from "./pages/Calculadora";
import Configuracion from "./pages/Configuracion";
import Activacion from "./pages/Activacion";
import Reportes from "./pages/Reportes";
import Informe from "./pages/Informe";
import Ayuda from "./pages/Ayuda";
import AdminConsole from "./pages/AdminConsole";
import ChapterEvaluation from "./pages/ChapterEvaluation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>;

  if (!user) {
    return (
      <Routes>
      <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/nueva-calificacion" element={<NuevaCalificacion />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/activacion" element={<Activacion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/informe" element={<Informe />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/capitulo/:chapterId" element={<ChapterEvaluation />} />
        <Route path="/admin" element={<AdminRoute><AdminConsole /></AdminRoute>} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DeficiencyProvider>
            <AppRoutes />
          </DeficiencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
