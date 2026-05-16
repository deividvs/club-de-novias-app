import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, PieChart, CalendarDays, BookOpen, User, ArrowLeft, Calculator } from 'lucide-react'
import { useAppContext } from '@/context/app-context'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/orcamento', label: 'Orçamento', icon: PieChart },
  { path: '/simulador', label: 'Simulador', icon: Calculator },
  { path: '/cronograma', label: 'Cronograma', icon: CalendarDays },
  { path: '/biblioteca', label: 'Biblioteca', icon: BookOpen },
  { path: '/perfil', label: 'Perfil', icon: User },
]

export default function Layout() {
  const { user, isLoaded } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const isOnboarding = location.pathname === '/onboarding'
  const isSubPage = location.pathname.split('/').length > 2

  useEffect(() => {
    if (isLoaded && !user.onboarded && !isOnboarding) {
      navigate('/onboarding')
    }
  }, [user.onboarded, isLoaded, isOnboarding, navigate])

  if (!isLoaded)
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  if (isOnboarding) return <Outlet />

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card fixed h-full p-4 z-10 print:hidden">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl leading-none">
              C
            </span>
          </div>
          <span className="font-display font-semibold text-xl tracking-tight">Club de Novias</span>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col pb-20 md:pb-0 min-h-screen">
        {/* Mobile/Subpage Header */}
        <header className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center justify-center print:hidden">
          {isSubPage && (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="font-display font-semibold text-lg tracking-tight">Club de Novias</span>
        </header>

        <div className="flex-1 animate-slide-up-fade">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-card border-t flex justify-around items-center h-16 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
