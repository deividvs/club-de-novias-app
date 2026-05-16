import { useState } from 'react'
import { Plus, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { BudgetChart } from '@/components/budget/BudgetChart'
import { useAppContext } from '@/context/app-context'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseCategory } from '@/lib/types'

const CATEGORIES: { name: ExpenseCategory; color: string; defaultTarget: number }[] = [
  { name: 'Espaço', color: 'hsl(var(--chart-1))', defaultTarget: 0.35 },
  { name: 'Comida', color: 'hsl(var(--chart-2))', defaultTarget: 0.25 },
  { name: 'Foto/Vídeo', color: 'hsl(var(--chart-3))', defaultTarget: 0.1 },
  { name: 'Roupas', color: 'hsl(var(--chart-4))', defaultTarget: 0.1 },
  { name: 'Decoração', color: 'hsl(var(--chart-5))', defaultTarget: 0.1 },
  { name: 'Cerimônia', color: 'hsl(113 10% 30%)', defaultTarget: 0.05 },
  { name: 'Convites', color: 'hsl(31 30% 60%)', defaultTarget: 0.02 },
  { name: 'Lua de Mel', color: 'hsl(40 20% 50%)', defaultTarget: 0.02 },
  { name: 'Outros', color: 'hsl(0 0% 50%)', defaultTarget: 0.01 },
]

export default function Orcamento() {
  const { user, expenses, addExpense, toggleExpensePaid, removeExpense } = useAppContext()
  const [open, setOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'Espaço',
    description: '',
    amount: '',
    vendorName: '',
  })

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  const chartData = CATEGORIES.map((cat) => ({
    name: cat.name,
    value: expenses.filter((e) => e.category === cat.name).reduce((acc, e) => acc + e.amount, 0),
    color: cat.color,
  })).filter((d) => d.value > 0)

  // If no expenses, show a small grey sliver for visuals
  if (chartData.length === 0)
    chartData.push({ name: 'Vazio', value: 1, color: 'hsl(var(--muted))' })

  const handleSave = () => {
    if (!newExpense.description || !newExpense.amount) return
    addExpense({
      id: Math.random().toString(),
      category: newExpense.category as ExpenseCategory,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      vendorName: newExpense.vendorName,
      date: new Date().toISOString(),
      paid: false,
    })
    setOpen(false)
    setNewExpense({ category: 'Espaço', description: '', amount: '', vendorName: '' })
  }

  const handleDelete = (id: string) => {
    removeExpense(id)
    toast.success('Despesa excluída com sucesso!')
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Orçamento</h1>
        <Button variant="outline" size="sm" className="gap-2 hidden md:flex">
          <Download className="w-4 h-4" /> Exportar PDF
        </Button>
      </div>

      <BudgetChart data={chartData} totalSpent={totalSpent} totalBudget={user.totalBudget} />

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="font-display text-2xl">Categorias</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Gasto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Ex: Fotógrafo principal"
                />
              </div>
              <div className="space-y-2">
                <Label>Fornecedor (Opcional)</Label>
                <Input
                  value={newExpense.vendorName}
                  onChange={(e) => setNewExpense({ ...newExpense, vendorName: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Total</Label>
                <Input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={handleSave} className="w-full mt-2">
                Salvar Gasto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          const catExpenses = expenses.filter((e) => e.category === cat.name)
          if (catExpenses.length === 0) return null
          const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0)
          const budgetTarget = user.totalBudget * cat.defaultTarget

          return (
            <Card key={cat.name} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <h3 className="font-medium text-sm">{cat.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(spent)}</span>
                    <span className="text-xs text-muted-foreground block">
                      Meta: {formatCurrency(budgetTarget)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {catExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between items-center bg-secondary/30 p-2 rounded text-sm"
                    >
                      <div>
                        <p className="font-medium">{exp.description}</p>
                        {exp.vendorName && (
                          <p className="text-xs text-muted-foreground">{exp.vendorName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatCurrency(exp.amount)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpensePaid(exp.id)}
                          className={`h-7 px-2 text-xs ${exp.paid ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}
                        >
                          {exp.paid ? 'Pago' : 'Pendente'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja excluir esta despesa?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A despesa será removida
                                permanentemente do seu orçamento.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(exp.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
