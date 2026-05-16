import { useState } from 'react'
import { format, parseISO, isBefore, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useAppContext } from '@/context/app-context'
import { cn } from '@/lib/utils'

export default function Cronograma() {
  const { tasks, toggleTask } = useAppContext()
  const [activeTab, setActiveTab] = useState('mensal')

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  // Group tasks by month (e.g., "Maio 2024")
  const groupedByMonth = sortedTasks.reduce(
    (acc, task) => {
      const monthKey = format(parseISO(task.dueDate), 'MMMM yyyy', { locale: ptBR })
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(task)
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  const overdueTasks = sortedTasks.filter(
    (t) => !t.completed && isBefore(parseISO(t.dueDate), new Date()),
  )

  const TaskRow = ({ task }: { task: (typeof tasks)[0] }) => (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border bg-card transition-all',
        task.completed && 'opacity-60',
      )}
    >
      <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-primary">
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1">
        <p
          className={cn(
            'text-sm font-medium',
            task.completed && 'line-through text-muted-foreground',
          )}
        >
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</p>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-medium',
            task.priority === 'Alta'
              ? 'bg-red-100 text-red-700'
              : task.priority === 'Média'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-green-700',
          )}
        >
          {task.priority}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> {format(parseISO(task.dueDate), 'dd/MM')}
        </span>
      </div>
    </div>
  )

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold">Cronograma</h1>
        <p className="text-muted-foreground text-sm">Passo a passo para o grande dia.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger value="mensal">Visão Mensal</TabsTrigger>
          <TabsTrigger value="atrasadas">
            Atrasadas{' '}
            {overdueTasks.length > 0 && (
              <span className="ml-2 bg-destructive text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {overdueTasks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mensal" className="mt-6 space-y-4">
          <Accordion
            type="multiple"
            className="w-full space-y-3"
            defaultValue={[Object.keys(groupedByMonth)[0]]}
          >
            {Object.entries(groupedByMonth).map(([month, monthTasks]) => {
              const completedCount = monthTasks.filter((t) => t.completed).length
              const progress = Math.round((completedCount / monthTasks.length) * 100)

              return (
                <AccordionItem
                  key={month}
                  value={month}
                  className="border bg-card rounded-xl px-4 py-1 shadow-sm data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex flex-1 items-center justify-between pr-4">
                      <span className="font-display font-semibold text-lg capitalize">{month}</span>
                      <div className="flex items-center gap-3 text-sm font-normal text-muted-foreground">
                        <span>
                          {completedCount}/{monthTasks.length}
                        </span>
                        <div className="w-16 h-1.5 bg-secondary rounded-full hidden sm:block overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-2">
                    {monthTasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="atrasadas" className="mt-6">
          {overdueTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Excelente! Você não tem tarefas atrasadas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
