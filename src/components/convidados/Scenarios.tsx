import type { GuestSimulation, Guest } from '@/services/convidados'
import { getScenarios } from '@/lib/guest-logic'

export function Scenarios({
  simulation,
  guests,
}: {
  simulation: GuestSimulation
  guests: Guest[]
}) {
  const { completa, ideal, enxuta, semCulpa } = getScenarios(
    guests,
    simulation.cost_per_person,
    simulation.guest_budget_meta,
  )

  const totalOriginalCost = completa.reduce((acc, g) => acc + g.cost, 0)

  const views = [
    { name: 'Lista Completa', data: completa, desc: 'Todos registrados sem cortes.' },
    {
      name: `Lista Ideal (Meta R$ ${simulation.guest_budget_meta})`,
      data: ideal,
      desc: 'Otimizada priorizando maior score.',
    },
    { name: 'Lista Enxuta', data: enxuta, desc: 'Apenas íntimos e score > 50.' },
    { name: "Lista 'Sem Culpa'", data: semCulpa, desc: 'Sem obrigações sociais.' },
  ]

  return (
    <div className="space-y-6">
      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium">Cenário</th>
                <th className="px-4 py-3 font-medium text-center">Convidados</th>
                <th className="px-4 py-3 font-medium text-right">Custo estimado</th>
                <th className="px-4 py-3 font-medium text-right">Economia</th>
                <th className="px-4 py-3 font-medium">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {views.map((view) => {
                const cost = view.data.reduce((acc, g) => acc + g.cost, 0)
                const economy = totalOriginalCost - cost
                return (
                  <tr key={view.name} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-primary whitespace-nowrap">
                      {view.name}
                    </td>
                    <td className="px-4 py-4 text-center">{view.data.length}</td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">R$ {cost.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-green-600 font-medium whitespace-nowrap">
                      {economy > 0 ? `R$ ${economy.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground text-xs min-w-[200px]">
                      {view.desc}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
