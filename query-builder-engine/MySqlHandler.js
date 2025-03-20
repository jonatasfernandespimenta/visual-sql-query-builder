export default class MySqlHandler {
  tableHandler(database, table, schema) {
    return  "`" + database + "`.`" + table + "`";
  }
}
