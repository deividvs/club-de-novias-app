import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile, Task, Expense } from '@/lib/types'
import { generateMockTasks, initialExpenses } from '@/lib/mock-data'

type AppContextType = {
  user: UserProfile
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  tasks: Task[]
  toggleTask: (id: string) => void
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  toggleExpensePaid: (id: string) => void
  removeExpense: (id: string) => void
}

const defaultUser: UserProfile = {
  name: '',
  weddingDate: null,
  guestCount: 100,
  totalBudget: 8000,
  location: '',
  concerns: [],
  onboarded: false,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cdn_user')
    return saved ? JSON.parse(saved) : defaultUser
  })

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cdn_tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('cdn_expenses')
    return saved ? JSON.parse(saved) : initialExpenses
  })

  useEffect(() => {
    localStorage.setItem('cdn_user', JSON.stringify(user))
    if (user.onboarded && tasks.length === 0) {
      setTasks(generateMockTasks(user.weddingDate || new Date().toISOString()))
    }
  }, [user, tasks.length])

  useEffect(() => {
    localStorage.setItem('cdn_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('cdn_expenses', JSON.stringify(expenses))
  }, [expenses])

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense])
  }

  const toggleExpensePaid = (id: string) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, paid: !e.paid } : e)))
  }

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tasks,
        toggleTask,
        expenses,
        addExpense,
        toggleExpensePaid,
        removeExpense,
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
