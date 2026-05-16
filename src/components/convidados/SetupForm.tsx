import { useState } from 'react'
import { useAppContext } from '@/context/app-context'
import { createGuestSimulation } from '@/services/convidados'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function SetupForm({ onComplete }: { onComplete: () => void }) {
  const { user } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [budget, setBudget] = useState(user?.totalBudget || 7000)
  const [cost, setCost] = useState(100)

  const budgetMeta = budget * 0.45

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.weddingId) return
    setLoading(true)
    try {
      await createGuestSimulation({
        wedding_id: user.weddingId,
        name: 'Simulação Inicial',
        total_budget: budget,
        cost_per_person: cost,
        guest_budget_meta: budgetMeta,
      })
      toast.success('Configuração salva com sucesso!')
      onComplete()
    } catch {
      toast.error('Erro ao salvar configuração')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-display font-bold text-primary mb-2">Configuração da Lista</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Para começar a otimizar seus convidados, precisamos de alguns dados financeiros base.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Orçamento Total (R$)</Label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Custo Estimado por Pessoa (R$)</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Meta para Convidados (R$)</Label>
            <Input type="number" value={budgetMeta} disabled />
            <p className="text-xs text-muted-foreground">
              Sugerimos entre 40% a 50% do orçamento total.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Iniciar Planejamento'}
          </Button>
        </form>
      </div>
    </div>
  )
}
