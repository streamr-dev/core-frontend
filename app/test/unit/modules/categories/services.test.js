import moxios from 'moxios'

import setTempEnv from '$testUtils/setTempEnv'
import * as services from '$mp/modules/categories/services'

describe('categories - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })

    it('gets categories with empty', async (done) => {
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
            expect(request.config.url).toBe('http://localhost/api/v1/categories?includeEmpty=true')
            done()
        })

        const result = await services.getCategories(true)
        expect(result).toStrictEqual(data)
    })

    it('gets categories without empty', async (done) => {
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
            expect(request.config.url).toBe('http://localhost/api/v1/categories?includeEmpty=false')
            done()
        })

        const result = await services.getCategories(false)
        expect(result).toStrictEqual(data)
    })
})
