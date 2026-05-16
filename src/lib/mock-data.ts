import { addMonths, subMonths, format } from 'date-fns'
import type { Task, Expense } from './types'

export const LIBRARY_ARTICLES = [
  {
    category: 'Sistema 3C',
    title: 'O Método: Cortar, Trocar, Conservar',
    content:
      'Aprenda a classificar cada gasto do seu casamento. Corte o desnecessário, troque opções caras por criativas, e conserve o que é prioridade.',
  },
  {
    category: 'Scripts',
    title: 'Negociação com Buffet',
    content:
      'Olá [Nome], adoramos o espaço! Nosso orçamento para esta categoria é X. Existe a possibilidade de adequar o pacote retirando [item] para chegarmos neste valor?',
  },
  {
    category: 'Família',
    title: 'Lidando com palpites',
    content:
      'Mãe/Sogra, agradecemos muito a sugestão! Vamos avaliar com carinho, mas já fechamos o planejamento principal para manter nosso orçamento sob controle.',
  },
]

export const generateMockTasks = (weddingDateStr: string): Task[] => {
  const wDate = new Date(weddingDateStr || new Date())
  return [
    {
      id: '1',
      title: 'Definir lista de convidados inicial',
      description: 'Base para orçamentos.',
      completed: true,
      dueDate: format(subMonths(wDate, 10), 'yyyy-MM-dd'),
      priority: 'Alta',
      category: 'Planejamento',
    },
    {
      id: '2',
      title: 'Fechar local da festa',
      description: 'Garante a data.',
      completed: false,
      dueDate: format(subMonths(wDate, 9), 'yyyy-MM-dd'),
      priority: 'Alta',
      category: 'Espaço',
    },
    {
      id: '3',
      title: 'Contratar fotógrafo',
      description: 'Os melhores lotam rápido.',
      completed: false,
      dueDate: format(subMonths(wDate, 8), 'yyyy-MM-dd'),
      priority: 'Média',
      category: 'Foto/Vídeo',
    },
    {
      id: '4',
      title: 'Escolher vestido de noiva',
      description: 'Leva meses para ajustar.',
      completed: false,
      dueDate: format(subMonths(wDate, 7), 'yyyy-MM-dd'),
      priority: 'Alta',
      category: 'Roupas',
    },
    {
      id: '5',
      title: 'Enviar Save the Date',
      description: 'Avisar convidados de fora.',
      completed: false,
      dueDate: format(subMonths(wDate, 4), 'yyyy-MM-dd'),
      priority: 'Baixa',
      category: 'Convites',
    },
    {
      id: '6',
      title: 'Degustação do Buffet',
      description: 'Escolher o menu.',
      completed: false,
      dueDate: format(subMonths(wDate, 3), 'yyyy-MM-dd'),
      priority: 'Alta',
      category: 'Comida',
    },
    {
      id: '7',
      title: 'Revisão final de pagamentos',
      description: 'Evitar surpresas.',
      completed: false,
      dueDate: format(subMonths(wDate, 1), 'yyyy-MM-dd'),
      priority: 'Alta',
      category: 'Planejamento',
    },
  ]
}

export const initialExpenses: Expense[] = [
  {
    id: 'e1',
    category: 'Espaço',
    description: 'Sinal da Fazenda',
    amount: 3000,
    paid: true,
    vendorName: 'Fazenda Y',
    date: '2023-01-10',
  },
  {
    id: 'e2',
    category: 'Foto/Vídeo',
    description: 'Pacote Essencial',
    amount: 2500,
    paid: false,
    vendorName: 'Estúdio X',
    date: '2023-02-15',
  },
]
