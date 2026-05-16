import React, { createContext, useContext, useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'

export type UserProfile = {
  id?: string
  name: string
  weddingDate: string | null
  guestCount: number
  totalBudget: number
  locationCity: string
  locationState: string
  concerns: string[]
  onboarded: boolean
}

export type Task = {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
  completed: boolean
}

export type Expense = {
  id: string
  category: string
  description: string
  amountPlanned: number
  amountActual: number
  amountPaid: number
  vendorName: string
  status: 'pending' | 'partial' | 'paid'
  notes: string
}

type AppContextType = {
  user: UserProfile
  setUser: (profileData: Partial<UserProfile>) => Promise<void>
  tasks: Task[]
  toggleTask: (id: string) => void
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, data: Partial<Expense>) => void
  toggleExpensePaid: (id: string) => void
  removeExpense: (id: string) => void
  isLoaded: boolean
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    weddingDate: null,
    guestCount: 100,
    totalBudget: 8000,
    locationCity: '',
    locationState: '',
    concerns: [],
    onboarded: false,
  })
  const [weddingId, setWeddingId] = useState<string | null>(null)

  const [tasks, setTasks] = useState<Task[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  const loadWedding = async () => {
    if (!isAuthenticated || !authUser) {
      setIsLoaded(true)
      return
    }
    try {
      const records = await pb
        .collection('weddings')
        .getFullList({ filter: `user_id = "${authUser.id}"` })
      if (records.length > 0) {
        const w = records[0]
        setWeddingId(w.id)
        setUserProfile({
          id: w.id,
          name: w.bride_name,
          weddingDate: w.wedding_date ? w.wedding_date.split(' ')[0] : null,
          guestCount: w.guest_count,
          totalBudget: w.total_budget,
          locationCity: w.location_city,
          locationState: w.location_state,
          concerns: w.top_concerns || [],
          onboarded: w.onboarding_completed,
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoaded(true)
    }
  }

  const loadTasks = async () => {
    if (!weddingId) return
    try {
      const records = await pb
        .collection('tasks')
        .getFullList({ filter: `wedding_id = "${weddingId}"`, sort: '+due_date' })
      setTasks(
        records.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          category: r.category,
          priority: r.priority,
          dueDate: r.due_date,
          status: r.status,
          completed: r.status === 'completed',
        })),
      )
    } catch {
      /* intentionally ignored */
    }
  }

  const loadExpenses = async () => {
    if (!weddingId) return
    try {
      const records = await pb
        .collection('expenses')
        .getFullList({ filter: `wedding_id = "${weddingId}"`, sort: '-created' })
      setExpenses(
        records.map((r) => ({
          id: r.id,
          category: r.category,
          description: r.description,
          amountPlanned: r.amount_planned,
          amountActual: r.amount_actual,
          amountPaid: r.amount_paid,
          vendorName: r.vendor_name,
          status: r.status,
          notes: r.notes,
        })),
      )
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    if (isAuthenticated) loadWedding()
  }, [isAuthenticated, authUser])

  useEffect(() => {
    if (weddingId) {
      loadTasks()
      loadExpenses()
    }
  }, [weddingId])

  useRealtime('weddings', () => loadWedding())
  useRealtime('tasks', () => loadTasks())
  useRealtime('expenses', () => loadExpenses())

  const setUser = async (profileData: Partial<UserProfile>) => {
    if (!authUser) return
    try {
      const isNewOnboarding = !weddingId && profileData.onboarded
      const payload = {
        user_id: authUser.id,
        bride_name: profileData.name ?? userProfile.name,
        wedding_date: profileData.weddingDate ? `${profileData.weddingDate} 12:00:00.000Z` : null,
        guest_count: profileData.guestCount ?? userProfile.guestCount,
        total_budget: profileData.totalBudget ?? userProfile.totalBudget,
        location_city: profileData.locationCity ?? userProfile.locationCity,
        location_state: profileData.locationState ?? userProfile.locationState,
        top_concerns: profileData.concerns ?? userProfile.concerns,
        onboarding_completed: profileData.onboarded ?? userProfile.onboarded,
      }

      let newWeddingId = weddingId
      if (newWeddingId) {
        await pb.collection('weddings').update(newWeddingId, payload)
      } else {
        const record = await pb.collection('weddings').create(payload)
        newWeddingId = record.id
        setWeddingId(newWeddingId)
        setUserProfile((prev) => ({ ...prev, id: newWeddingId }))
      }

      if (isNewOnboarding && newWeddingId) {
        const targetDate = profileData.weddingDate
          ? new Date(profileData.weddingDate)
          : new Date(Date.now() + 9 * 30 * 24 * 60 * 60 * 1000)
        const mockTasks = [
          {
            title: 'Definir lista de convidados',
            description: 'Base para orçamentos.',
            category: 'Planejamento',
            priority: 'high',
            due_date: new Date(targetDate.getTime() - 240 * 24 * 60 * 60 * 1000)
              .toISOString()
              .replace('T', ' '),
          },
          {
            title: 'Fechar local da festa',
            description: 'Garante a data.',
            category: 'Espaço',
            priority: 'high',
            due_date: new Date(targetDate.getTime() - 200 * 24 * 60 * 60 * 1000)
              .toISOString()
              .replace('T', ' '),
          },
          {
            title: 'Contratar fotógrafo',
            description: 'Os melhores lotam rápido.',
            category: 'Foto/Vídeo',
            priority: 'medium',
            due_date: new Date(targetDate.getTime() - 180 * 24 * 60 * 60 * 1000)
              .toISOString()
              .replace('T', ' '),
          },
          {
            title: 'Escolher vestido de noiva',
            description: 'Leva meses para ajustar.',
            category: 'Roupas',
            priority: 'high',
            due_date: new Date(targetDate.getTime() - 150 * 24 * 60 * 60 * 1000)
              .toISOString()
              .replace('T', ' '),
          },
        ]
        for (const t of mockTasks) {
          await pb.collection('tasks').create({ wedding_id: newWeddingId, ...t, status: 'pending' })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const toggleTask = async (id: string) => {
    const t = tasks.find((x) => x.id === id)
    if (!t) return
    const newStatus = t.status === 'completed' ? 'pending' : 'completed'
    await pb.collection('tasks').update(id, { status: newStatus })
  }

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!weddingId) return
    await pb.collection('expenses').create({
      wedding_id: weddingId,
      category: expense.category,
      description: expense.description,
      amount_planned: expense.amountPlanned,
      amount_actual: expense.amountActual,
      amount_paid: expense.amountPaid,
      vendor_name: expense.vendorName,
      status: expense.status,
      notes: expense.notes,
    })
  }

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const payload: any = {}
    if (data.category) payload.category = data.category
    if (data.description) payload.description = data.description
    if (data.amountPlanned !== undefined) payload.amount_planned = data.amountPlanned
    if (data.amountActual !== undefined) payload.amount_actual = data.amountActual
    if (data.amountPaid !== undefined) payload.amount_paid = data.amountPaid
    if (data.vendorName !== undefined) payload.vendor_name = data.vendorName
    if (data.status) payload.status = data.status
    if (data.notes !== undefined) payload.notes = data.notes

    await pb.collection('expenses').update(id, payload)
  }

  const toggleExpensePaid = async (id: string) => {
    const e = expenses.find((x) => x.id === id)
    if (!e) return
    const newStatus = e.status === 'paid' ? 'pending' : 'paid'
    const newAmountPaid = newStatus === 'paid' ? e.amountActual || e.amountPlanned : 0
    await pb.collection('expenses').update(id, { status: newStatus, amount_paid: newAmountPaid })
  }

  const removeExpense = async (id: string) => {
    await pb.collection('expenses').delete(id)
  }

  return (
    <AppContext.Provider
      value={{
        user: userProfile,
        setUser,
        tasks,
        toggleTask,
        expenses,
        addExpense,
        updateExpense,
        toggleExpensePaid,
        removeExpense,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
