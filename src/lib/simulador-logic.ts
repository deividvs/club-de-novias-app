export interface SimulationData {
  name: string
  totalBudget: number
  guestCount: number
  city: string
  style: string
  priorities: string[]
  diy: string[]
  nonNegotiables: string[]
}

export interface CategoryResult {
  name: string
  percentage: number
  value: number
  tip: string
}

export interface SimulationResultData {
  categories: CategoryResult[]
  costPerGuest: number
  viability: string
  viabilityMessage: string
  alternatives: { guests: number; costPerGuest: number }[]
}

const BASE_DISTRIBUTION: Record<string, number> = {
  Local: 15,
  Comida: 25,
  'Traje e Beleza': 12,
  Fotografia: 12,
  Decoração: 12,
  Convite: 3,
  Bolo: 5,
  Lembrancinhas: 4,
  Cerimônia: 4,
  'Reserva de emergência': 8,
}

const PRIORITIES_MAP: Record<string, string> = {
  Comida: 'Comida',
  Fotografia: 'Fotografia',
  Vestido: 'Traje e Beleza',
  Decoração: 'Decoração',
  Local: 'Local',
  Bolo: 'Bolo',
  Convite: 'Convite',
  Lembrancinhas: 'Lembrancinhas',
  'Cerimônia religiosa/civil': 'Cerimônia',
}

const DIY_MAP: Record<string, string[]> = {
  Convites: ['Convite'],
  Decoração: ['Decoração'],
  Lembrancinhas: ['Lembrancinhas'],
  Buquê: ['Decoração'],
  'Mesa do bolo': ['Decoração'],
  'Plaquinhas e papelaria': ['Decoração', 'Convite'],
  'Arranjos simples': ['Decoração'],
}

const NON_NEGOTIABLE_MAP: Record<string, string> = {
  'Vestido dos sonhos': 'Traje e Beleza',
  'Fotografia profissional': 'Fotografia',
  'Buffet/comida boa': 'Comida',
  'Local bonito': 'Local',
  'Decoração marcante': 'Decoração',
  'Bolo especial': 'Bolo',
  'Cerimônia religiosa': 'Cerimônia',
  'Maquiagem/cabelo profissional': 'Traje e Beleza',
}

const BASE_TIPS: Record<string, string> = {
  Local:
    'Considere espaços que já incluam mobiliário ou opções não tradicionais para ótimo custo-benefício.',
  Comida: 'Ilhas gastronômicas ou coquetel volante com prato quente são escolhas estratégicas.',
  'Traje e Beleza': 'Aluguel ou compra de segunda mão ajudam a manter um orçamento inteligente.',
  Fotografia:
    'Invista no profissional para ter a melhor recordação, negocie pacotes sem álbuns impressos inicialmente.',
  Decoração: 'Use flores da estação, itens alugados e capriche no faça-você-mesmo (DIY).',
  Convite: 'Convites digitais são elegantes e não impactam negativamente seu planejamento.',
  Bolo: 'Um bolo cenográfico para as fotos e o de corte servido da cozinha ajudam na economia.',
  Lembrancinhas:
    'Itens comestíveis (como bem-casados ou suspiros) agradam a todos sem pesar no bolso.',
  Cerimônia: 'Taxas de cartório e igreja são fixas. Planeje bem as prioridades do casal.',
  'Reserva de emergência':
    'Essencial para um casamento econômico sem surpresas. Nunca zere esta reserva!',
}

export function calculateSimulation(data: SimulationData): SimulationResultData {
  const weights = { ...BASE_DISTRIBUTION }
  const costPerGuest = data.totalBudget / (data.guestCount || 1)

  if (costPerGuest < 100) {
    weights['Comida'] += 5
    weights['Decoração'] -= 2
    weights['Convite'] -= 1
    weights['Lembrancinhas'] -= 2
  }

  let surplus = 0
  const diyCats = new Set<string>()
  data.diy.forEach((item) => (DIY_MAP[item] || []).forEach((cat) => diyCats.add(cat)))

  const nonNegCats = new Set<string>()
  data.nonNegotiables.forEach((item) => {
    if (NON_NEGOTIABLE_MAP[item]) nonNegCats.add(NON_NEGOTIABLE_MAP[item])
  })

  diyCats.forEach((cat) => {
    if (!nonNegCats.has(cat)) {
      const reduction = weights[cat] * 0.4
      weights[cat] -= reduction
      surplus += reduction
    }
  })

  const priorityCats = new Set<string>()
  data.priorities.forEach((item) => {
    if (PRIORITIES_MAP[item]) priorityCats.add(PRIORITIES_MAP[item])
  })

  if (surplus > 0) {
    if (priorityCats.size > 0) {
      const perCat = surplus / priorityCats.size
      priorityCats.forEach((cat) => {
        weights[cat] += perCat
      })
    } else {
      weights['Reserva de emergência'] += surplus
    }
  }

  if (weights['Reserva de emergência'] < 5) {
    const diff = 5 - weights['Reserva de emergência']
    weights['Reserva de emergência'] = 5
    const others = Object.keys(weights).filter((k) => k !== 'Reserva de emergência')
    others.forEach((k) => {
      weights[k] -= diff / others.length
    })
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  Object.keys(weights).forEach((k) => {
    weights[k] = (weights[k] / totalWeight) * 100
  })

  let viability = '',
    viabilityMessage = ''
  if (costPerGuest < 100) {
    viability = 'Muito apertado'
    viabilityMessage =
      'Recomendamos reduzir a lista de convidados ou considerar um formato como apenas civil com recepção.'
  } else if (costPerGuest <= 180) {
    viability = 'Econômico possível'
    viabilityMessage = 'Com escolhas estratégicas e bastante DIY, é um cenário totalmente possível!'
  } else if (costPerGuest <= 300) {
    viability = 'Confortável para casamento simples'
    viabilityMessage =
      'Bom orçamento para realizar um evento elegante e confortável para os convidados.'
  } else {
    viability = 'Flexível'
    viabilityMessage = 'Orçamento folgado! Invista mais nos seus não-negociáveis com tranquilidade.'
  }

  const categories = Object.keys(weights)
    .map((k) => ({
      name: k,
      percentage: weights[k],
      value: (data.totalBudget * weights[k]) / 100,
      tip: BASE_TIPS[k],
    }))
    .sort((a, b) => b.value - a.value)

  const alternatives = [0.9, 0.8, 0.7].map((ratio) => {
    const guests = Math.round(data.guestCount * ratio)
    return { guests, costPerGuest: data.totalBudget / (guests || 1) }
  })

  return { categories, costPerGuest, viability, viabilityMessage, alternatives }
}
