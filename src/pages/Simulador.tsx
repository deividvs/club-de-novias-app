import { useState, useEffect } from 'react'
import { Plus, Calculator, FileText, Copy, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

import { SimulationForm } from '@/components/simulador/SimulationForm'
import { SimulationResult } from '@/components/simulador/SimulationResult'
import { calculateSimulation, SimulationData } from '@/lib/simulador-logic'
import {
  createSimulation,
  updateSimulation,
  deleteSimulation,
  getSimulations,
} from '@/services/budget_simulations'
import { useAuth } from '@/hooks/use-auth'

type ViewMode = 'LIST' | 'FORM' | 'RESULT'

export default function Simulador() {
  const { user } = useAuth()
  const [weddingId, setWeddingId] = useState<string>('')
  const [simulations, setSimulations] = useState<any[]>([])
  const [mode, setMode] = useState<ViewMode>('LIST')
  const [currentSim, setCurrentSim] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    pb.collection('weddings')
      .getFirstListItem(`user_id = "${user.id}"`)
      .then((w) => {
        setWeddingId(w.id)
        return getSimulations(w.id)
      })
      .then((res) => setSimulations(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const handleSave = async (data: SimulationData) => {
    try {
      const results = calculateSimulation(data)
      const payload = {
        wedding_id: weddingId,
        name: data.name,
        total_budget: data.totalBudget,
        guest_count: data.guestCount,
        style: data.style,
        selections: {
          priorities: data.priorities,
          diy: data.diy,
          nonNegotiables: data.nonNegotiables,
          customItems: data.customItems,
          categoryLabels: data.categoryLabels,
          manualValues: data.manualValues,
        },
        results_json: results,
      }

      if (currentSim?.id) {
        await updateSimulation(currentSim.id, payload)
        toast.success('Simulação atualizada!')
      } else {
        await createSimulation(payload)
        toast.success('Simulação salva com sucesso!')
      }

      const updated = await getSimulations(weddingId)
      setSimulations(updated)
      setMode('LIST')
    } catch (e) {
      toast.error('Erro ao salvar simulação')
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta simulação?')) return
    await deleteSimulation(id)
    setSimulations(simulations.filter((s) => s.id !== id))
    toast.success('Simulação excluída')
  }

  const handleDuplicate = async (sim: any) => {
    try {
      const payload = { ...sim, id: undefined, name: `${sim.name} (Cópia)` }
      await createSimulation(payload)
      const updated = await getSimulations(weddingId)
      setSimulations(updated)
      toast.success('Simulação duplicada')
    } catch (e) {
      toast.error('Erro ao duplicar')
    }
  }

  const openNew = () => {
    setCurrentSim(null)
    setMode('FORM')
  }

  const openEdit = (sim: any) => {
    setCurrentSim(sim)
    setMode('FORM')
  }

  const openResult = (sim: any) => {
    setCurrentSim(sim)
    setMode('RESULT')
  }

  if (loading) return <div className="p-8">Carregando informações...</div>

  if (mode === 'FORM') {
    const initData: Partial<SimulationData> | undefined = currentSim
      ? {
          name: currentSim.name,
          totalBudget: currentSim.total_budget,
          guestCount: currentSim.guest_count,
          style: currentSim.style,
          priorities: currentSim.selections?.priorities || [],
          diy: currentSim.selections?.diy || [],
          nonNegotiables: currentSim.selections?.nonNegotiables || [],
          customItems: currentSim.selections?.customItems || [],
          categoryLabels: currentSim.selections?.categoryLabels || {},
          manualValues: currentSim.selections?.manualValues || {},
        }
      : undefined

    return (
      <div className="container max-w-3xl py-6">
        <h1 className="font-display text-3xl font-semibold mb-6">Nova Simulação</h1>
        <SimulationForm
          initialData={initData}
          onSave={handleSave}
          onCancel={() => setMode('LIST')}
        />
      </div>
    )
  }

  if (mode === 'RESULT' && currentSim) {
    const data: SimulationData = {
      name: currentSim.name,
      totalBudget: currentSim.total_budget,
      guestCount: currentSim.guest_count,
      style: currentSim.style,
      priorities: currentSim.selections?.priorities || [],
      diy: currentSim.selections?.diy || [],
      nonNegotiables: currentSim.selections?.nonNegotiables || [],
      customItems: currentSim.selections?.customItems || [],
      categoryLabels: currentSim.selections?.categoryLabels || {},
      manualValues: currentSim.selections?.manualValues || {},
    }
    return (
      <div className="container max-w-4xl py-6">
        <SimulationResult
          data={data}
          result={currentSim.results_json}
          onBack={() => setMode('LIST')}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-6 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2">
          Simulador de Orçamento do Casamento
        </h1>
        <p className="text-muted-foreground text-lg">
          Descubra como distribuir seu orçamento de forma inteligente para casar bonito sem se
          endividar.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Suas Simulações</h2>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Criar Simulação
        </Button>
      </div>

      {simulations.length === 0 ? (
        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center text-muted-foreground shadow-sm">
          <Calculator className="w-12 h-12 mb-4 opacity-20" />
          <p className="mb-4">Você ainda não criou nenhuma simulação inteligente.</p>
          <Button onClick={openNew} variant="outline">
            Começar Agora
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => (
            <Card key={sim.id} className="flex flex-col shadow-sm">
              <CardHeader>
                <CardTitle>{sim.name}</CardTitle>
                <CardDescription>
                  Criado em {new Date(sim.created).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orçamento</span>
                  <span className="font-medium">{formatCurrency(sim.total_budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convidados</span>
                  <span className="font-medium">{sim.guest_count}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span className="text-muted-foreground">Viabilidade</span>
                  <span className="font-medium text-primary">{sim.results_json?.viability}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t gap-2 flex-wrap bg-secondary/20">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openResult(sim)}
                  className="w-full mb-2 gap-2"
                >
                  <FileText className="w-4 h-4" /> Ver Resultado
                </Button>
                <div className="flex justify-between w-full px-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(sim)} title="Editar">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDuplicate(sim)}
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(sim.id)}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
