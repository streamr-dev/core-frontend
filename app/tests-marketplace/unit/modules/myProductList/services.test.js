import assert from 'assert-diff'
import moxios from 'moxios'

import { getMyProducts } from '../../../../src/modules/myProductList/services'

describe('myProductList - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('get myproducts', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                id: '123abc',
                name: 'Test 1',
                pricePerSecond: '0',
            },
            {
                id: '456def',
                name: 'Test 2',
                pricePerSecond: '10000',
            },
            {
                id: '789ghi',
                name: 'Test 3',
                pricePerSecond: '50000',
            },
        ]

        const expectedResult = [
            {
                id: '123abc',
                name: 'Test 1',
                pricePerSecond: '0',
            },
            {
                id: '456def',
                name: 'Test 2',
                pricePerSecond: '0.00001',
            },
            {
                id: '789ghi',
                name: 'Test 3',
                pricePerSecond: '0.00005',
            },
        ]

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/users/me/products`)
        })

        const result = await getMyProducts()
        assert.deepStrictEqual(result, expectedResult)
    })
})
