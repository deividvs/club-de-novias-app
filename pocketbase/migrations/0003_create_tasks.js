migrate(
  (app) => {
    const collection = new Collection({
      name: 'tasks',
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
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'priority', type: 'select', values: ['high', 'medium', 'low'], maxSelect: 1 },
        { name: 'due_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          values: ['pending', 'in_progress', 'completed'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('tasks')
    app.delete(collection)
  },
)
