onRecordAfterCreateSuccess((e) => {
  const weddingId = e.record.id
  const tasksCollection = $app.findCollectionByNameOrId('tasks')

  const plannerTasks = [
    {
      category: '12 a 16 meses antes',
      titles: [
        'Defina a data',
        'Defina o orçamento',
        'Escolha o estilo de casamento',
        'Reserve a igreja',
        'Veja bastante inspirações na internet',
        'Esboce uma lista inicial de convidados',
      ],
    },
    {
      category: '11 a 9 meses antes',
      titles: [
        'Reserve o local e horário',
        'Contrate fotografia e filmagem',
        'Contrate assessoria/cerimonialista',
        'Contrate o DJ',
        'Defina a paleta de cores da sua decoração',
        'Pesquise destinos para sua lua de mel',
        'Feche o mobiliário e os demais itens de decoração',
        'Escolha o Convite',
        'Escolha padrinhos, daminhas e pajens',
        'Contrate buffet',
        'Separe os documentos do civil',
        'Comece a prova de vestidos',
      ],
    },
    {
      category: '8 a 6 meses antes',
      titles: [
        'Combine com quem irá te ajudar nos preparativos',
        'Reserve o salão pra cabelo e maquiagem',
        'Envie o Save The Date',
        'Monte seu cardápio',
        'Defina o celebrante do casamento',
        'Escolha seu vestido de noiva',
        'Comece a confecção dos convites',
        'Defina as roupas das madrinhas',
        'Feche os pacotes da lua de mel',
        'Faça o site do seu casamento',
      ],
    },
    {
      category: '5 a 3 meses antes',
      titles: [
        'Feche a lista de convidados',
        'Escolha e reserve bolo e buquê',
        'Faça a lista de presentes',
        'Escolha as músicas da cerimônia e festa',
        'Convide formalmente os padrinhos, damas e pajens',
        'Envie os convites aos que moram longe',
        'Defina a roupa do noivo',
        'Defina o penteado e acessórios da noiva',
        'Compre o sapato da noiva',
        'Defina as lembrancinhas',
        'Alinhe todos os detalhes com fornecedores',
      ],
    },
    {
      category: '2 meses antes',
      titles: [
        'Faça a prova do seu vestido, cabelo e maquiagem',
        'Dê entrada na documentação do civil',
        'Reserve o carro da noiva',
        'Escolha o porta alianças',
        'Confirme os serviços de todos os fornecedores',
        'Escolha as alianças',
        'Entregue os convites dos demais convidados',
        'Faça degustação do cardápio',
        'Defina o topo do bolo',
      ],
    },
    {
      category: '1 mês antes',
      titles: [
        'Confirme a presença dos convidados',
        'Alinhe os detalhes com a assessoria',
        'Compre tudo que você não tenha feito com DIY',
        'Confirme todos o detalhes da lua de mel',
        'Alinhe com o DJ todas as músicas',
        'Faça seu chá de cozinha/bar/panela',
        'Alinhe os detalhes com o fotógrafo e filmaker',
        'Alinhe os detalhes com o celebrante',
      ],
    },
    {
      category: '1 semana antes',
      titles: [
        'Última prova do vestido, maquiagem e cabelo',
        'Busque o vestido, buquê e lapelas',
        'Imprima e entregue o cronograma para ajudantes',
        'Re-confirme reservas da lua de mel',
        'Escrevam os votos',
        'Confirme o horário com os pais e padrinhos',
      ],
    },
    {
      category: '3 dias antes',
      titles: [
        'Faça depilação, sobrancelhas e limpeza de pele',
        'Separe os itens (sapato, véu, etc.)',
        'Alimente-se, descanse e se hidrate',
      ],
    },
    {
      category: '1 dia antes',
      titles: [
        'Faça as unhas (mãos e pés)',
        'Revise tudo o que for possível',
        'Separe os itens para o making of',
        'Relaxe (massagem, ioga ou meditação)',
      ],
    },
    {
      category: 'No grande dia',
      titles: [
        'Evite o estresse',
        'Tire fotos dos bastidores e da preparação',
        'Aproveite cada segundo',
      ],
    },
  ]

  for (const group of plannerTasks) {
    for (const title of group.titles) {
      const record = new Record(tasksCollection)
      record.set('wedding_id', weddingId)
      record.set('title', title)
      record.set('category', group.category)
      record.set('priority', 'medium')
      record.set('status', 'pending')
      $app.save(record)
    }
  }

  e.next()
}, 'weddings')
