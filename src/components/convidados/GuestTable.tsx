import { useState } from 'react'
import type { GuestSimulation, Guest } from '@/services/convidados'
import { getScoreLabel, getScenarios } from '@/lib/guest-logic'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { GuestForm } from './GuestForm'
import { deleteGuest } from '@/services/convidados'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

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

  const { scored } = getScenarios(guests, simulation.cost_per_person, simulation.guest_budget_meta)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-medium text-[#8a7a6c]">Lista de Convidados</h2>
        <Button
          className="bg-[#8a7a6c] hover:bg-[#726456] text-white"
          onClick={() => {
            setEditingGuest(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      <div className="border border-[#e8dfd5] rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#a09385] bg-[#fdfaf6]">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Grupo</th>
                <th className="px-4 py-3 font-medium">Risco</th>
                <th className="px-4 py-3 font-medium">Presença</th>
                <th className="px-4 py-3 font-medium text-center">Score</th>
                <th className="px-4 py-3 font-medium">Recomendação</th>
                <th className="px-4 py-3 font-medium">Status (Lista)</th>
                <th className="px-4 py-3 font-medium text-right">Custo</th>
                <th className="px-4 py-3 font-medium text-right print:hidden">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd5]">
              {scored.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum convidado adicionado ainda.
                  </td>
                </tr>
              ) : (
                scored.map((g) => {
                  return (
                    <tr key={g.id} className="hover:bg-[#fdfaf6] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#5c544d]">{g.name}</td>
                      <td className="px-4 py-3 capitalize text-[#8a7a6c]">
                        {g.relationship_group.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 capitalize text-[#8a7a6c]">{g.social_risk}</td>
                      <td className="px-4 py-3 capitalize text-[#8a7a6c]">
                        {g.presence_probability}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-md border border-[#e8dfd5] px-2.5 py-0.5 text-xs font-semibold font-mono bg-white text-[#8a7a6c]">
                          {g.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium bg-[#fdfaf6] text-[#8a7a6c] border border-[#e8dfd5] whitespace-nowrap">
                          {getScoreLabel(g.score)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap',
                            g.auto_status.includes('Fora')
                              ? 'bg-red-50 text-red-700'
                              : 'bg-green-50 text-green-700',
                          )}
                        >
                          {g.auto_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap text-[#5c544d]">
                        R$ {g.cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right print:hidden whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                          <Edit2 className="w-4 h-4 text-[#8a7a6c]" />
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
            <DialogTitle className="text-[#8a7a6c]">
              {editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
            </DialogTitle>
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
