import assert from 'assert-diff'
import moxios from 'moxios'

import * as services from '../../../../src/marketplace/modules/myPurchaseList/services'

describe('myPurchaseList - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets my purchases', async () => {
        process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
        const data = [
            {
                user: 'test-user-1',
                endsAt: '2010-10-10T10:10:10Z',
                product: {
                    id: '1',
                    name: 'Test product 1',
                    pricePerSecond: 1,
                },
            },
            {
                user: 'test-user-1',
                endsAt: '2020-10-10T10:10:10Z',
                product: {
                    id: '2',
                    name: 'Test product 2',
                    pricePerSecond: 2,
                },
            },
        ]
        const expectedResult = [
            {
                user: 'test-user-1',
                endsAt: '2010-10-10T10:10:10Z',
                product: {
                    id: '1',
                    name: 'Test product 1',
                    pricePerSecond: '1e-9',
                },
            },
            {
                user: 'test-user-1',
                endsAt: '2020-10-10T10:10:10Z',
                product: {
                    id: '2',
                    name: 'Test product 2',
                    pricePerSecond: '2e-9',
                },
            },
        ]

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })
            const expectedUrl = `${process.env.STREAMR_API_URL}/subscriptions`
            assert.equal(request.config.method, 'get')
            assert.equal(request.config.url, `${expectedUrl}`)
        })
        const result = await services.getMyPurchases()
        assert.deepStrictEqual(result, expectedResult)
    })
})
