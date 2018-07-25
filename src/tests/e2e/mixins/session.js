const {
    LOGOUT_PATH,
    LOGIN_PATH,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
    STREAMR_URL,
} = process.env

export const login = async () => {
    const page = await browser.newPage()
    await page.goto(`${STREAMR_URL}/${LOGIN_PATH}`)
    await page.type('#username', LOGIN_USERNAME)
    await page.type('#password', LOGIN_PASSWORD)
    await page.click('#loginButton')
    await page.waitForNavigation()
    await page.close()
}

export const logout = async () => {
    const page = await browser.newPage()
    await page.goto(`${STREAMR_URL}/${LOGOUT_PATH}`)
}
