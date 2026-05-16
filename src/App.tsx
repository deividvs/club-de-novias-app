import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/app-context'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Index from './pages/Index'
import Onboarding from './pages/Onboarding'
import Orcamento from './pages/Orcamento'
import Cronograma from './pages/Cronograma'
import Biblioteca from './pages/Biblioteca'
import Perfil from './pages/Perfil'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/orcamento" element={<Orcamento />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
