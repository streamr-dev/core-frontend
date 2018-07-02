import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '../../../../src/modules/productList/services'
import { productListPageSize } from '../../../../src/utils/constants'

describe('productList - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets product list', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                id: '123abc',
                name: 'Test 1',
                pricePerSecond: 5000000000,
            },
            {
                id: '456def',
                name: 'Test 2',
                pricePerSecond: 5000000000,
            },
            {
                id: '789ghi',
                name: 'Test 3',
                pricePerSecond: 5000000000,
            },
        ]
        const expectedResult = {
            hasMoreProducts: false,
            products: [
                {
                    id: '123abc',
                    name: 'Test 1',
                    pricePerSecond: '5',
                },
                {
                    id: '456def',
                    name: 'Test 2',
                    pricePerSecond: '5',
                },
                {
                    id: '789ghi',
                    name: 'Test 3',
                    pricePerSecond: '5',
                },
            ],
        }
        const filter = {
            search: '',
            categories: null,
            sortBy: null,
            maxPrice: null,
        }

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })
            const expectedUrl = `${process.env.STREAMR_API_URL}\
/products?categories&grantedAccess=false&max=17&maxPrice&offset=0&publicAccess=true&search=&sortBy`
            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${expectedUrl}`)
        })
        const result = await services.getProducts(filter, productListPageSize, 0)
        assert.deepStrictEqual(result, expectedResult)
    })
})
