import { useAppStore } from '@/stores/main'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Timeline() {
  const { tasks, toggleTask } = useAppStore()

  const handleToggle = (id: string) => {
    toggleTask(id)
  }

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const diffTime = new Date(task.dueDate).getTime() - Date.now()
      const diffMonths = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)))
      const key = diffMonths === 0 ? 'Este Mês' : `${diffMonths} Meses Antes`
      if (!acc[key]) acc[key] = []
      acc[key].push(task)
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-20 md:pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Cronograma</h1>
        <p className="text-muted-foreground">Suas tarefas organizadas passo a passo.</p>
      </header>

      <Tabs defaultValue="mes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
          <TabsTrigger value="mes">Visão Completa</TabsTrigger>
        </TabsList>

        <TabsContent value="semana" className="space-y-4">
          {tasks
            .filter((t) => !t.completed)
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 bg-card border rounded-xl shadow-sm"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggle(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{task.desc}</p>
                    {task.priority === 'Alta' && (
                      <Badge variant="destructive" className="text-[10px]">
                        Alta
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Vence em{' '}
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          {tasks.filter((t) => !t.completed).length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">
              Tudo em dia para esta semana!
            </div>
          )}
        </TabsContent>

        <TabsContent value="mes">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {Object.entries(groupedTasks).map(([month, monthTasks]) => {
              const completed = monthTasks.filter((t) => t.completed).length
              const percent = Math.round((completed / monthTasks.length) * 100)
              return (
                <AccordionItem
                  key={month}
                  value={month}
                  className="border bg-card rounded-xl px-4 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-serif text-lg font-bold">{month}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {completed}/{monthTasks.length}
                        </span>
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-3">
                    {monthTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 py-2 border-b last:border-0"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggle(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-sm',
                              task.completed && 'line-through text-muted-foreground',
                            )}
                          >
                            {task.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
