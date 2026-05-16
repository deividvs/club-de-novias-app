import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Field Validation
    const errors: { email?: string; password?: string; general?: string } = {}
    if (!email) {
      errors.email = 'O e-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'E-mail inválido'
    }

    if (!password) {
      errors.password = 'A senha é obrigatória'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password)
      setLoading(false)

      if (error) {
        const extractedErrors = extractFieldErrors(error)

        if (isLogin && (error?.status === 400 || error?.message === 'Failed to authenticate.')) {
          setFieldErrors({
            general: 'E-mail ou senha incorretos',
          })
        } else if (!isLogin && extractedErrors.email) {
          setFieldErrors({
            email: extractedErrors.email.includes('unique')
              ? 'Este e-mail já está em uso. Tente fazer login ou use outro e-mail.'
              : extractedErrors.email,
          })
        } else {
          toast.error(isLogin ? 'Erro no login' : 'Erro no cadastro', {
            description: error?.message || 'Verifique suas credenciais.',
          })
        }
      }
    } catch (err: any) {
      setLoading(false)
      toast.error('Erro inesperado', {
        description: err?.message || 'Ocorreu um erro ao processar sua solicitação.',
      })
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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2 text-left">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                }
              />
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-2 text-left">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                }
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            {fieldErrors.general && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
                {fieldErrors.general}
              </div>
            )}

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
