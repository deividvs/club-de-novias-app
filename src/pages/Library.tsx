import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { BookText, MessageCircle, Users, FileText, Palette, Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const SECTIONS = [
  {
    id: '1',
    title: 'Sistema 3C',
    desc: 'Cortar, Trocar, Conservar',
    icon: BookText,
    content:
      'O Sistema 3C é a base para não estourar o orçamento. \n\n1. Cortar: Elimine o que não faz sentido para vocês.\n2. Trocar: Substitua itens caros por alternativas.\n3. Conservar: Invista no que é prioridade máxima.',
  },
  {
    id: '2',
    title: 'Scripts de Negociação',
    desc: 'Textos prontos para fornecedores',
    icon: MessageCircle,
    content:
      'Use este script para pedir desconto:\n\n"Olá [Nome], adoramos o seu trabalho! Nosso orçamento atual para esta categoria é de R$ [Valor]. Existe alguma possibilidade de ajustarmos o pacote para chegarmos nesse valor?"',
  },
  {
    id: '3',
    title: 'Família',
    desc: 'Como lidar com palpites',
    icon: Users,
    content:
      'Quando alguém quiser convidar quem você não quer:\n\n"Nós adoraríamos convidar todo mundo, mas optamos por uma celebração mais íntima devido ao nosso orçamento. Contamos com sua compreensão!"',
  },
  {
    id: '4',
    title: 'Guia do Civil',
    desc: 'Documentos necessários',
    icon: FileText,
    content:
      'Documentos para o casamento civil:\n- Certidão de Nascimento original\n- RG e CPF\n- Comprovante de Residência\n- Duas testemunhas maiores de 18 anos.',
  },
  {
    id: '5',
    title: 'Paleta de Cores',
    desc: 'Inspirações visuais',
    icon: Palette,
    content:
      'Dica: Escolha 1 cor principal e 2 neutras de apoio. A cor Sage (Verde Sálvia) combina perfeitamente com tons de Nude, Terracota e Branco Off-white.',
  },
]

export default function Library() {
  const [activeArticle, setActiveArticle] = useState<(typeof SECTIONS)[0] | null>(null)

  const handleCopy = () => {
    if (activeArticle) {
      navigator.clipboard.writeText(activeArticle.content)
      toast.success('Texto copiado!')
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-20 md:pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Biblioteca</h1>
        <p className="text-muted-foreground">Guias, scripts e ferramentas para te ajudar.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((sec) => (
          <Card
            key={sec.id}
            className="cursor-pointer hover:shadow-md transition-shadow group shadow-subtle"
            onClick={() => setActiveArticle(sec)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <sec.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight mb-1 text-foreground">
                  {sec.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug">{sec.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!activeArticle} onOpenChange={(open) => !open && setActiveArticle(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          {activeArticle && (
            <>
              <SheetHeader className="text-left mb-6 shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center mb-4">
                  <activeArticle.icon className="w-6 h-6" />
                </div>
                <SheetTitle className="font-serif text-2xl">{activeArticle.title}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pb-6">
                <div className="prose prose-sm md:prose-base dark:prose-invert">
                  {activeArticle.content.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="shrink-0 pt-4 border-t flex gap-3 bg-background">
                <Button className="flex-1" variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" /> Copiar Texto
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Share2 className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
