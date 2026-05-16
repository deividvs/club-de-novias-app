import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Plus, Wallet, CalendarDays, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function Dashboard() {
  const { name, weddingDate, totalBudget, expenses, tasks, toggleTask } = useAppStore()

  const daysLeft = weddingDate
    ? Math.max(0, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.value, 0)
  const budgetPercent = Math.min(100, (totalSpent / totalBudget) * 100)

  const pendingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  const urgentTasks = pendingTasks.slice(0, 3)
  const criticalTask = pendingTasks.find((t) => t.priority === 'Alta')

  const completedTasks = tasks.filter((t) => t.completed).length
  const taskPercent = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  const handleTaskToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    toggleTask(id)
    if (!task?.completed) {
      toast.success('Tarefa concluída! 🎉', { description: 'Um passo a mais para o grande dia.' })
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-20 md:pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground">
          {getGreeting()}, <span className="font-bold text-primary">{name || 'Noiva'}</span>
        </h1>
        <p className="text-muted-foreground">
          {weddingDate ? (
            <>
              Faltam <strong className="text-foreground">{daysLeft} dias</strong> para o seu
              casamento.
            </>
          ) : (
            <>Seu planejamento está em andamento.</>
          )}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-2 md:col-span-1 shadow-subtle border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold mb-2">
              R$ {totalSpent.toLocaleString('pt-BR')}
            </div>
            <Progress value={budgetPercent} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              de R$ {totalBudget.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1 shadow-subtle border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold mb-2">
              {completedTasks} / {tasks.length}
            </div>
            <Progress value={taskPercent} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">concluídas no total</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-subtle bg-secondary/30 border-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Decisão Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-foreground mb-3 line-clamp-1">
              {criticalTask?.desc || 'Tudo sob controle!'}
            </p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link to="/cronograma">
                Ver detalhes <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-serif text-xl font-bold">Tarefas Urgentes</h2>
          <div className="space-y-3">
            {urgentTasks.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa urgente no momento.</p>
            )}
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p
                    className={
                      task.completed ? 'line-through text-muted-foreground' : 'font-medium'
                    }
                  >
                    {task.desc}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vence em {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold">Acesso Rápido</h2>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start h-12 bg-card" asChild>
              <Link to="/orcamento">
                <Plus className="w-4 h-4 mr-2 text-primary" /> Adicionar Gasto
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12 bg-card" asChild>
              <Link to="/cronograma">
                <CalendarDays className="w-4 h-4 mr-2 text-primary" /> Ver Cronograma
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12 bg-card" asChild>
              <Link to="/biblioteca">
                <BookOpen className="w-4 h-4 mr-2 text-primary" /> Biblioteca
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-6 pb-2 text-center text-sm text-muted-foreground italic font-serif">
        "Planejar é trazer o futuro para o presente para que você possa fazer algo a respeito
        agora."
      </div>
    </div>
  )
}
