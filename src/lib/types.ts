export type UserProfile = {
  name: string
  weddingDate: string | null
  guestCount: number
  totalBudget: number
  location: string
  concerns: string[]
  onboarded: boolean
}

export type TaskPriority = 'Alta' | 'Média' | 'Baixa'

export type Task = {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: string
  priority: TaskPriority
  category: string
}

export type ExpenseCategory =
  | 'Espaço'
  | 'Roupas'
  | 'Cerimônia'
  | 'Decoração'
  | 'Foto/Vídeo'
  | 'Convites'
  | 'Comida'
  | 'Lua de Mel'
  | 'Outros'

export type Expense = {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
  paid: boolean
  vendorName: string
  date: string
}
