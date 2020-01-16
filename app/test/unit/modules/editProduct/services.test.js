import assert from 'assert-diff'
import moxios from 'moxios'
import { cloneDeep } from 'lodash'
import * as services from '$mp/modules/deprecated/editProduct/services'
import { existingProduct } from './mockData'

const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})

describe('editProduct - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('puts product', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'put')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${data.id}`)
        })
        const result = await services.putProduct(data, data.id)
        assert.deepStrictEqual(result, expectedResult)
    })

    it('posts product', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'post')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products`)
        })
        const result = await services.postProduct(data)
        assert.deepStrictEqual(result, expectedResult)
    })

    it('posts image', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            assert.equal(request.config.method, 'post')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${data.id}/images`)
        })
        const result = await services.postImage(data.id, mockFile)
        assert.deepStrictEqual(result, expectedResult)
    })
})
