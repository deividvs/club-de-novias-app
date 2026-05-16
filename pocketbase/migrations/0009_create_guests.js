migrate(
  (app) => {
    const collection = new Collection({
      name: 'guests',
      type: 'base',
      listRule: "@request.auth.id != '' && simulation_id.wedding_id.user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && simulation_id.wedding_id.user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && simulation_id.wedding_id.user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && simulation_id.wedding_id.user_id = @request.auth.id",
      fields: [
        {
          name: 'simulation_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('guest_simulations').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        {
          name: 'relationship_group',
          type: 'select',
          required: true,
          values: ['família_próxima', 'amigo_íntimo', 'colega', 'obrigação_social'],
          maxSelect: 1,
        },
        {
          name: 'social_risk',
          type: 'select',
          required: true,
          values: ['baixo', 'médio', 'alto'],
          maxSelect: 1,
        },
        {
          name: 'presence_probability',
          type: 'select',
          required: true,
          values: ['baixa', 'média', 'alta', 'confirmado', 'improvável'],
          maxSelect: 1,
        },
        { name: 'individual_cost', type: 'number' },
        { name: 'notes', type: 'text' },
        { name: 'manual_status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('guests')
    app.delete(collection)
  },
)
