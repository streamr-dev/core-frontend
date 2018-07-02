import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '../../../../modules/categories/services'

describe('categories - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets categories with empty', async () => {
        process.env.MARKETPLACE_API_URL = 'TEST_MARKETPLACE_API_URL'
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

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${process.env.MARKETPLACE_API_URL}/categories?includeEmpty=true`)
        })

        const result = await services.getCategories(true)
        assert.deepEqual(result, data)
    })

    it('gets categories without empty', async () => {
        process.env.MARKETPLACE_API_URL = 'TEST_MARKETPLACE_API_URL'
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

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${process.env.MARKETPLACE_API_URL}/categories?includeEmpty=false`)
        })

        const result = await services.getCategories(false)
        assert.deepEqual(result, data)
    })
})
