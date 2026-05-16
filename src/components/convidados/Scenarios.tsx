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
      desc: 'Otimizada priorizando maior score e família.',
    },
    { name: 'Lista Enxuta', data: enxuta, desc: 'Apenas íntimos com score > 50 e alta presença.' },
    {
      name: "Lista 'Sem Culpa'",
      data: semCulpa,
      desc: 'Esta lista prioriza pessoas que realmente fazem parte da história de vocês...',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="border border-[#e8dfd5] rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#a09385] bg-[#fdfaf6]">
              <tr>
                <th className="px-4 py-3 font-medium">Cenário</th>
                <th className="px-4 py-3 font-medium text-center">Convidados</th>
                <th className="px-4 py-3 font-medium text-right">Custo estimado</th>
                <th className="px-4 py-3 font-medium text-right">Economia</th>
                <th className="px-4 py-3 font-medium">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd5]">
              {views.map((view) => {
                const cost = view.data.reduce((acc, g) => acc + g.cost, 0)
                const economy = totalOriginalCost - cost
                return (
                  <tr key={view.name} className="hover:bg-[#fdfaf6] transition-colors">
                    <td className="px-4 py-4 font-medium text-[#8a7a6c] whitespace-nowrap">
                      {view.name}
                    </td>
                    <td className="px-4 py-4 text-center text-[#5c544d]">{view.data.length}</td>
                    <td className="px-4 py-4 text-right whitespace-nowrap text-[#5c544d]">
                      R$ {cost.toFixed(2)}
                    </td>
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
