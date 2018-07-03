import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '../../../../src/modules/relatedProducts/services'

describe('relatedProducts - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets products', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const productId = '789'
        const data = [
            {
                id: '123',
                name: 'Product 1',
                pricePerSecond: '0',
            },
            {
                id: '456',
                name: 'Product 2',
                pricePerSecond: '10000',
            },
        ]

        // Note the conversion of pricePerSecond in expectedResult
        const expectedResult = [
            {
                id: '123',
                name: 'Product 1',
                pricePerSecond: '0',
            },
            {
                id: '456',
                name: 'Product 2',
                pricePerSecond: '0.00001',
            },
        ]

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/related`)
        })

        const result = await services.getRelatedProducts(productId)
        assert.deepStrictEqual(result, expectedResult)
    })
})

