import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/app-context'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

import Layout from './components/Layout'
import AuthPage from './pages/Auth'
import NotFound from './pages/NotFound'
import Index from './pages/Index'
import Onboarding from './pages/Onboarding'
import Orcamento from './pages/Orcamento'
import Simulador from './pages/Simulador'
import Convidados from './pages/Convidados'
import Cronograma from './pages/Cronograma'
import Biblioteca from './pages/Biblioteca'
import Perfil from './pages/Perfil'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!isAuthenticated) return <AuthPage />
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/orcamento" element={<Orcamento />} />
              <Route path="/simulador" element={<Simulador />} />
              <Route path="/convidados" element={<Convidados />} />
              <Route path="/cronograma" element={<Cronograma />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
