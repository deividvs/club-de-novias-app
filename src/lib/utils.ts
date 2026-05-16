import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getDaysLeft(dateStr: string | null) {
  if (!dateStr) return 270 // default 9 months
  const diffTime = Math.abs(new Date(dateStr).getTime() - new Date().getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
