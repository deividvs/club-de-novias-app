migrate(
  (app) => {
    const collection = new Collection({
      name: 'weddings',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'bride_name', type: 'text' },
        { name: 'wedding_date', type: 'date' },
        { name: 'guest_count', type: 'number' },
        { name: 'total_budget', type: 'number' },
        { name: 'location_city', type: 'text' },
        { name: 'location_state', type: 'text' },
        { name: 'onboarding_completed', type: 'bool' },
        { name: 'top_concerns', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('weddings')
    app.delete(collection)
  },
)
