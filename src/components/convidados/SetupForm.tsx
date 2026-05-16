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
  const [budget, setBudget] = useState(user?.totalBudget?.toString() || '7000')
  const [cost, setCost] = useState('100')
  const [meta, setMeta] = useState('')

  const numBudget = Number(budget) || 0
  const numCost = Number(cost) || 0
  const recommendedCapacity = numCost > 0 ? Math.floor(numBudget / numCost) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.weddingId) return
    setLoading(true)

    const finalMeta = meta ? Number(meta) : numBudget * 0.45

    try {
      await createGuestSimulation({
        wedding_id: user.weddingId,
        name: 'Simulação Inicial',
        total_budget: numBudget,
        cost_per_person: numCost,
        guest_budget_meta: finalMeta,
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
        <h2 className="text-2xl font-display font-bold text-[#8a7a6c] mb-2">
          Configuração da Lista
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Para começar a otimizar seus convidados, precisamos de alguns dados financeiros base.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Orçamento Total do Casamento (R$)</Label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Custo Estimado por Pessoa (R$)</Label>
            <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
          </div>

          {numCost > 0 && numBudget > 0 && (
            <div className="p-3 bg-[#fdfaf6] border border-[#e8dfd5] rounded-md text-sm text-[#5c544d]">
              Capacidade recomendada:{' '}
              <strong className="text-[#8a7a6c]">{recommendedCapacity} convidados</strong>
            </div>
          )}

          <div className="space-y-2">
            <Label>Meta de Orçamento para Convidados (Opcional)</Label>
            <Input
              type="number"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder={`Sugerido: R$ ${(numBudget * 0.4).toFixed(2)} a R$ ${(numBudget * 0.5).toFixed(2)}`}
            />
            <p className="text-xs text-muted-foreground">
              Sugerimos entre 40% a 50% do orçamento total. Se deixado em branco, usaremos 45%.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#8a7a6c] hover:bg-[#726456]"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Iniciar Planejamento'}
          </Button>
        </form>
      </div>
    </div>
  )
}
