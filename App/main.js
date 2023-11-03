
import { scrapFile } from './modules/Scrapper.js'
import { readFile, persistData } from './modules/FileReader.js'
import {
    deleteExistingData,
    deleteExistingDataWithPostalCode,
    test,
} from './modules/DataBases.js'
import { args } from './modules/Arguments.js'
import { exit } from 'node:process'
import ora from 'ora'
import { isCsvFileExists } from './modules/ScrapFile.js'

const start = performance.now()

await test().catch(() => {
    process.exit()
})

const postalCode = args['postal-code']
if (postalCode) {
    await deleteExistingDataWithPostalCode({ postalCode: postalCode })
} else {
    await deleteExistingData()
}

if (Boolean(args.file) || Boolean(args.f) || !isCsvFileExists()) {
    await scrapFile().catch((error) => console.error(error))
} else {
    ora('File allready present on system, please add --file=true to reload the file')
        .info()
}

const nbRows = await readFile()
await persistData(nbRows)

const inSeconds = (performance.now() - start) / 1000
ora(`Process end, took ${Number(inSeconds).toFixed(3)} seconds`).succeed()

exit(1)
