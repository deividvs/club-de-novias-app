import { Link } from 'react-router-dom'
import { PlusCircle, Calendar as CalIcon, MessageCircle, Library, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppContext } from '@/context/app-context'
import { formatCurrency, getDaysLeft } from '@/lib/utils'
import { toast } from 'sonner'

export default function Index() {
  const { user, tasks, expenses, toggleTask } = useAppContext()

  const daysLeft = getDaysLeft(user.weddingDate)
  const totalSpent = expenses.reduce(
    (acc, curr) => acc + (curr.amountActual || curr.amountPlanned || 0),
    0,
  )
  const completedTasks = tasks.filter((t) => t.completed).length
  const urgentTasks = tasks.filter((t) => !t.completed).slice(0, 3)

  const handleComplete = (id: string) => {
    toggleTask(id)
    toast.success('Tarefa concluída com sucesso! 🎉')
  }

  return (
    <div className="container max-w-4xl py-6 md:py-10 space-y-8 animate-slide-up-fade">
      <header className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          Bom dia, {user.name || 'Noiva'}
        </h1>
        <p className="text-muted-foreground">
          Faltam <strong className="text-primary">{daysLeft} dias</strong> para o seu casamento.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-2 shadow-warm bg-card border-none">
          <CardContent className="p-5 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Orçamento</h3>
            <p className="text-2xl font-display font-semibold">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mb-3">
              de {formatCurrency(user.totalBudget)}
            </p>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${Math.min((totalSpent / user.totalBudget) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-warm bg-card border-none">
          <CardContent className="p-5 flex flex-col justify-center h-full items-center text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tarefas</h3>
            <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center text-lg font-bold">
              {completedTasks}
            </div>
            <p className="text-xs mt-2 text-muted-foreground">de {tasks.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-warm bg-primary border-none text-primary-foreground">
          <CardContent className="p-5 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium opacity-80 mb-1">Decisão Crítica</h3>
            <p className="font-medium text-sm line-clamp-2">
              {urgentTasks[0]?.title || 'Tudo em dia!'}
            </p>
            <Link to="/cronograma" className="text-xs underline mt-2 opacity-90 hover:opacity-100">
              Ver detalhes
            </Link>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-2xl">Próximos Passos</h2>
          <Link to="/cronograma" className="text-sm text-primary font-medium hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="space-y-3">
          {urgentTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">Nenhuma tarefa pendente. Relaxe!</p>
          ) : (
            urgentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 bg-card rounded-xl shadow-sm border border-border/50"
              >
                <button
                  onClick={() => handleComplete(task.id)}
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Circle className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-sm leading-tight">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.category} • Urgência: {task.priority}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">Acesso Rápido</h2>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-3 snap-x scrollbar-hide md:mx-0 md:px-0">
          {[
            { icon: PlusCircle, label: 'Add Gasto', to: '/orcamento' },
            { icon: CalIcon, label: 'Cronograma', to: '/cronograma' },
            { icon: MessageCircle, label: 'Comunidade', to: '/perfil' },
            { icon: Library, label: 'Biblioteca', to: '/biblioteca' },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="flex-shrink-0 w-24 h-24 bg-card rounded-xl shadow-warm flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 transition-colors snap-start"
            >
              <item.icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="text-center pt-6 pb-2 text-muted-foreground text-sm italic">
        "O planejamento traz paz para o dia mais especial da sua vida."
      </footer>
    </div>
  )
}
