import type { GuestSimulation, Guest } from '@/services/convidados'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, Users, DollarSign, TrendingDown } from 'lucide-react'

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

  const savingsColleagues = guests
    .filter((g) => g.relationship_group === 'colega')
    .reduce((acc, g) => acc + (g.individual_cost || simulation.cost_per_person), 0)

  const savingsObligations = guests
    .filter((g) => g.relationship_group === 'obrigação_social')
    .reduce((acc, g) => acc + (g.individual_cost || simulation.cost_per_person), 0)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Total de Convidados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{guests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" /> Custo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-foreground">
              R$ {totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Média atual: R$ {guests.length ? (totalCost / guests.length).toFixed(2) : 0} / pessoa
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn('border-l-4', {
            'border-l-green-500': budgetRatio <= 40,
            'border-l-yellow-500': budgetRatio > 40 && budgetRatio <= 55,
            'border-l-orange-500': budgetRatio > 55 && budgetRatio <= 75,
            'border-l-red-500': budgetRatio > 75,
          })}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
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

      <h3 className="text-lg font-medium mt-6 mb-3">Cartões de Economia</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-4 h-4" /> Se remover todos os colegas...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-600">
              Economiza R$ {savingsColleagues.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-4 h-4" /> Se remover obrigações sociais...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-600">
              Economiza R$ {savingsObligations.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
