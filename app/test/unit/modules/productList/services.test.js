import moxios from 'moxios'

import * as services from '$mp/modules/productList/services'
import { productListPageSize } from '$mp/utils/constants'

const REST_URL = 'TEST_STREAMR_API_URL'

jest.mock('$app/getters/getRestUrl', () => ({
    __esModule: true,
    default: () => REST_URL,
}))

describe('productList - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets product list', async () => {
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
            const expectedUrl = `${REST_URL}\
/products?categories&grantedAccess=false&max=${productListPageSize + 1}&maxPrice&offset=0&publicAccess=true&search=&sortBy`
            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`${expectedUrl}`)
        })
        const result = await services.getProducts(filter, productListPageSize, 0)
        expect(result).toStrictEqual(expectedResult)
    })
})
