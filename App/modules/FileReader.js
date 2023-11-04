import 'dotenv/config'
import fs from 'fs'
import csv from 'csv-parser'
import cliProgress from 'cli-progress'
import ora from 'ora'
import { args } from './Arguments.js'
import csr from '../config/csv.resolver.json' assert { type: 'json' }
import { insertMultipleRows } from './DataBases.js'
import { getCsvFilePath, isCsvFileExists } from './ScrapFile.js'
import { resolveCsvRow } from './SchemaResolver.js'

function readFile() {
    return new Promise((resolve, reject) => {
        const spinner = ora({
            text: 'Preparing data files',
            color: 'yellow'
        }).start()

        if (!isCsvFileExists()) {
            spinner.fail('File not found')
            reject('file not found')
        }

        let totalLength = 0
        fs.createReadStream(getCsvFilePath())
            .pipe(csv())
            .on('data', (row) => {
                totalLength += 1
            })
            .on('end', (row) => {
                spinner.succeed('File ready to be persisted')
                resolve(totalLength)
            })
    })
}

function persistData(nbRows) {
    return new Promise((resolve, reject) => {
        const progress = new cliProgress.SingleBar(
            {
                fps: 24,
                clearOnComplete: true,
            },
            cliProgress.Presets.shades_classic
        )
        progress.start(nbRows, 0)

        const postalCode = args['postal-code'] ?? null

        let count = 0
        let rows = []
        const stream = fs
            .createReadStream(getCsvFilePath())
            .pipe(csv())
            .on('data', (row) => {
                progress.increment()

                const registration = row[csr.registration.file]
                const rowPostalCode = Number.parseInt(row[csr.postalCode.file])

                if (!registration || registration === '') {
                    return
                }

                if (postalCode && rowPostalCode !== postalCode) {
                    return
                }

                rows.push(resolveCsvRow(row))

                if (rows.length === 100) {
                    stream.pause()
                    insertMultipleRows(rows).finally(() => {
                        rows = []
                        stream.resume()
                    })
                }

                count++
            })
            .on('end', function () {
                insertMultipleRows(rows).finally(() => {
                    rows = []
                    progress.stop()
                    ora().succeed(`${count}/${nbRows} lines processed`)
                    resolve(count)
                })
            })
    })
}

export { readFile, persistData }
