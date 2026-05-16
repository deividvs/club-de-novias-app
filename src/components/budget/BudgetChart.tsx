import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

type Props = {
  data: { name: string; value: number; color: string }[]
  totalSpent: number
  totalBudget: number
}

export function BudgetChart({ data, totalSpent, totalBudget }: Props) {
  const percentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100)

  return (
    <Card className="border-none shadow-warm overflow-hidden bg-card">
      <CardContent className="p-6 flex flex-col items-center justify-center relative">
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-display font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">Utilizado</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center w-full">
          <div className="flex justify-between w-full text-sm font-medium mb-1">
            <span>{formatCurrency(totalSpent)}</span>
            <span className="text-muted-foreground">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-destructive' : percentage > 70 ? 'bg-amber-400' : 'bg-primary'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
