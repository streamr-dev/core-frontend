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
        const streamName = `StreamSpec${Date.now()}`

        test('when: "create stream button is clicked"', async () => {
            await page.goto(`http://localhost:${process.env.PORT}${links.streamList}`)
            await expect(page).toMatchElement('#streamlist-create-stream')
            const nav = page.waitForNavigation()
            await page.click('#streamlist-create-stream')
            await nav
        })

        it('then: "must go to stream create page"', async () => {
            const url = await page.url()
            expect(url)
                .toEqual(`http://localhost:${process.env.PORT}${links.streamCreate}`)
        })

        test('when: "name and desc are entered and next button is clicked"', async () => {
            const nav = page.waitForNavigation()
            await page.type('[name=name]', streamName)
            await page.type('[name=description]', `${streamName} description`)
            await page.click('[name=next]')
            await nav
        })

        it('then: "must navigate to stream show page, showing info about non-configured stream"', async () => {
            const url = await page.url()
            expect(url.startsWith(`http://localhost:${process.env.PORT}${links.streamShow}`)).toBeTruthy()
        })

        test('when: "Configure Fields button is clicked"', async () => {
            await page.click('#configure-fields-button')
        })

        it('then: "field configure form is visible"', async () => {
            expect(page).toMatchElement('#configure-fields-form')
        })
    })
})
