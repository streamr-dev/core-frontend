import moxios from 'moxios'
import setTempEnv from '$app/test/test-utils/setTempEnv'
import * as services from '$mp/modules/productList/services'
import { productListPageSize } from '$mp/utils/constants'
describe('productList - services', () => {

    const data = [
        {
            id: '123abc',
            name: 'Test 1',
            pricePerSecond: '5000000000',
        },
        {
            id: '456def',
            name: 'Test 2',
            pricePerSecond: '5000000000',
        },
        {
            id: '789ghi',
            name: 'Test 3',
            pricePerSecond: '5000000000',
        },
    ]
    const expectedResult = {
        hasMoreProducts: false,
        products: [
            {
                id: '123abc',
                name: 'Test 1',
                pricePerSecond: '5000000000',
            },
            {
                id: '456def',
                name: 'Test 2',
                pricePerSecond: '5000000000',
            },
            {
                id: '789ghi',
                name: 'Test 3',
                pricePerSecond: '5000000000',
            },
        ],
    }

    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })
    beforeEach(() => {
        moxios.install()
    })
    afterEach(() => {
        moxios.uninstall()
    })
    it('gets product list of all projects', async () => {

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
                response: [...data],
            })
            const expectedUrl = `http://localhost/api/v2\
/products?categories&max=${
    productListPageSize + 1
}&maxPrice&offset=0&search=&sortBy`
            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`${expectedUrl}`)
        })
        const result = await services.getProducts(filter, productListPageSize, 0)
        expect(result).toStrictEqual(expectedResult)
    })
})
