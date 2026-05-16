migrate(
  (app) => {
    const collection = new Collection({
      name: 'guest_simulations',
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
        { name: 'name', type: 'text', required: true },
        { name: 'total_budget', type: 'number', required: true },
        { name: 'cost_per_person', type: 'number', required: true },
        { name: 'guest_budget_meta', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('guest_simulations')
    app.delete(collection)
  },
)
