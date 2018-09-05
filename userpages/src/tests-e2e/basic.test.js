import { login } from './mixins/session'

describe('Basic Sanity Check', () => {
    let page
    beforeAll(async () => {
        const context = await browser.createIncognitoBrowserContext()
        page = await context.newPage()
        await page.goto(process.env.USERPAGES_URL)
    })

    it('title matches', async () => {
        const title = await page.title()
        expect(title).toEqual('Streamr')
    })

    it('does not have logout in nav', async () => {
        await expect(page).not.toMatchElement('#nav-logout-link', { timeout: 500 })
    })

    it('has logout in nav', async () => {
        await login(page)
        await expect(page).toMatchElement('#nav-logout-link')
    })
})
