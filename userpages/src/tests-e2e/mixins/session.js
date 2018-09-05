const {
    LOGOUT_PATH,
    LOGIN_PATH,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
    STREAMR_URL,
} = process.env

async function interceptSlowCalls(page) {
    await page.setRequestInterception(true)
    const fn = (interceptedRequest) => {
        if (interceptedRequest.url().includes('maxcdn') || interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg')) {
            interceptedRequest.abort()
        } else {
            interceptedRequest.continue()
        }
    }

    page.on('request', fn)

    return async () => {
        page.removeListener('request', fn)
        await page.setRequestInterception(false)
    }
}

export const login = async (page, { username = LOGIN_USERNAME, password = LOGIN_PASSWORD } = {}) => {
    const url = await page.url()
    const unintercept = await interceptSlowCalls(page)
    await page.goto(`${STREAMR_URL}/${LOGIN_PATH}`)
    await unintercept()
    await page.type('#username', username)
    await page.type('#password', password)
    const nav = page.waitForNavigation()
    await page.click('#loginButton')
    await nav
    await page.goto(url)
}

export const logout = async (page) => {
    await page.goto(`${STREAMR_URL}/${LOGOUT_PATH}`)
}
