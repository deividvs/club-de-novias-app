import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Printer, ArrowLeft, Heart, Hand, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { SimulationResultData, SimulationData } from '@/lib/simulador-logic'

interface SimulationResultProps {
  data: SimulationData
  result: SimulationResultData
  onBack: () => void
}

export function SimulationResult({ data, result, onBack }: SimulationResultProps) {
  const getViabilityColor = (v: string) => {
    if (v === 'Muito apertado') return 'bg-red-50 text-red-700 border-red-200'
    if (v === 'Econômico possível') return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (v === 'Confortável para casamento simples')
      return 'bg-green-50 text-green-700 border-green-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const getLabelBadge = (label?: string | null) => {
    if (!label) return null
    if (label === 'Prioridade') {
      return (
        <Badge variant="default" className="gap-1 bg-amber-500 hover:bg-amber-600">
          <Heart className="w-3 h-3" /> Prioridade
        </Badge>
      )
    }
    if (label === 'DIY') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Hand className="w-3 h-3" /> DIY
        </Badge>
      )
    }
    if (label === 'Inegociável') {
      return (
        <Badge variant="outline" className="gap-1 border-primary text-primary">
          <ShieldCheck className="w-3 h-3" /> Inegociável
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 print:pb-0">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" /> Exportar PDF
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold">{data.name}</h2>
        <p className="text-muted-foreground">
          {formatCurrency(data.totalBudget)} para {data.guestCount} convidados • Estilo {data.style}
        </p>
      </div>

      <Card className={`border ${getViabilityColor(result.viability)}`}>
        <CardHeader className="pb-2">
          <CardTitle>Análise de Viabilidade: {result.viability}</CardTitle>
          <CardDescription className="text-current opacity-90">
            Custo por pessoa: {formatCurrency(result.costPerGuest)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{result.viabilityMessage}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição Inteligente do Orçamento</CardTitle>
          <CardDescription>
            Valores sugeridos baseados nas suas prioridades e escolhas estratégicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 font-medium rounded-tl-md">Categoria</th>
                <th className="p-3 font-medium">%</th>
                <th className="p-3 font-medium">Valor Sugerido</th>
                <th className="p-3 font-medium rounded-tr-md">Dica Estratégica</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.categories.map((c) => (
                <tr
                  key={c.name}
                  className={`hover:bg-muted/30 ${c.label === 'Inegociável' ? 'bg-primary/5' : ''}`}
                >
                  <td className="p-3 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {c.name}
                      {getLabelBadge(c.label)}
                    </div>
                  </td>
                  <td className="p-3">{c.percentage.toFixed(1)}%</td>
                  <td className="p-3 font-semibold text-primary">{formatCurrency(c.value)}</td>
                  <td className="p-3 text-muted-foreground min-w-[200px]">{c.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cenários Alternativos: E se você reduzir a lista?</CardTitle>
          <CardDescription>
            Veja o impacto de ter menos convidados no seu orçamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {result.alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center text-center"
              >
                <span className="text-xl font-bold">{alt.guests} convidados</span>
                <span className="text-sm text-muted-foreground mt-1">
                  O custo por pessoa vai para:
                </span>
                <span className="text-lg font-semibold text-primary mt-2">
                  {formatCurrency(alt.costPerGuest)}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  Se você reduzir para {alt.guests} convidados, seu orçamento por pessoa sobe para{' '}
                  {formatCurrency(alt.costPerGuest)}.
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
