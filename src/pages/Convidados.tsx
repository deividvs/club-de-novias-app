import { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '@/context/app-context'
import {
  getGuestSimulations,
  getGuests,
  createGuestSimulation,
  createGuest,
  type GuestSimulation,
  type Guest,
} from '@/services/convidados'
import { SetupForm } from '@/components/convidados/SetupForm'
import { Dashboard } from '@/components/convidados/Dashboard'
import { GuestTable } from '@/components/convidados/GuestTable'
import { Scenarios } from '@/components/convidados/Scenarios'
import { MessageCard } from '@/components/convidados/MessageCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { FileText, Download, CopyPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function Convidados() {
  const { user } = useAppContext()
  const [simulations, setSimulations] = useState<GuestSimulation[]>([])
  const [simulation, setSimulation] = useState<GuestSimulation | null>(null)
  const [selectedSimId, setSelectedSimId] = useState<string>('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(
    async (simId?: string) => {
      if (!user?.weddingId) return
      try {
        const sims = await getGuestSimulations(user.weddingId)
        setSimulations(sims)
        if (sims.length > 0) {
          const targetSim = sims.find((s) => s.id === (simId || selectedSimId)) || sims[0]
          setSimulation(targetSim)
          if (!selectedSimId && !simId) setSelectedSimId(targetSim.id)
          const g = await getGuests(targetSim.id)
          setGuests(g)
        } else {
          setSimulation(null)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [user?.weddingId, selectedSimId],
  )

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('guest_simulations', () => {
    loadData()
  })
  useRealtime('guests', () => {
    loadData()
  })

  const handleDuplicate = async () => {
    if (!simulation || !user?.weddingId) return
    try {
      const novaSim = await createGuestSimulation({
        wedding_id: user.weddingId,
        name: simulation.name + ' (Cópia)',
        total_budget: simulation.total_budget,
        cost_per_person: simulation.cost_per_person,
        guest_budget_meta: simulation.guest_budget_meta,
      })
      for (const g of guests) {
        await createGuest({
          simulation_id: novaSim.id,
          name: g.name,
          relationship_group: g.relationship_group,
          social_risk: g.social_risk,
          presence_probability: g.presence_probability,
          individual_cost: g.individual_cost,
          notes: g.notes,
          manual_status: g.manual_status,
        })
      }
      toast.success('Cenário duplicado!')
      setSelectedSimId(novaSim.id)
      loadData(novaSim.id)
    } catch {
      toast.error('Erro ao duplicar')
    }
  }

  const exportCSV = () => {
    if (!guests.length) return
    const headers = ['Nome', 'Grupo', 'Risco', 'Presença', 'Custo', 'Status Manual', 'Notas']
    const rows = guests.map((g) =>
      [
        g.name,
        g.relationship_group,
        g.social_risk,
        g.presence_probability,
        g.individual_cost,
        g.manual_status,
        g.notes,
      ].join(','),
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'convidados.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <div className="p-8">Carregando...</div>
  if (!simulation) return <SetupForm onComplete={() => loadData()} />

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Lista Inteligente de Convidados
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Descubra quem realmente precisa estar no seu casamento e quanto cada escolha impacta no
            seu orçamento.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={selectedSimId}
            onValueChange={(id) => {
              setSelectedSimId(id)
              loadData(id)
            }}
          >
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {simulations.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleDuplicate} title="Duplicar Cenário">
            <CopyPlus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Exportar CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <FileText className="w-4 h-4 mr-2" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="print:hidden bg-secondary w-full justify-start overflow-x-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="lista">Lista Completa</TabsTrigger>
          <TabsTrigger value="cenarios">Cenários & Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Dashboard simulation={simulation} guests={guests} />
          <div className="print:hidden">
            <MessageCard />
          </div>
        </TabsContent>

        <TabsContent value="lista">
          <GuestTable simulation={simulation} guests={guests} />
        </TabsContent>

        <TabsContent value="cenarios">
          <Scenarios simulation={simulation} guests={guests} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
