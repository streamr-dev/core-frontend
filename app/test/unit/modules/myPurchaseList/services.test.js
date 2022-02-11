import moxios from 'moxios'

import setTempEnv from '$testUtils/setTempEnv'
import * as services from '$mp/modules/myPurchaseList/services'

describe('myPurchaseList - services', () => {
    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })

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
            expect(request.config.method).toBe('get')
            expect(request.config.url).toBe('http://localhost/api/v2/subscriptions')
        })
        const result = await services.getMyPurchases()
        expect(result).toStrictEqual(expectedResult)
    })
})
