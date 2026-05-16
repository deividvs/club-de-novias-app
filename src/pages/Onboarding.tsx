import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppContext } from '@/context/app-context'
import { Progress } from '@/components/ui/progress'

const CONCERNS = [
  'Estourar o orçamento',
  'Não dar tempo',
  'Pressão da família',
  'Não saber por onde começar',
  'Casamento parecer simples demais',
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const { user, setUser } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user.name || '',
    weddingDate: user.weddingDate || '',
    guestCount: user.guestCount || 100,
    totalBudget: user.totalBudget || 8000,
    locationCity: user.locationCity || '',
    locationState: user.locationState || '',
    concerns: user.concerns || ([] as string[]),
  })

  const updateForm = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }))

  const handleNext = () => {
    if (step < 6) setStep((s) => s + 1)
  }

  const handleFinish = async () => {
    setLoading(true)
    await setUser({ ...formData, onboarded: true })
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up-fade">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl text-primary font-semibold">Club de Novias</h1>
          <p className="text-muted-foreground text-sm">Do 'sim' ao altar, sem dívidas.</p>
        </div>

        <Progress value={(step / 6) * 100} className="h-2" />

        <Card className="shadow-warm border-none">
          <CardContent className="p-6 pt-8 min-h-[300px] flex flex-col justify-center">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-2xl text-center">Como devemos te chamar?</h2>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Seu nome"
                  className="text-center text-lg"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-2xl text-center">Quando será o grande dia?</h2>
                <Input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => updateForm('weddingDate', e.target.value)}
                  className="text-center"
                />
                <p className="text-xs text-center text-muted-foreground">
                  Não tem data? Deixe em branco para sugerirmos um cronograma de 9 meses.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl text-center">Quantos convidados?</h2>
                <div className="text-center text-3xl font-display font-semibold text-primary">
                  {formData.guestCount}
                </div>
                <Slider
                  value={[formData.guestCount]}
                  onValueChange={(v) => updateForm('guestCount', v[0])}
                  max={500}
                  min={20}
                  step={10}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-2xl text-center">Qual o seu orçamento total?</h2>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                  <Input
                    type="number"
                    value={formData.totalBudget}
                    onChange={(e) => updateForm('totalBudget', Number(e.target.value))}
                    className="pl-10 text-lg"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-2xl text-center mb-4">Onde será o casamento?</h2>
                <div className="space-y-3">
                  <Input
                    value={formData.locationCity}
                    onChange={(e) => updateForm('locationCity', e.target.value)}
                    placeholder="Cidade"
                    className="text-center"
                  />
                  <Input
                    value={formData.locationState}
                    onChange={(e) => updateForm('locationState', e.target.value)}
                    placeholder="Estado"
                    className="text-center"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-2xl text-center mb-4">
                  Qual sua maior preocupação?
                </h2>
                <div className="space-y-3">
                  {CONCERNS.map((c) => (
                    <Label
                      key={c}
                      className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <Checkbox
                        checked={formData.concerns.includes(c)}
                        onCheckedChange={(checked) => {
                          if (checked) updateForm('concerns', [...formData.concerns, c])
                          else
                            updateForm(
                              'concerns',
                              formData.concerns.filter((x) => x !== c),
                            )
                        }}
                      />
                      <span className="font-normal">{c}</span>
                    </Label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1"
              disabled={loading}
            >
              Voltar
            </Button>
          )}
          {step < 6 ? (
            <Button onClick={handleNext} className="flex-1" disabled={step === 1 && !formData.name}>
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Salvando...' : 'Ver meu plano →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
