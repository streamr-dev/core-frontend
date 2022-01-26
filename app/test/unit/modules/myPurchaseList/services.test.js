import moxios from 'moxios'

import * as services from '$mp/modules/myPurchaseList/services'

const REST_URL = 'TEST_STREAMR_API_URL'

jest.mock('$app/getters/getRestUrl', () => ({
    __esModule: true,
    default: () => REST_URL,
}))

describe('myPurchaseList - services', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('gets my purchases', async () => {
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
            const expectedUrl = `${REST_URL}/subscriptions`
            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe(`${expectedUrl}`)
        })
        const result = await services.getMyPurchases()
        expect(result).toStrictEqual(expectedResult)
    })
})
