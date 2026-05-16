import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    if (!email || !password) return toast.error('Preencha todos os campos')
    setLoading(true)
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)
    if (error) {
      if (isLogin && error?.status === 400) {
        toast.error('Erro de autenticação', {
          description: 'E-mail ou senha incorretos. Por favor, tente novamente.',
        })
      } else if (!isLogin && error?.response?.data?.email?.code === 'validation_not_unique') {
        setFieldErrors({
          email: 'Este e-mail já está em uso. Tente fazer login ou use outro e-mail.',
        })
      } else {
        toast.error('Erro de autenticação', {
          description: error.message || 'Verifique suas credenciais.',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm border-none animate-slide-up-fade">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="font-display text-4xl text-primary font-semibold">
            Club de Novias
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Faça login para continuar' : 'Crie sua conta e comece a planejar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                }
                required
              />
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-2 text-left">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 mt-2"
            >
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setFieldErrors({})
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
