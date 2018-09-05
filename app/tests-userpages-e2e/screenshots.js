import fs from 'fs-extra'
import links from '../links'
import { login } from './mixins/session'

describe('Screenshots', () => {
    let page
    let oldViewport

    const pages = {
        canvas: '/canvas',
        newCanvas: links.newCanvas,
        canvasList: links.canvasList,
        canvasEditor: `${links.canvasEditor}/TDl025VRQbqgY2DpQK4mRg`,
        dashboardList: links.dashboardList,
        dashboardEditor: `${links.dashboardEditor}/1`,
        streamList: links.streamList,
        streamCreate: links.streamCreate,
        streamShow: `${links.streamShow}/JFXhMJjCQzK-SardC8faXQ`,
        profile: links.profile,
        profileChangePassword: links.profileChangePassword,
    }

    const root = `http://localhost:${process.env.PORT}`
    const dir = `screenshots/${process.env.SCREENSHOTS ? `${process.env.SCREENSHOTS}/` : ''}`

    async function screenshot(name, url) {
        await page.goto(`${root}${url}`)
        await page.screenshot({
            path: `${dir}/${name}.png`,
            fullPage: true,
        })
    }

    beforeAll(async () => {
        await fs.ensureDir(dir)
        const context = await browser.createIncognitoBrowserContext()
        page = await context.newPage()
        await login(page)
        oldViewport = await page.viewport()
        await page.setViewport({
            width: 1440,
            height: 900,
            deviceScaleFactor: 2,
        })
    })

    afterAll(async () => {
        await page.setViewport(oldViewport)
    })

    test.each(Object.entries(pages))('.screenshot(%s, %s)', async (name, url) => {
        await screenshot(name, url)
    })
})
