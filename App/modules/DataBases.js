import 'dotenv/config'
import mysql from 'mysql2/promise'
import ora from 'ora'
import csr from '../config/csv.resolver.json' assert { type: 'json' }
import {
    getCreateTableQuery,
    getInsertQuery,
    getMultipleInsertQuery,
    resolveCsvRow,
} from './SchemaResolver.js'

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    connectTimeout: 200,
    multipleStatements: true
})

function test() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'yellow'

        pool.getConnection()
            .then(() => {
                spinner.succeed('Connection successful')
                resolve()
            })
            .catch((error) => {
                spinner.fail(`Connection failed : ${error.message}`)
                reject(error)
            })
    })
}

function deleteExistingData() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Testing connection to database').start()
        spinner.color = 'red'

        const query = `DELETE FROM ${process.env.TABLE_NAME};`

        pool.query(query)
            .then((results) => {
                const result = results[0]
                spinner.succeed(
                    `Deletion finished with ${result.affectedRows} lines deleted`
                )
                resolve(result)
            })
            .catch((error) => {
                spinner.fail(`Connection failed : ${error.message}`)
                reject(error)
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

        pool.query(query, [postalCode])
            .then((results) => {
                const result = results[0]
                spinner.succeed(
                    `Database finished with ${result.affectedRows} lines deleted`
                )
                resolve(result)
            })
            .catch((error) => {
                spinner.fail(`Connection failed : ${error.message}`)
                reject(error)
            })
    })
}

async function insertMultipleRows(rows = []) {
    return new Promise((resolve, reject) => {
        pool.query(getMultipleInsertQuery(), [rows])
            .then((results) => {
                resolve(results)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function importDataFromCsv(row) {
    return new Promise((resolve, reject) => {
        pool.query(getInsertQuery(), resolveCsvRow(row))
            .then((results) => {
                const result = results[0]
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function createTable() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Creating database').start()
        spinner.color = 'green'

        pool.query(getCreateTableQuery(), [])
            .then((results) => {
                spinner.succeed(`Table created`)
                resolve(results)
            })
            .catch((error) => {
                spinner.fail(`Table not created ${error.message}`)
                reject(error)
            })
    })
}

function dropTable() {
    return new Promise((resolve, reject) => {
        const spinner = ora('Droping database').start()
        spinner.color = 'red'

        const query = `DROP TABLE IF EXISTS ${process.env.TABLE_NAME}`

        pool.query(query, [])
            .then((results) => {
                spinner.succeed(`Table dropped`)
                resolve(results)
            })
            .catch((error) => {
                spinner.fail(`Table not dropped ${error.message}`)
                reject(error)
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
    insertMultipleRows,
    dropTable,
}
