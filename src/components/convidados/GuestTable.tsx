import { useState } from 'react'
import type { GuestSimulation, Guest } from '@/services/convidados'
import { calculateScore, getScoreLabel } from '@/lib/guest-logic'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { GuestForm } from './GuestForm'
import { deleteGuest } from '@/services/convidados'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function GuestTable({
  simulation,
  guests,
}: {
  simulation: GuestSimulation
  guests: Guest[]
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este convidado?')) return
    try {
      await deleteGuest(id)
      toast.success('Convidado removido')
    } catch {
      toast.error('Erro ao remover')
    }
  }

  const openEdit = (g: Guest) => {
    setEditingGuest(g)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-medium">Lista de Convidados</h2>
        <Button
          onClick={() => {
            setEditingGuest(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Grupo</th>
                <th className="px-4 py-3 font-medium">Risco Social</th>
                <th className="px-4 py-3 font-medium">Presença</th>
                <th className="px-4 py-3 font-medium text-center">Score</th>
                <th className="px-4 py-3 font-medium">Recomendação</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Custo</th>
                <th className="px-4 py-3 font-medium text-right print:hidden">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum convidado adicionado ainda.
                  </td>
                </tr>
              ) : (
                guests.map((g) => {
                  const score = calculateScore(g, simulation.cost_per_person)
                  const cost = g.individual_cost || simulation.cost_per_person
                  return (
                    <tr key={g.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{g.name}</td>
                      <td className="px-4 py-3 capitalize">
                        {g.relationship_group.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 capitalize">{g.social_risk}</td>
                      <td className="px-4 py-3 capitalize">{g.presence_probability}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-mono bg-secondary/50 text-secondary-foreground">
                          {score}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getScoreLabel(score)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{g.manual_status || '-'}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        R$ {cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right print:hidden whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGuest ? 'Editar Convidado' : 'Novo Convidado'}</DialogTitle>
          </DialogHeader>
          <GuestForm
            simulation={simulation}
            guest={editingGuest}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
