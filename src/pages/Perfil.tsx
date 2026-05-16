import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/context/app-context'
import { MessageCircle, Settings, LogOut, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function Perfil() {
  const { user, setUser } = useAppContext()
  const [formData, setFormData] = useState({
    name: user.name,
    weddingDate: user.weddingDate || '',
    guestCount: user.guestCount,
  })

  const handleSave = () => {
    setUser({ ...user, ...formData })
    toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas.' })
  }

  const handleReset = () => {
    if (confirm('Tem certeza? Isso apagará todo o seu progresso local.')) {
      localStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <h1 className="font-display text-3xl font-semibold">Seu Perfil</h1>

      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-medium flex items-center justify-center sm:justify-start gap-2 text-primary">
              <MessageCircle className="w-5 h-5" /> Comunidade VIP
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Troque dicas reais com outras noivas que usam o sistema 3C.
            </p>
          </div>
          <Button className="bg-[#25D366] hover:bg-[#20b858] text-white whitespace-nowrap">
            Entrar no Grupo
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5" /> Dados do Casamento
          </CardTitle>
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
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Convidados</Label>
              <Input
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
        <Button variant="outline" className="flex-1 text-muted-foreground gap-2">
          <Download className="w-4 h-4" /> Exportar Dados (LGPD)
        </Button>
        <Button
          variant="ghost"
          onClick={handleReset}
          className="flex-1 text-destructive hover:bg-destructive/10 gap-2"
        >
          <LogOut className="w-4 h-4" /> Resetar Aplicativo
        </Button>
      </div>
    </div>
  )
}
