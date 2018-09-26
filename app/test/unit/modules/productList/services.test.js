import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '$mp/modules/productList/services'
import { productListPageSize } from '$mp/utils/constants'

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
/products?search=&categories=null&sortBy=null&maxPrice=null&publicAccess=true&grantedAccess=false&max=${productListPageSize + 1}&offset=0`
            assert.equal(request.config.method, 'get')
            // TODO: if this fails for no good reason, it might just be due to the inconsistency of 'querystringify'. Then we need to test it some other way than with direct comparison
            assert.equal(request.config.url, `${expectedUrl}`)
        })
        const result = await services.getProducts(filter, productListPageSize, 0)
        assert.deepStrictEqual(result, expectedResult)
    })
})
