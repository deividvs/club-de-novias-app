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
  if (score >= 30) return 'Avaliar com cuidado'
  if (score >= 10) return 'Cortável'
  return 'Provável corte'
}

export function getScenarios(guests: Guest[], avgCost: number, budgetMeta: number) {
  const scored = guests.map((g) => ({
    ...g,
    score: calculateScore(g, avgCost),
    cost: g.individual_cost || avgCost,
  }))

  const completa = [...scored]

  const ideal = []
  let sum = 0
  const sortedDesc = [...scored].sort((a, b) => b.score - a.score)
  for (const g of sortedDesc) {
    if (sum + g.cost <= budgetMeta) {
      ideal.push(g)
      sum += g.cost
    }
  }

  const enxuta = scored.filter(
    (g) =>
      g.score > 50 &&
      (g.relationship_group === 'família_próxima' || g.relationship_group === 'amigo_íntimo'),
  )

  const semCulpa = scored.filter((g) => {
    if (g.relationship_group === 'obrigação_social') return false
    if (g.relationship_group === 'colega' && g.social_risk === 'baixo') return false
    return true
  })

  return { completa, ideal, enxuta, semCulpa }
}
