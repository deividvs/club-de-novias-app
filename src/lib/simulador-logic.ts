export interface CustomItem {
  id: string
  name: string
  value: number
  label?: 'Prioridade' | 'DIY' | 'Inegociável' | null
}

export interface SimulationData {
  name: string
  totalBudget: number
  guestCount: number
  city: string
  style: string
  priorities?: string[]
  diy?: string[]
  nonNegotiables?: string[]
  customItems?: CustomItem[]
  categoryLabels?: Record<string, 'Prioridade' | 'DIY' | 'Inegociável' | null>
  manualValues?: Record<string, number>
}

export interface CategoryResult {
  name: string
  percentage: number
  value: number
  tip: string
  isCustom?: boolean
  label?: 'Prioridade' | 'DIY' | 'Inegociável' | null
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

  const customItems = data.customItems || []
  const categoryLabels = data.categoryLabels || {}
  const manualValues = data.manualValues || {}

  let remainingBudget = data.totalBudget

  const categories: CategoryResult[] = []

  customItems.forEach((item) => {
    remainingBudget -= item.value
    categories.push({
      name: item.name,
      percentage: 0,
      value: item.value,
      tip: 'Item personalizado',
      isCustom: true,
      label: item.label || null,
    })
  })

  if (Object.keys(categoryLabels).length === 0) {
    data.priorities?.forEach((p) => {
      if (PRIORITIES_MAP[p]) categoryLabels[PRIORITIES_MAP[p]] = 'Prioridade'
    })
    data.diy?.forEach((p) => {
      ;(DIY_MAP[p] || []).forEach((c) => (categoryLabels[c] = 'DIY'))
    })
    data.nonNegotiables?.forEach((p) => {
      if (NON_NEGOTIABLE_MAP[p]) categoryLabels[NON_NEGOTIABLE_MAP[p]] = 'Inegociável'
    })
  }

  let surplusWeight = 0
  const priorityCats = new Set<string>()

  Object.keys(weights).forEach((cat) => {
    const label = categoryLabels[cat]
    if (manualValues[cat] !== undefined && label === 'DIY') {
      remainingBudget -= manualValues[cat]
      categories.push({
        name: cat,
        percentage: 0,
        value: manualValues[cat],
        tip: BASE_TIPS[cat] || '',
        label: 'DIY',
      })
      delete weights[cat]
    } else if (label === 'DIY') {
      const reduction = weights[cat] * 0.4
      weights[cat] -= reduction
      surplusWeight += reduction
    } else if (label === 'Prioridade') {
      priorityCats.add(cat)
    } else if (label === 'Inegociável') {
      // highlighted as fixed cost
    }
  })

  if (surplusWeight > 0) {
    if (priorityCats.size > 0) {
      const perCat = surplusWeight / priorityCats.size
      priorityCats.forEach((cat) => {
        if (weights[cat]) weights[cat] += perCat
      })
    } else {
      if (weights['Reserva de emergência']) weights['Reserva de emergência'] += surplusWeight
    }
  }

  if (weights['Reserva de emergência'] !== undefined && weights['Reserva de emergência'] < 5) {
    const diff = 5 - weights['Reserva de emergência']
    weights['Reserva de emergência'] = 5
    const others = Object.keys(weights).filter((k) => k !== 'Reserva de emergência')
    if (others.length > 0) {
      others.forEach((k) => {
        weights[k] -= diff / others.length
      })
    }
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  Object.keys(weights).forEach((k) => {
    const val =
      remainingBudget > 0 && totalWeight > 0 ? (remainingBudget * weights[k]) / totalWeight : 0
    categories.push({
      name: k,
      percentage: 0,
      value: val,
      tip: BASE_TIPS[k] || '',
      label: categoryLabels[k] || null,
    })
  })

  categories.forEach((c) => {
    c.percentage = data.totalBudget > 0 ? (c.value / data.totalBudget) * 100 : 0
  })

  categories.sort((a, b) => b.value - a.value)

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

  const alternatives = [0.9, 0.8, 0.7].map((ratio) => {
    const guests = Math.round(data.guestCount * ratio)
    return { guests, costPerGuest: data.totalBudget / (guests || 1) }
  })

  return { categories, costPerGuest, viability, viabilityMessage, alternatives }
}
