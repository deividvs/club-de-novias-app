import { useState } from 'react'
import type { GuestSimulation, Guest } from '@/services/convidados'
import { createGuest, updateGuest } from '@/services/convidados'
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
import { toast } from 'sonner'

export function GuestForm({
  simulation,
  guest,
  onSuccess,
}: {
  simulation: GuestSimulation
  guest: Guest | null
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    relationship_group: guest?.relationship_group || 'amigo_íntimo',
    social_risk: guest?.social_risk || 'baixo',
    presence_probability: guest?.presence_probability || 'alta',
    individual_cost: guest?.individual_cost || 0,
    notes: guest?.notes || '',
    manual_status: guest?.manual_status || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        simulation_id: simulation.id,
      }
      if (guest) {
        await updateGuest(guest.id, payload)
        toast.success('Atualizado!')
      } else {
        await createGuest(payload)
        toast.success('Adicionado!')
      }
      onSuccess()
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Grupo</Label>
          <Select
            value={formData.relationship_group}
            onValueChange={(v: any) => setFormData({ ...formData, relationship_group: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="família_próxima">Família Próxima</SelectItem>
              <SelectItem value="amigo_íntimo">Amigo Íntimo</SelectItem>
              <SelectItem value="colega">Colega</SelectItem>
              <SelectItem value="obrigação_social">Obrigação Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Risco de Exclusão</Label>
          <Select
            value={formData.social_risk}
            onValueChange={(v: any) => setFormData({ ...formData, social_risk: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="médio">Médio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Prob. de Presença</Label>
          <Select
            value={formData.presence_probability}
            onValueChange={(v: any) => setFormData({ ...formData, presence_probability: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="média">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="improvável">Improvável</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Custo (Opcional)</Label>
          <Input
            type="number"
            placeholder={String(simulation.cost_per_person)}
            value={formData.individual_cost || ''}
            onChange={(e) => setFormData({ ...formData, individual_cost: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status Manual</Label>
          <Input
            value={formData.manual_status}
            onChange={(e) => setFormData({ ...formData, manual_status: e.target.value })}
            placeholder="Ex: Pendente"
          />
        </div>
        <div className="space-y-2">
          <Label>Notas</Label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
