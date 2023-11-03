import { exit } from 'node:process'
import ora from 'ora'
import { createTable, test } from './modules/DataBases.js'

await test();
await createTable();
exit(1);