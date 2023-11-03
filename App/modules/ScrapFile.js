import fs from 'fs'

function getCsvFilePath() {
    const folder = process.env.DOWNLOAD_FOLDER_TARGET
    const file = process.env.DOWNLOAD_FILE_TARGET

    return `${process.cwd()}/${folder}/${file}`
}

function isCsvFileExists() {
    return fs.existsSync(getCsvFilePath())
}

export { isCsvFileExists, getCsvFilePath }