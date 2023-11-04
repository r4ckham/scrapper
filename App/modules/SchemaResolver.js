import csr from '../config/csv.resolver.json' assert { type: 'json' }

function getInsertQuery() {
    let columns = []

    for (const property of Object.getOwnPropertyNames(csr)) {
        columns.push(csr[property].database)
    }

    return `
        INSERT INTO ${process.env.TABLE_NAME} 
        (${columns.join(',')})
        VALUES
        (${columns.map((item) => '?').join(',')})
    `
}

function getMultipleInsertQuery() {
    let columns = []

    for (const property of Object.getOwnPropertyNames(csr)) {
        columns.push(csr[property].database)
    }

    return `
        INSERT INTO ${process.env.TABLE_NAME} 
        (${columns.join(',')})
        VALUES
        ?
    `
}

function getCreateTableQuery() {
    let columns = []

    for (const property of Object.getOwnPropertyNames(csr)) {
        columns.push(csr[property])
    }

    return (
        `CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (` +
        columns
            .map(
                (column) =>
                    `${column.database} ${column.dataType} ${
                        !!column?.nullable || !!column?.primary
                            ? 'NOT NULL'
                            : 'DEFAULT NULL'
                    }`
            )
            .join(',') +
        ` , PRIMARY KEY (${columns
            .filter((property) => property.primary)
            .map((column) => column.database)
            .join(',')})` +
        `) 
            ENGINE=${process.env.DATABASE_ENGINE} 
            DEFAULT CHARSET=${process.env.DATABASE_CHARSET}  
            COLLATE=${process.env.DATABASE_COLLATE}
        `
    )
}

function resolveCsvRow(row) {
    let rowData = []

    for (const property of Object.getOwnPropertyNames(csr)) {
        const prop = csr[property]
        let data = row[prop.file] ?? null

        if (data !== null) {
            if (prop.type === 'int') {
                const value = parseInt(data)
                data = Number.isNaN(value) ? null : value
            }

            if (prop.type === 'float') {
                const value = parseFloat(data)
                data = Number.isNaN(value) ? null : value
            }

            if (prop.type === 'date') {
                const value = new Date(data)
                data = isNaN(value)
                    ? null
                    : value.toISOString().split('T')[0]
            }

            if (prop.type === 'string' && data === '') {
                data = null;
            }

            if (prop.type === 'datetime' || prop.type === 'timestamp') {
                const value = new Date(data)
                data = value instanceof Date && isFinite(value)
                    ? null
                    : value.toISOString().replace('T', ' ').replace('Z', '')
            }
        }

        rowData.push(data)
    }

    return rowData
}

export {
    getInsertQuery,
    getCreateTableQuery,
    resolveCsvRow,
    getMultipleInsertQuery,
}
