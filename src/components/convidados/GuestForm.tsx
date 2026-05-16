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
    individual_cost: guest?.individual_cost || simulation.cost_per_person,
    notes: guest?.notes || '',
    manual_status: guest?.manual_status || 'auto',
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
        <Label>Nome do convidado</Label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Grupo de relacionamento</Label>
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
          <Label>Risco de climão se não convidar</Label>
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
          <Label>Presença provável</Label>
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
          <Label>Custo individual (R$)</Label>
          <Input
            type="number"
            value={formData.individual_cost || ''}
            onChange={(e) => setFormData({ ...formData, individual_cost: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status Manual (Forçar lista)</Label>
        <Select
          value={formData.manual_status}
          onValueChange={(v) => setFormData({ ...formData, manual_status: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Automático (pelo score)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automático (pelo score)</SelectItem>
            <SelectItem value="lista_ideal">Forçar na Lista Ideal</SelectItem>
            <SelectItem value="lista_enxuta">Forçar na Lista Enxuta</SelectItem>
            <SelectItem value="lista_sem_culpa">Forçar na Lista Sem Culpa</SelectItem>
            <SelectItem value="fora">Fora da lista sugerida</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground leading-tight mt-1">
          Use esta opção caso queira sobrepor a recomendação automática e forçar a presença deste
          convidado em um cenário específico.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Observações</Label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Alguma nota importante?"
        />
      </div>

      <Button type="submit" className="w-full bg-[#8a7a6c] hover:bg-[#726456]" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
