import 'dotenv/config'
import fs from 'fs'
import csv from 'csv-parser'
import cliProgress from 'cli-progress'
import ora from 'ora'
import { args } from './Arguments.js'
import csr from '../config/csv.resolver.json' assert { type: 'json' }
import { importDataFromCsv } from './DataBases.js'
import { getCsvFilePath, isCsvFileExists } from './ScrapFile.js'

function readFile() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Preparing data files').start()
        spinner.color = 'green'

        if (!isCsvFileExists()) {
            spinner.fail('File not found')
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
                clearOnComplete: true,
            },
            cliProgress.Presets.shades_classic
        )
        progress.start(nbRows, 0)

        const postalCode = args['postal-code'] ?? null

        let count = 0
        fs.createReadStream(getCsvFilePath())
            .pipe(csv())
            .on('data', (row) => {
                progress.increment()
                if (
                    postalCode &&
                    Number.parseInt(row[csr.postalCode.file]) !== postalCode
                ) {
                    return
                }
                count++

                importDataFromCsv({
                    address: row[csr.address.file],
                    ape: row[csr.ape.file],
                    commune: row[csr.commune.file],
                    creationDate: row[csr.creationDate.file],
                    epci: row[csr.epci.file],
                    homeLot: row[csr.homeLot.file],
                    legalRepresent: row[csr.legalRepresent.file],
                    mandate: row[csr.mandate.file],
                    parkingLot: row[csr.parkingLot.file],
                    postalCode: row[csr.postalCode.file],
                    registration: row[csr.registration.file],
                    siret: row[csr.siret.file],
                    street: row[csr.street.file],
                    syndicType: row[csr.syndicType.file],
                    totalLot: row[csr.totalLot.file],
                    useName: row[csr.useName.file],
                    workLot: row[csr.workLot.file],
                })
            })
            .on('end', function () {
                progress.stop()
                ora('Testing connection to database').succeed(
                    `File processed with ${count} lines`
                )
                resolve(count)
            })
    })
}

export { readFile, persistData }
