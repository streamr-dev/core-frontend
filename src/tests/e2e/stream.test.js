import links from '../../links'
import { login } from './mixins/session'
import StreamrClient from 'streamr-client'

const config = require('../../config')

const wait = (t) => new Promise((resolve) => setTimeout(resolve, t))
describe('StreamSpec', () => {
    let page

    beforeAll(async () => {
        const context = await browser.createIncognitoBrowserContext()
        page = await context.newPage()
        await login(page)
    })

    describe('creating streams and autodetecting fields', () => {
        const streamName = `StreamSpec${Date.now()}`
        let streamId

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
            // grab stream id from page
            streamId = await page.$eval('.stream-id', (node) => node.innerText)
            expect(streamId && streamId.length).toBeTruthy()
        })

        test('when: "Configure Fields button is clicked"', async () => {
            await page.click('#configure-fields-button')
        })

        it('then: "field configure form is visible"', async () => {
            await expect(page).toMatchElement('#configure-fields-form')
        })

        // TODO: auto detect not yet implemented
        test.skip('when: "Produce an event into the stream and click autodetect button"', async () => {
            const client = new StreamrClient({
                url: config.wsUrl,
                restUrl: config.restUrl,
                authKey: process.env.TEST_USER_KEY,
                autoconnect: false,
                autoDisconnect: false,
            })
            await client.connect()
            await client.produceToStream(streamId, {
                foo: 'bar',
                xyz: 45.5,
            })
            await wait(1000)
            await client.disconnect()
            await page.click('#autodetect')
        })

        it.skip('then: "The fields in the stream must appear and be of correct type"', async () => {
            const form = await page.$('#configure-fields-form')
            const fieldNames = await form.$$('[name=field_name]')
            expect(fieldNames.length).toEqual(2)
            const fieldTypes = await form.$$('[name=field_type]')
            expect(fieldTypes.length).toEqual(2)
            expect(await (await fieldTypes[0].getProperty('value')).jsonValue()).toEqual('string')
            expect(await (await fieldTypes[1].getProperty('value')).jsonValue()).toEqual('number')
            const deleteButtons = await form.$$('.delete-field-button')
            expect(deleteButtons.length).toEqual(2)
        })
    })
})
