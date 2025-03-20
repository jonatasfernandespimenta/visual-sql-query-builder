import DbHandlerFactory from "./DbHandlerFactory.js";

export default class QueryBuilder {
  constructor(steps, database, schema, dbEngine) {
    this.dbEngine = dbEngine;
    this.database = database;
    this.schema = schema;
    this.steps = steps;
    this.queryParts = [];
    this.columns = [];
    this.tablePart = '';
    this.wrapColumns = false;
    this.dbHandler = DbHandlerFactory.create(dbEngine);
  }

  processSteps() {
    let currentClause = null;
    const pushIfNotDuplicate = (col) => {
      if (!this.columns.includes(col)) {
        this.columns.push(col);
      }
    };

    const strategies = {
      query: (item) => {
        const keyword = item.id.toLowerCase();
        if (['insert', 'update'].includes(keyword)) {
          currentClause = keyword;
          this.wrapColumns = true;
        } else {
          currentClause = keyword;
          this.wrapColumns = false;
        }
        this.queryParts.push(item.id.toUpperCase());
      },
      table: (item) => {
        const part = this.dbHandler.tableHandler(this.database, item.stepName, this.schema);
        this.queryParts.push(part);
      },
      column: (item) => {
        if (['select', 'insert', 'update'].includes(currentClause)) {
          pushIfNotDuplicate(item.stepName);
        } else if (currentClause === 'where') {
          this.queryParts.push(item.stepName);
        }
      },
      number: (item) => {
        this.queryParts.push(item.stepName);
      },
      condition: (item) => {
        this.queryParts.push(item.id.toUpperCase());
      },
      custom: (item) => {
        this.queryParts.push(item.stepName);
      }
    };

    this.steps.forEach((item) => strategies[item.type]?.(item));
  }

  buildQuery() {
    this.processSteps();
    
    if (this.columns.length > 0) {
      const cols = this.wrapColumns ? `(${this.columns.join(', ')})` : this.columns.join(', ');
      this.queryParts.splice(1, 0, cols);
    }
    if (this.tablePart) {
      this.queryParts.push(this.tablePart);
    }
    return this.queryParts.join(' ');
  }
}
