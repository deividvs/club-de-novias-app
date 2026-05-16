import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'

type Article = {
  id: string
  title: string
  section: string
  content_markdown: string
}

export default function Biblioteca() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    pb.collection('library_articles')
      .getFullList({ sort: 'order' })
      .then((res) => setArticles(res as unknown as Article[]))
      .catch(console.error)
  }, [])

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(title)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categories = Array.from(new Set(articles.map((a) => a.section)))

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold">Biblioteca</h1>
        <p className="text-muted-foreground text-sm">
          Scripts, guias e dicas para planejar com inteligência.
        </p>
      </div>

      <div className="space-y-8 mt-6">
        {categories.map((cat) => (
          <section key={cat} className="space-y-4">
            <h2 className="font-display text-2xl flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-5 h-5 text-primary" /> {cat}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {articles
                .filter((a) => a.section === cat)
                .map((article) => (
                  <Card
                    key={article.id}
                    className="shadow-sm border-border/50 bg-card overflow-hidden"
                  >
                    <CardHeader className="bg-secondary/30 pb-3 p-4">
                      <CardTitle className="text-lg font-medium leading-tight">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 relative">
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {article.content_markdown}
                      </p>
                      <button
                        onClick={() => handleCopy(article.content_markdown, article.title)}
                        className="absolute bottom-3 right-3 p-2 bg-background border rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Copiar texto"
                      >
                        {copiedId === article.title ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        ))}
        {articles.length === 0 && (
          <div className="text-center text-muted-foreground py-10">Carregando artigos...</div>
        )}
      </div>
    </div>
  )
}
