import moxios from 'moxios'

import setTempEnv from '$testUtils/setTempEnv'
import * as services from '$mp/modules/relatedProducts/services'

describe('relatedProducts - services', () => {
    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })

    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets products', async () => {
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

            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`http://localhost/api/v1/products/${productId}/related`)
        })

        const result = await services.getRelatedProducts(productId)
        expect(result).toStrictEqual(expectedResult)
    })
})

