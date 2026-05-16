import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Download, LogOut, Heart } from 'lucide-react'
import { toast } from 'sonner'

export default function Profile() {
  const { name, totalBudget, guestCount, updateProfile } = useAppStore()
  const [formData, setFormData] = useState({
    name,
    budget: totalBudget.toString(),
    guests: guestCount.toString(),
  })

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      totalBudget: Number(formData.budget),
      guestCount: Number(formData.guests),
    })
    toast.success('Perfil atualizado com sucesso!')
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Perfil</h1>
      </header>

      <Card className="bg-gradient-to-r from-secondary/50 to-primary/10 border-primary/20 shadow-subtle">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> Comunidade VIP
            </h3>
            <p className="text-sm text-muted-foreground">Tire dúvidas no nosso grupo exclusivo.</p>
          </div>
          <Button className="shrink-0 bg-green-600 hover:bg-green-700 text-white shadow-sm">
            Acessar
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="text-lg font-serif">Detalhes do Casamento</CardTitle>
          <CardDescription>Edite as informações base do seu plano.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seu Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Orçamento (R$)</Label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Convidados</Label>
              <Input
                type="number"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="outline" className="justify-start text-muted-foreground bg-card">
          <Download className="w-4 h-4 mr-2" /> Exportar meus dados (LGPD)
        </Button>
        <Button
          variant="ghost"
          className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair do aplicativo
        </Button>
      </div>

      <div className="text-center pt-8 opacity-50 flex items-center justify-center gap-1 text-sm font-medium">
        Feito com <Heart className="w-3 h-3 text-red-500 fill-current" /> pelo Club de Novias
      </div>
    </div>
  )
}
