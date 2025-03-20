import MySqlHandler from "./MySqlHandler.js";
import PgSqlHandler from "./PgSqlHandler.js";

export default class DbHandlerFactory {
  static handlers = {
    postgres: PgSqlHandler,
    mysql: MySqlHandler,
    sql_server: PgSqlHandler,
  };

  static create(engine) {
    return new (this.handlers[engine])();
  }
}
