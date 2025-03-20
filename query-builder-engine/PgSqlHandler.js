export default class PgSqlHandler {
  tableHandler(database, table, schema) {
    return `"${database}"."${schema}"."${table}"`;
  }
}
