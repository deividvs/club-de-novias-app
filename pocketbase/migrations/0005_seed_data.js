migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'deivid.dvs@gmail.com')
    } catch (_) {
      adminUser = new Record(users)
      adminUser.setEmail('deivid.dvs@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Admin')
      app.save(adminUser)
    }

    const articlesCol = app.findCollectionByNameOrId('library_articles')
    const articles = [
      {
        slug: 'sistema-3c',
        section: 'Sistema 3C',
        title: 'O Método: Cortar, Trocar, Conservar',
        content_markdown:
          'Aprenda a classificar cada gasto do seu casamento. Corte o desnecessário, troque opções caras por criativas, e conserve o que é prioridade.',
        order: 1,
      },
      {
        slug: 'negociacao-buffet',
        section: 'Scripts de Negociação',
        title: 'Negociação com Buffet',
        content_markdown:
          'Olá [Nome], adoramos o espaço! Nosso orçamento para esta categoria é X. Existe a possibilidade de adequar o pacote retirando [item] para chegarmos neste valor?',
        order: 2,
      },
      {
        slug: 'lidando-com-palpites',
        section: 'Família',
        title: 'Lidando com palpites',
        content_markdown:
          'Mãe/Sogra, agradecemos muito a sugestão! Vamos avaliar com carinho, mas já fechamos o planejamento principal para manter nosso orçamento sob controle.',
        order: 3,
      },
      {
        slug: 'guia-do-civil',
        section: 'Guias',
        title: 'Documentos para o Civil',
        content_markdown:
          'Documentos básicos para o casamento civil:\n- Certidão de Nascimento original\n- RG e CPF\n- Comprovante de Residência\n- Duas testemunhas maiores de 18 anos.',
        order: 4,
      },
    ]

    for (const a of articles) {
      try {
        app.findFirstRecordByData('library_articles', 'slug', a.slug)
      } catch (_) {
        const rec = new Record(articlesCol)
        rec.set('slug', a.slug)
        rec.set('section', a.section)
        rec.set('title', a.title)
        rec.set('content_markdown', a.content_markdown)
        rec.set('order', a.order)
        app.save(rec)
      }
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'deivid.dvs@gmail.com')
      app.delete(record)
    } catch (_) {}

    try {
      const articles = app.findRecordsByFilter('library_articles', "slug != ''", '', 100, 0)
      for (const a of articles) {
        app.delete(a)
      }
    } catch (_) {}
  },
)
