import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SimulationData } from '@/lib/simulador-logic'

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
const PRIORITIES = [
  'Comida',
  'Fotografia',
  'Vestido',
  'Decoração',
  'Local',
  'Bolo',
  'Convite',
  'Lembrancinhas',
  'Cerimônia religiosa/civil',
]
const DIYS = [
  'Convites',
  'Decoração',
  'Lembrancinhas',
  'Buquê',
  'Mesa do bolo',
  'Plaquinhas e papelaria',
  'Arranjos simples',
]
const NON_NEGOTIABLES = [
  'Vestido dos sonhos',
  'Fotografia profissional',
  'Buffet/comida boa',
  'Local bonito',
  'Decoração marcante',
  'Bolo especial',
  'Cerimônia religiosa',
  'Maquiagem/cabelo profissional',
]

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
  })

  const toggleArray = (field: keyof SimulationData, value: string) => {
    const arr = data[field] as string[]
    setData({
      ...data,
      [field]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    })
  }

  const MultiSelect = ({
    label,
    options,
    field,
  }: {
    label: string
    options: string[]
    field: keyof SimulationData
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isSelected = (data[field] as string[]).includes(o)
          return (
            <Badge
              key={o}
              variant={isSelected ? 'default' : 'secondary'}
              className={`cursor-pointer transition-colors ${isSelected ? '' : 'hover:bg-muted-foreground/20'}`}
              onClick={() => toggleArray(field, o)}
            >
              {o}
            </Badge>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in pb-10">
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

      <MultiSelect label="O que é Prioridade para vocês?" options={PRIORITIES} field="priorities" />
      <MultiSelect
        label="O que vocês farão no estilo DIY (Faça Você Mesmo)?"
        options={DIYS}
        field="diy"
      />
      <MultiSelect
        label="O que é Inegociável? (Não abro mão!)"
        options={NON_NEGOTIABLES}
        field="nonNegotiables"
      />

      <div className="flex gap-4 pt-4">
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
