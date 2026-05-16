import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { SimulationData, CustomItem } from '@/lib/simulador-logic'
import { formatCurrency } from '@/lib/utils'

const STYLES = [
  'Minimalista',
  'Rústico',
  'Boho',
  'Clássico',
  'Vintage',
  'Civil com recepção simples',
  'Mini wedding',
  'Ao ar livre',
]

const DEFAULT_CATEGORIES = [
  'Local',
  'Comida',
  'Traje e Beleza',
  'Fotografia',
  'Decoração',
  'Convite',
  'Bolo',
  'Lembrancinhas',
  'Cerimônia',
  'Reserva de emergência',
]

const LABELS = ['Prioridade', 'DIY', 'Inegociável'] as const

interface SimulationFormProps {
  initialData?: Partial<SimulationData>
  onSave: (data: SimulationData) => void
  onCancel: () => void
}

export function SimulationForm({ initialData, onSave, onCancel }: SimulationFormProps) {
  const [data, setData] = useState<SimulationData>({
    name: initialData?.name || 'Minha Simulação',
    totalBudget: initialData?.totalBudget || 10000,
    guestCount: initialData?.guestCount || 100,
    city: initialData?.city || '',
    style: initialData?.style || 'Minimalista',
    priorities: initialData?.priorities || [],
    diy: initialData?.diy || [],
    nonNegotiables: initialData?.nonNegotiables || [],
    customItems: initialData?.customItems || [],
    categoryLabels: initialData?.categoryLabels || {},
    manualValues: initialData?.manualValues || {},
  })

  const [newItemName, setNewItemName] = useState('')
  const [newItemValue, setNewItemValue] = useState('')

  const handleAddCustomItem = () => {
    if (!newItemName || !newItemValue) return
    const newItem: CustomItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      value: Number(newItemValue),
    }
    setData((prev) => ({
      ...prev,
      customItems: [...(prev.customItems || []), newItem],
    }))
    setNewItemName('')
    setNewItemValue('')
  }

  const removeCustomItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      customItems: (prev.customItems || []).filter((item) => item.id !== id),
    }))
  }

  const updateCustomItemLabel = (id: string, label: string) => {
    setData((prev) => ({
      ...prev,
      customItems: (prev.customItems || []).map((item) =>
        item.id === id ? { ...item, label: (label === 'none' ? null : label) as any } : item,
      ),
    }))
  }

  const updateCategoryLabel = (cat: string, label: string) => {
    setData((prev) => ({
      ...prev,
      categoryLabels: {
        ...(prev.categoryLabels || {}),
        [cat]: label === 'none' ? null : (label as any),
      },
    }))
  }

  const updateManualValue = (cat: string, value: string) => {
    setData((prev) => {
      const newManual = { ...(prev.manualValues || {}) }
      if (!value) {
        delete newManual[cat]
      } else {
        newManual[cat] = Number(value)
      }
      return { ...prev, manualValues: newManual }
    })
  }

  const currentTotal = useMemo(() => {
    let customTotal = 0
    data.customItems?.forEach((item) => {
      customTotal += item.value
    })
    let manualTotal = 0
    Object.entries(data.manualValues || {}).forEach(([cat, val]) => {
      if (data.categoryLabels?.[cat] === 'DIY') {
        manualTotal += val
      }
    })
    return {
      customTotal,
      manualTotal,
      remaining: data.totalBudget - customTotal - manualTotal,
    }
  }, [data])

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome da Simulação</Label>
          <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Orçamento Total (R$)</Label>
          <Input
            type="number"
            value={data.totalBudget}
            onChange={(e) => setData({ ...data, totalBudget: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Número de Convidados</Label>
          <Input
            type="number"
            value={data.guestCount}
            onChange={(e) => setData({ ...data, guestCount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Estilo do Casamento</Label>
          <Select value={data.style} onValueChange={(v) => setData({ ...data, style: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo do Orçamento */}
      <div className="p-4 bg-primary/5 rounded-lg flex items-center justify-between border border-primary/20">
        <div>
          <p className="text-sm text-muted-foreground">Orçamento Disponível</p>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(currentTotal.remaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Preenchido</p>
          <p className="text-lg font-medium">
            {formatCurrency(currentTotal.customTotal + currentTotal.manualTotal)}
          </p>
        </div>
      </div>

      {/* Itens Personalizados */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Itens Personalizados</h3>
          <p className="text-sm text-muted-foreground">
            Adicione itens específicos que não estão na lista padrão.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-2 items-end">
          <div className="md:col-span-5 space-y-2">
            <Label>Nome do Item</Label>
            <Input
              placeholder="Ex: Banda, Assessoria"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              placeholder="0,00"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Button
              onClick={handleAddCustomItem}
              disabled={!newItemName || !newItemValue}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar Item
            </Button>
          </div>
        </div>

        {data.customItems && data.customItems.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.customItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-md bg-secondary/50 border"
              >
                <div className="flex-1 min-w-[150px]">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.value)}</p>
                </div>
                <div className="w-[180px]">
                  <Select
                    value={item.label || 'none'}
                    onValueChange={(v) => updateCustomItemLabel(item.id, v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Etiqueta..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem etiqueta</SelectItem>
                      {LABELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8"
                  onClick={() => removeCustomItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categorias Padrão */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Categorias Padrão</h3>
          <p className="text-sm text-muted-foreground">
            Classifique as categorias como Prioridade (mais dinheiro), DIY (você fará) ou
            Inegociável (custo fixo fundamental).
          </p>
        </div>

        <div className="grid gap-3">
          {DEFAULT_CATEGORIES.map((cat) => {
            const currentLabel = data.categoryLabels?.[cat] || 'none'
            return (
              <div
                key={cat}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-[150px] font-medium text-sm">{cat}</div>
                <div className="w-[180px]">
                  <Select value={currentLabel} onValueChange={(v) => updateCategoryLabel(cat, v)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Etiqueta..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Padrão</SelectItem>
                      {LABELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {currentLabel === 'DIY' ? (
                  <div className="w-[150px]">
                    <Input
                      type="number"
                      placeholder="Custo manual (R$)"
                      className="h-8"
                      value={data.manualValues?.[cat] || ''}
                      onChange={(e) => updateManualValue(cat, e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="w-[150px] text-xs text-muted-foreground text-center">
                    Cálculo automático
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button onClick={() => onSave(data)} className="flex-1">
          Calcular e Salvar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
