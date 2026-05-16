import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function MessageCard() {
  const [copied, setCopied] = useState(false)

  const mensagem =
    'Estamos organizando uma celebração bem íntima, apenas para familiares e pessoas muito próximas... você é uma pessoa querida e ficamos felizes por fazer parte da nossa história.'

  const handleCopy = () => {
    navigator.clipboard.writeText(mensagem)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 bg-[#fdfaf6] border border-[#e8dfd5] p-6 rounded-xl relative">
      <h3 className="text-lg font-display font-bold text-[#8a7a6c] mb-3">Mensagem Elegante</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Use este modelo para avisar delicadamente pessoas que não poderão ser convidadas, mantendo a
        amizade e sem citar problemas financeiros.
      </p>

      <div className="bg-white p-4 rounded-lg border text-[#5c544d] italic font-serif relative">
        "{mensagem}"
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-[#8a7a6c] hover:bg-[#fdfaf6]"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
