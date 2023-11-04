import { exit } from 'node:process'
import { createTable, dropTable, test } from './modules/DataBases.js'

await test();
await dropTable();
await createTable();
exit(1);