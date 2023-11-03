import 'dotenv/config'
import mysql from 'mysql2'
import ora from 'ora'
import csr from '../config/csv.resolver.json' assert { type: 'json' }

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    connectTimeout: 200,
})

function test() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'yellow'

        pool.getConnection((error) => {
            if (error) {
                spinner.fail(`Connection failed : ${error.message}`)
                reject(error)
            } else {
                spinner.succeed('Connection successful')
                resolve()
            }
        })
    })
}

function deleteExistingData() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'red'

        const query = `DELETE FROM ${process.env.TABLE_NAME};`

        pool.query(query, (error, result) => {
            if (!error) {
                spinner.succeed(`Deletion finished with ${result.affectedRows}`)
                resolve(results)
            } else {
                spinner.fail(`Deletion can not be processed ${error.message}`)
                reject(error)
            }
        })
    })
}

function deleteExistingDataWithPostalCode({ postalCode }) {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'red'

        const query = `
            DELETE 
            FROM ${process.env.TABLE_NAME} 
            WHERE ${csr.postalCode.database} = ? 
        `

        pool.query(query, [postalCode], (error, result) => {
            if (!error) {
                spinner.succeed(
                    `Database finished with ${result.affectedRows} lines deleted`
                )
                resolve(result)
            } else {
                spinner.fail(`Deletion can not be processed ${error.message}`)
                reject(error)
            }
        })
    })
}

function importDataFromCsv({
    address,
    ape,
    commune,
    creationDate,
    epci,
    homeLot,
    legalRepresent,
    mandate,
    parkingLot,
    postalCode,
    registration,
    siret,
    street,
    syndicType,
    totalLot,
    useName,
    workLot,
}) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO 
                ${process.env.TABLE_NAME}
            (
                ${csr.address.database},
                ${csr.ape.database},
                ${csr.commune.database},
                ${csr.creationDate.database},
                ${csr.epci.database},
                ${csr.homeLot.database},
                ${csr.legalRepresent.database},
                ${csr.mandate.database},
                ${csr.parkingLot.database},
                ${csr.postalCode.database},
                ${csr.registration.database},
                ${csr.siret.database},
                ${csr.street.database},
                ${csr.syndicType.database},
                ${csr.totalLot.database},
                ${csr.useName.database},
                ${csr.workLot.database}
            )
            VALUES
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
        `

        const values = [
            address,
            ape,
            commune,
            creationDate,
            epci,
            homeLot,
            legalRepresent,
            mandate,
            parkingLot,
            postalCode,
            registration,
            siret,
            street,
            syndicType,
            totalLot,
            useName,
            workLot,
        ]

        pool.query(query, values, (error, result) => {
            if (!error) {
                resolve(result.affectedRows)
            } else {
                reject(error)
            }
        })
    })
}

function createTable() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'red'

        const query = `
        CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (
            epci varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            commune varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            registration varchar(255) COLLATE utf8mb3_bin NOT NULL,
            syndic_type varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            legal_represent varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            siret varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            ape varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            mandate varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            use_name varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            address varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            street varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            postal_code varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            creation_date varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            total_lot varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            work_lot varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            home_lot varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            parking_lot varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
            PRIMARY KEY (registration)
        ) ENGINE=${process.env.DATABASE_ENGINE} DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin
    `

        pool.query(query, [], (error, result) => {
            if (!error) {
                spinner.succeed(`Table created ${result.affectedRows}`)
                resolve(result)
            } else {
                spinner.fail(`Table not created ${error.message}`)
                reject(error)
            }
        })
    })
}

export {
    pool,
    test,
    importDataFromCsv,
    deleteExistingData,
    deleteExistingDataWithPostalCode,
    createTable,
}
