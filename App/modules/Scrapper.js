import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import ora from 'ora'

async function scrapFile() {
    // Delete former file
    const folder = process.env.DOWNLOAD_FOLDER_TARGET
    const file = process.env.DOWNLOAD_FILE_TARGET
    const filePath = `${folder}/${file}`
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {
            ora('Older csv file deleted').succeed()
        })
    }

    const spinner = ora('Starting scrapping').start();

    const browser = await puppeteer.launch({
        headless: process.env.HEADLESS_MODE,
    })
    const page = await browser.newPage()
    const downloadFolder = path.resolve(process.env.DOWNLOAD_FOLDER_TARGET)

    let client = await browser.target().createCDPSession()
    await client.send('Browser.setDownloadBehavior', {
        behavior: 'allowAndName',
        downloadPath: downloadFolder,
        eventsEnabled: true,
    })

    // go to url
    await page.goto(process.env.DATA_URL)
    spinner.text = "Navigation start"
    spinner.color = "cyan"

    const buttonDownloadSelector = process.env.BUTTON_DOWNLOAD_SELECTOR
    await page.waitForSelector(buttonDownloadSelector)
    const button = await page.$(buttonDownloadSelector)

    await button.click()

    return new Promise((resolve, reject) => {
        let guids = {}
        client.on('Browser.downloadWillBegin', (event) => {
            guids[event.guid] = process.env.DOWNLOAD_FILE_TARGET
            spinner.text = "Download Started"
            spinner.color = "yellow"
        })

        client.on('Browser.downloadProgress', (event) => {
            if (event.state === 'completed') {
                fs.renameSync(
                    path.resolve(downloadFolder, event.guid),
                    path.resolve(downloadFolder, guids[event.guid])
                )

                spinner.succeed('Download finished')

                browser.close().then(() => {
                    resolve({
                        message: 'success',
                    })
                })
            }
        })
    })
}

export { scrapFile }
