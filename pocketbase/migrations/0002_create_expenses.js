migrate(
  (app) => {
    const collection = new Collection({
      name: 'expenses',
      type: 'base',
      listRule: "@request.auth.id != '' && wedding_id.user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && wedding_id.user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && wedding_id.user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && wedding_id.user_id = @request.auth.id",
      fields: [
        {
          name: 'wedding_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('weddings').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'category',
          type: 'select',
          values: [
            'Espaço',
            'Roupas',
            'Cerimônia',
            'Decoração',
            'Foto/Vídeo',
            'Convites',
            'Comida/Bebida',
            'Lua de Mel',
            'Outros',
          ],
          maxSelect: 1,
        },
        { name: 'description', type: 'text' },
        { name: 'amount_planned', type: 'number' },
        { name: 'amount_actual', type: 'number' },
        { name: 'amount_paid', type: 'number' },
        { name: 'vendor_name', type: 'text' },
        { name: 'status', type: 'select', values: ['pending', 'partial', 'paid'], maxSelect: 1 },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('expenses')
    app.delete(collection)
  },
)
