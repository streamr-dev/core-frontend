import puppeteer from 'puppeteer'

jest.setTimeout(30000)

const { HEADLESS } = process.env
const BROWSER_WIDTH = 1400
const BROWSER_HEIGHT = 1000

export const launchBrowser = () => {
    return puppeteer.launch({
        headless: HEADLESS !== 'false',
        args: [
            `--window-size=${BROWSER_WIDTH},${BROWSER_HEIGHT}`,
        ],
    })
}
