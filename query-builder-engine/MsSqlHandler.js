export default class MsSqlHandler {
  tableHandler(database, table, schema) {
    return `[${database}].[${schema}].[${table}]`;
  }
}
