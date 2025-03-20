export default class ModularQueryBuilder {
  constructor(knexInstance) {
    this.knex = knexInstance;
    this.query = knexInstance.queryBuilder();
    this.handlers = new Map();

    this.handlers.set('query', this.handleQuery.bind(this));
    this.handlers.set('column', this.handleColumn.bind(this));
    this.handlers.set('table', this.handleTable.bind(this));
  }

  handleQuery(data) {
    if (data.stepName === 'Select') {
      this.query.select();
    }

    if(data.stepName === 'Insert') {
      this.query.insert();
    }
  }

  handleColumn(data) {
    if (data.stepName === 'all') {
      this.query.select('*');
    } else {
      this.query.select(data.stepName);
    }
  }

  handleTable(data) {
    this.query.from(data.stepName);
  }

  build(items) {
    items.forEach(item => {
      const handler = this.handlers.get(item.type);
      if (handler) {
        handler(item);
      }
    });
    return this.query;
  }
}
