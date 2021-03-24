import moxios from 'moxios'

import * as services from '$mp/modules/categories/services'

describe('categories - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets categories with empty', async (done) => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                id: 1,
                name: 'Category 1',
                imageUrl: 'cat1.png',
            },
            {
                id: 2,
                name: 'Category 2',
                imageUrl: null,
            },
        ]

        moxios.wait(async () => {
            const request = moxios.requests.mostRecent()
            await request.respondWith({
                status: 200,
                response: data,
            })

            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/categories?includeEmpty=true`)
            done()
        })

        const result = await services.getCategories(true)
        expect(result).toStrictEqual(data)
    })

    it('gets categories without empty', async (done) => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                id: 1,
                name: 'Category 1',
            },
            {
                id: 2,
                name: 'Category 2',
            },
        ]

        moxios.wait(async () => {
            const request = moxios.requests.mostRecent()
            await request.respondWith({
                status: 200,
                response: data,
            })

            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/categories?includeEmpty=false`)
            done()
        })

        const result = await services.getCategories(false)
        expect(result).toStrictEqual(data)
    })
})
