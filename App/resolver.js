import 'dotenv/config'
import { getCreateTableQuery, getInsertQuery } from "./modules/SchemaResolver.js";

console.log(getInsertQuery());