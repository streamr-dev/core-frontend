import links from '../../links'
import { login } from './mixins/session'

describe('StreamSpec', () => {
    let page

    beforeAll(async () => {
        const context = await browser.createIncognitoBrowserContext()
        page = await context.newPage()
        await login(page)
    })

    describe('creating streams and autodetecting fields', () => {
        it('when: "create stream button is clicked" then: "must go to stream create page"', async () => {
            await page.goto(`http://localhost:${process.env.PORT}${links.streamList}`)
            await expect(page).toMatchElement('#streamlist-create-stream')
            const nav = page.waitForNavigation()
            await page.click('#streamlist-create-stream')
            await nav
            const url = await page.url()
            expect(url)
                .toEqual(`http://localhost:${process.env.PORT}${links.streamCreate}`)
        })
    })
})
