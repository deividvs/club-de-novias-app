import { useState, useMemo } from 'react'
import { useAppStore, Category } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES: Category[] = [
  'Espaço',
  'Roupas',
  'Cerimônia',
  'Decoração',
  'Foto/Vídeo',
  'Convites',
  'Comida',
  'Lua de Mel',
  'Outros',
]

export default function Budget() {
  const { totalBudget, expenses, addExpense } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState<Category>('Espaço')
  const [val, setVal] = useState('')

  const handleSave = () => {
    if (!desc || !val) return
    addExpense({
      category: cat,
      desc,
      value: Number(val),
      paid: 0,
      vendor: '',
      date: new Date().toISOString(),
    })
    setIsOpen(false)
    setDesc('')
    setVal('')
    toast.success('Gasto adicionado com sucesso!')
  }

  const totalSpent = expenses.reduce((a, b) => a + b.value, 0)

  const chartData = useMemo(() => {
    return CATEGORIES.map((c) => {
      const sum = expenses.filter((e) => e.category === c).reduce((a, b) => a + b.value, 0)
      return { category: c, value: sum, fill: `var(--color-${c.replace(/\//g, '').toLowerCase()})` }
    }).filter((d) => d.value > 0)
  }, [expenses])

  const chartConfig = useMemo(() => {
    const config: any = { value: { label: 'Gasto' } }
    CATEGORIES.forEach((c, i) => {
      config[c.replace(/\//g, '').toLowerCase()] = {
        label: c,
        color: `hsl(var(--chart-${(i % 5) + 1}))`,
      }
    })
    return config
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-24 md:pb-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Orçamento</h1>
          <p className="text-muted-foreground">Controle seus gastos sem estresse.</p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="hidden md:flex shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Gasto
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Adicionar Gasto</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={cat} onValueChange={(v) => setCat(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Fotógrafo principal"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Estimado (R$)</Label>
                <Input
                  type="number"
                  placeholder="1500"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                />
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Gasto
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-48">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Nenhum gasto registrado.
              </div>
            )}
            <div className="w-full mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Gasto</span>
                <span className="font-bold">R$ {totalSpent.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orçamento Total</span>
                <span>R$ {totalBudget.toLocaleString('pt-BR')}</span>
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-serif">Despesas por Categoria</CardTitle>
            <Button variant="ghost" size="icon" title="Exportar">
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[300px] space-y-4 pr-2">
            {CATEGORIES.map((c) => {
              const catExpenses = expenses.filter((e) => e.category === c)
              const sum = catExpenses.reduce((a, b) => a + b.value, 0)
              if (sum === 0) return null
              return (
                <div key={c} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{c}</span>
                    <span>R$ {sum.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="pl-2 space-y-1 border-l-2 border-border/50 ml-1">
                    {catExpenses.map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between text-xs text-muted-foreground"
                      >
                        <span>{e.desc}</span>
                        <span>R$ {e.value.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {expenses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Sua lista está vazia.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="md:hidden fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-elevation z-40 bg-primary text-primary-foreground"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  )
}
