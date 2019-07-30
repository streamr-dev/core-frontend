/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './SQL-1010.mdx'

export default {
  "id": 1010,
  "name": "SQL",
  "path": "Integrations",
  "help": {
    "params": {
      "engine": "Database engine, e.g. MySQL",
      "host": "Database server to connect",
      "database": "Name of the database",
      "username": "Login username",
      "password": "Login password"
    },
    "paramNames": [
      "engine",
      "host",
      "database",
      "username",
      "password"
    ],
    "inputs": {
      "sql": "SQL command to be executed"
    },
    "inputNames": [
      "sql"
    ],
    "outputs": {
      "errors": "List of error strings",
      "result": "List of rows returned by the database"
    },
    "outputNames": [
      "errors",
      "result"
    ],
    "helpText": moduleDescription
  }
}
