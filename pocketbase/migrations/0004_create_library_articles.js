migrate(
  (app) => {
    const collection = new Collection({
      name: 'library_articles',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'section', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'content_markdown', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('library_articles')
    app.delete(collection)
  },
)
