import type { GuestSimulation, Guest } from '@/services/convidados'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  DollarSign,
  TrendingDown,
  Wallet,
} from 'lucide-react'

export function Dashboard({
  simulation,
  guests,
}: {
  simulation: GuestSimulation
  guests: Guest[]
}) {
  const totalCost = guests.reduce(
    (acc, g) => acc + (g.individual_cost || simulation.cost_per_person),
    0,
  )
  const budgetRatio = simulation.total_budget > 0 ? (totalCost / simulation.total_budget) * 100 : 0

  let viabilityColor = 'text-green-600'
  let viabilityText = 'Dentro do orçamento'
  let ViabilityIcon = CheckCircle
  if (budgetRatio > 75) {
    viabilityColor = 'text-red-600'
    viabilityText = 'Inviável para casamento econômico'
    ViabilityIcon = AlertTriangle
  } else if (budgetRatio > 55) {
    viabilityColor = 'text-orange-500'
    viabilityText = 'Acima do recomendado'
    ViabilityIcon = AlertTriangle
  } else if (budgetRatio > 40) {
    viabilityColor = 'text-yellow-600'
    viabilityText = 'Atenção: orçamento pressionado'
    ViabilityIcon = Info
  }

  const colleagues = guests.filter((g) => g.relationship_group === 'colega')
  const obligations = guests.filter((g) => g.relationship_group === 'obrigação_social')

  const savingsColleagues = colleagues.reduce(
    (acc, g) => acc + (g.individual_cost || simulation.cost_per_person),
    0,
  )
  const savingsObligations = obligations.reduce(
    (acc, g) => acc + (g.individual_cost || simulation.cost_per_person),
    0,
  )

  const diffBudget = simulation.total_budget - totalCost
  const statusOrçamentoText = diffBudget >= 0 ? 'sobra' : 'passa'

  return (
    <div className="space-y-6">
      <Card className="bg-[#fdfaf6] border-[#e8dfd5] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-display font-bold text-[#8a7a6c] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#c8a97e]" /> Resumo Financeiro
          </CardTitle>
          <CardDescription className="text-[#a09385]">
            Impacto da sua lista de convidados no orçamento geral do casamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-[#5c544d]">
            Com <strong className="text-[#8a7a6c]">{guests.length}</strong> convidados a
            <strong className="text-[#8a7a6c]"> R$ {simulation.cost_per_person.toFixed(2)}</strong>{' '}
            por pessoa (em média), sua lista completa custa{' '}
            <strong className="text-[#8a7a6c]">R$ {totalCost.toFixed(2)}</strong>. Isso{' '}
            <strong className={diffBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
              {statusOrçamentoText}
            </strong>{' '}
            do seu orçamento total de
            <strong className="text-[#8a7a6c]"> R$ {simulation.total_budget.toFixed(2)}</strong>.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#8a7a6c]">
              <Users className="w-4 h-4 text-[#c8a97e]" /> Total de Convidados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-[#5c544d]">{guests.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#8a7a6c]">
              <DollarSign className="w-4 h-4 text-[#c8a97e]" /> Custo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-[#5c544d]">
              R$ {totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Média atual: R$ {guests.length ? (totalCost / guests.length).toFixed(2) : 0} / pessoa
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn('shadow-sm border-l-4', {
            'border-l-green-500': budgetRatio <= 40,
            'border-l-yellow-500': budgetRatio > 40 && budgetRatio <= 55,
            'border-l-orange-500': budgetRatio > 55 && budgetRatio <= 75,
            'border-l-red-500': budgetRatio > 75,
          })}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#8a7a6c]">
              <ViabilityIcon className={cn('w-4 h-4', viabilityColor)} /> Indicador de Viabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-xl font-semibold', viabilityColor)}>{viabilityText}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Comprometendo {budgetRatio.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-medium text-[#8a7a6c] mt-6 mb-3">
        Cartões de Economia Potencial
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-sm border-[#e8dfd5]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-4 h-4" /> Se remover {colleagues.length} colegas...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-600">
              Economiza R$ {savingsColleagues.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-[#e8dfd5]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-4 h-4" /> Se remover {obligations.length} obrigações
              sociais...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-600">
              Economiza R$ {savingsObligations.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {obligations.length > 5 && (
        <Card className="shadow-sm border-[#e8dfd5] bg-orange-50 mt-4">
          <CardContent className="pt-4 flex items-start gap-3 text-orange-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Recomendação:</strong> Sua lista tem muitos convidados por obrigação social (
              {obligations.length} pessoas). Considere reavaliar essas presenças para reduzir os
              custos em até R$ {savingsObligations.toFixed(2)}.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
