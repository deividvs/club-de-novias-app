import type { Guest } from '@/services/convidados'

export function calculateScore(guest: Guest, avgCost: number) {
  let score = 0
  if (guest.relationship_group === 'família_próxima') score += 40
  if (guest.relationship_group === 'amigo_íntimo') score += 35
  if (guest.relationship_group === 'colega') score += 15
  if (guest.relationship_group === 'obrigação_social') score += 5

  if (guest.social_risk === 'alto') score += 20
  if (guest.social_risk === 'médio') score += 10

  if (guest.presence_probability === 'confirmado') score += 20
  if (guest.presence_probability === 'alta') score += 15
  if (guest.presence_probability === 'média') score += 5
  if (guest.presence_probability === 'baixa') score -= 5
  if (guest.presence_probability === 'improvável') score -= 15

  const cost = guest.individual_cost || avgCost
  if (cost > avgCost) score -= 5

  return score
}

export function getScoreLabel(score: number) {
  if (score >= 70) return 'Essencial'
  if (score >= 50) return 'Muito importante'
  if (score >= 30) return 'Avaliar com carinho'
  if (score >= 10) return 'Pode ficar fora da lista principal'
  return 'Provável corte'
}

export function getScenarios(guests: Guest[], avgCost: number, budgetMeta: number) {
  const scored = guests.map((g) => ({
    ...g,
    score: calculateScore(g, avgCost),
    cost: g.individual_cost || avgCost,
    auto_status: '',
  }))

  const completa = [...scored]

  const ideal = []
  let sum = 0
  const sortedDesc = [...scored].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score
    const aFam =
      a.relationship_group === 'família_próxima' || a.relationship_group === 'amigo_íntimo' ? 1 : 0
    const bFam =
      b.relationship_group === 'família_próxima' || b.relationship_group === 'amigo_íntimo' ? 1 : 0
    return bFam - aFam
  })

  for (const g of sortedDesc) {
    if (sum + g.cost <= budgetMeta) {
      ideal.push(g)
      sum += g.cost
    }
  }

  const enxuta = scored.filter(
    (g) =>
      g.score > 50 &&
      (g.relationship_group === 'família_próxima' || g.relationship_group === 'amigo_íntimo') &&
      (g.presence_probability === 'confirmado' || g.presence_probability === 'alta'),
  )

  const semCulpa = scored.filter((g) => {
    if (g.relationship_group === 'obrigação_social' && g.social_risk === 'baixo') return false
    if (g.relationship_group === 'colega' && g.social_risk === 'baixo') return false
    if (g.presence_probability === 'improvável') return false
    return true
  })

  // Assign auto status
  for (const g of scored) {
    if (ideal.find((x) => x.id === g.id)) g.auto_status = 'Lista Ideal'
    else if (semCulpa.find((x) => x.id === g.id)) g.auto_status = 'Lista Sem Culpa'
    else if (enxuta.find((x) => x.id === g.id)) g.auto_status = 'Lista Enxuta'
    else g.auto_status = 'Fora da lista'

    if (g.manual_status === 'lista_ideal') g.auto_status = 'Lista Ideal (Manual)'
    if (g.manual_status === 'lista_enxuta') g.auto_status = 'Lista Enxuta (Manual)'
    if (g.manual_status === 'lista_sem_culpa') g.auto_status = 'Lista Sem Culpa (Manual)'
    if (g.manual_status === 'fora') g.auto_status = 'Fora da lista (Manual)'
  }

  // Generate the actual scenario lists considering the auto_status / manual overrides
  const finalIdeal = scored.filter((g) => g.auto_status.includes('Lista Ideal'))
  const finalEnxuta = scored.filter((g) => g.auto_status.includes('Lista Enxuta'))
  const finalSemCulpa = scored.filter((g) => g.auto_status.includes('Lista Sem Culpa'))

  return { completa, ideal: finalIdeal, enxuta: finalEnxuta, semCulpa: finalSemCulpa, scored }
}
