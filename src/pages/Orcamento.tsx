import { useState } from 'react'
import { Plus, Download, Trash2, Pencil } from 'lucide-react'
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
import { useAppContext, Expense } from '@/context/app-context'
import { formatCurrency } from '@/lib/utils'

const CATEGORIES: { name: string; color: string; defaultTarget: number }[] = [
  { name: 'Espaço', color: 'hsl(var(--chart-1))', defaultTarget: 0.35 },
  { name: 'Comida/Bebida', color: 'hsl(var(--chart-2))', defaultTarget: 0.25 },
  { name: 'Foto/Vídeo', color: 'hsl(var(--chart-3))', defaultTarget: 0.1 },
  { name: 'Roupas', color: 'hsl(var(--chart-4))', defaultTarget: 0.1 },
  { name: 'Decoração', color: 'hsl(var(--chart-5))', defaultTarget: 0.1 },
  { name: 'Cerimônia', color: 'hsl(113 10% 30%)', defaultTarget: 0.05 },
  { name: 'Convites', color: 'hsl(31 30% 60%)', defaultTarget: 0.02 },
  { name: 'Lua de Mel', color: 'hsl(40 20% 50%)', defaultTarget: 0.02 },
  { name: 'Outros', color: 'hsl(0 0% 50%)', defaultTarget: 0.01 },
]

export default function Orcamento() {
  const { user, expenses, addExpense, updateExpense, toggleExpensePaid, removeExpense } =
    useAppContext()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newExpense, setNewExpense] = useState({
    category: 'Espaço',
    description: '',
    amountPlanned: '',
    amountActual: '',
    vendorName: '',
  })

  // We use amountPlanned to chart if amountActual is not defined or 0, so the progress behaves smoothly
  const totalSpent = expenses.reduce(
    (acc, curr) => acc + (curr.amountActual || curr.amountPlanned || 0),
    0,
  )

  const chartData = CATEGORIES.map((cat) => ({
    name: cat.name,
    value: expenses
      .filter((e) => e.category === cat.name)
      .reduce((acc, e) => acc + (e.amountActual || e.amountPlanned || 0), 0),
    color: cat.color,
  })).filter((d) => d.value > 0)

  if (chartData.length === 0)
    chartData.push({ name: 'Vazio', value: 1, color: 'hsl(var(--muted))' })

  const handleOpenNew = () => {
    setEditingId(null)
    setNewExpense({
      category: 'Espaço',
      description: '',
      amountPlanned: '',
      amountActual: '',
      vendorName: '',
    })
    setOpen(true)
  }

  const handleOpenEdit = (exp: Expense) => {
    setEditingId(exp.id)
    setNewExpense({
      category: exp.category,
      description: exp.description,
      amountPlanned: exp.amountPlanned ? exp.amountPlanned.toString() : '',
      amountActual: exp.amountActual ? exp.amountActual.toString() : '',
      vendorName: exp.vendorName || '',
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!newExpense.description || !newExpense.amountPlanned) return

    if (editingId) {
      updateExpense(editingId, {
        category: newExpense.category,
        description: newExpense.description,
        amountPlanned: Number(newExpense.amountPlanned),
        amountActual: Number(newExpense.amountActual || 0),
        vendorName: newExpense.vendorName,
      })
      toast.success('Gasto atualizado com sucesso!')
    } else {
      addExpense({
        category: newExpense.category,
        description: newExpense.description,
        amountPlanned: Number(newExpense.amountPlanned),
        amountActual: Number(newExpense.amountActual || 0),
        amountPaid: 0,
        vendorName: newExpense.vendorName,
        status: 'pending',
        notes: '',
      })
      toast.success('Gasto adicionado com sucesso!')
    }
    setOpen(false)
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
          <Button
            size="sm"
            onClick={handleOpenNew}
            className="gap-1 bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Gasto' : 'Novo Gasto'}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Planejado</Label>
                  <Input
                    type="number"
                    value={newExpense.amountPlanned}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amountPlanned: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Gasto Real</Label>
                  <Input
                    type="number"
                    value={newExpense.amountActual}
                    onChange={(e) => setNewExpense({ ...newExpense, amountActual: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
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
          const spent = catExpenses.reduce(
            (sum, e) => sum + (e.amountActual || e.amountPlanned || 0),
            0,
          )
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
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-secondary/30 p-3 rounded text-sm gap-2"
                    >
                      <div>
                        <p className="font-medium">{exp.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.vendorName ? `${exp.vendorName} • ` : ''}
                          Plan: {formatCurrency(exp.amountPlanned)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="font-medium">
                          {formatCurrency(exp.amountActual || exp.amountPlanned)}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpensePaid(exp.id)}
                          className={`h-7 px-2 text-xs ${exp.status === 'paid' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}
                        >
                          {exp.status === 'paid' ? 'Pago' : 'Pendente'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(exp)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
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
