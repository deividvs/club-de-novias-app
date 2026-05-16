import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Category =
  | 'Espaço'
  | 'Roupas'
  | 'Cerimônia'
  | 'Decoração'
  | 'Foto/Vídeo'
  | 'Convites'
  | 'Comida'
  | 'Lua de Mel'
  | 'Outros'

export type Task = {
  id: string
  desc: string
  completed: boolean
  dueDate: string
  priority: 'Alta' | 'Média' | 'Baixa'
}
export type Expense = {
  id: string
  category: Category
  desc: string
  value: number
  paid: number
  vendor: string
  date: string
}

export type AppState = {
  hasCompletedOnboarding: boolean
  name: string
  weddingDate: string | null
  guestCount: number
  totalBudget: number
  location: string
  concerns: string[]
  tasks: Task[]
  expenses: Expense[]
}

type AppStore = AppState & {
  completeOnboarding: (data: Partial<AppState>) => void
  toggleTask: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateProfile: (data: Partial<AppState>) => void
}

const initialState: AppState = {
  hasCompletedOnboarding: false,
  name: '',
  weddingDate: null,
  guestCount: 100,
  totalBudget: 8000,
  location: '',
  concerns: [],
  tasks: [],
  expenses: [],
}

const AppContext = createContext<AppStore | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('clubdenovias_state')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return initialState
      }
    }
    return initialState
  })

  useEffect(() => {
    localStorage.setItem('clubdenovias_state', JSON.stringify(state))
  }, [state])

  const generateTasks = (weddingDate: string | null) => {
    const targetDate = weddingDate
      ? new Date(weddingDate)
      : new Date(Date.now() + 9 * 30 * 24 * 60 * 60 * 1000)
    const tasks: Task[] = [
      {
        id: '1',
        desc: 'Definir o orçamento total',
        completed: true,
        dueDate: new Date(targetDate.getTime() - 240 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
      {
        id: '2',
        desc: 'Contratar local da cerimônia e festa',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
      {
        id: '3',
        desc: 'Fechar com equipe de Foto e Vídeo',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
      {
        id: '4',
        desc: 'Escolher vestido de noiva',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Média',
      },
      {
        id: '5',
        desc: 'Contratar buffet',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 140 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
      {
        id: '6',
        desc: 'Definir lista de convidados',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Média',
      },
      {
        id: '7',
        desc: 'Enviar Save the Date',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Média',
      },
      {
        id: '8',
        desc: 'Contratar decoração',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
      {
        id: '9',
        desc: 'Escolher bolo e doces',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Baixa',
      },
      {
        id: '10',
        desc: 'Confirmar presenças (RSVP)',
        completed: false,
        dueDate: new Date(targetDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Alta',
      },
    ]
    return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const completeOnboarding = (data: Partial<AppState>) => {
    setState((prev) => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
      tasks: generateTasks(data.weddingDate || prev.weddingDate),
    }))
  }

  const toggleTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }))
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: Math.random().toString(36).substr(2, 9) }],
    }))
  }

  const updateProfile = (data: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...data }))
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        ...state,
        completeOnboarding,
        toggleTask,
        addExpense,
        updateProfile,
      },
    },
    children,
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
