import assert from 'assert-diff'
import moxios from 'moxios'
import sinon from 'sinon'

import * as services from '../../../../src/marketplace/modules/user/services'
import * as productUtils from '../../../../src/marketplace/utils/product'

describe('user - services', () => {
    let sandbox
    let dateNowSpy
    let oldMarketplaceApiUrl
    let oldStreamrApiUrl
    const DATE_NOW = 1337

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW)
    })

    afterAll(() => {
        dateNowSpy.mockReset()
        dateNowSpy.mockRestore()
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        oldMarketplaceApiUrl = process.env.MARKETPLACE_API_URL
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.MARKETPLACE_API_URL = ''
        process.env.STREAMR_API_URL = ''
        moxios.install()
    })

    afterEach(() => {
        sandbox.restore()
        process.env.MARKETPLACE_API_URL = oldMarketplaceApiUrl
        process.env.STREAMR_API_URL = oldStreamrApiUrl
        moxios.uninstall()
    })

    describe('getMyKeys', () => {
        it('gets API keys', async () => {
            const data = [
                {
                    id: '1234',
                    name: 'Default',
                    user: 'tester1@streamr.com',
                },
            ]

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, '/users/me/keys?noCache=1337')
            })

            const result = await services.getMyKeys()
            assert.deepStrictEqual(result, data)
        })
    })

    describe('getIntegrationKeys', () => {
        it('gets integration keys', async () => {
            const data = [
                {
                    id: '1234',
                    user: 1234,
                    name: 'Marketplace test',
                    service: 'ETHEREUM_ID',
                    json: {
                        address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    },
                },
            ]

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, '/integration_keys')
            })

            const result = await services.getIntegrationKeys()
            assert.deepStrictEqual(result, data)
        })
    })

    describe('getUserData', () => {
        it('gets user data', async () => {
            const data = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
                timezone: 'Zulu',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, '/users/me?noCache=1337')
            })

            const result = await services.getUserData()
            assert.deepStrictEqual(result, data)
        })
    })

    describe('getUserProductPermissions', () => {
        it('gets product permissions', async () => {
            const productId = '1'
            const data = [
                {
                    id: 1,
                    user: 'tester1@streamr.com',
                    operation: 'read',
                },
                {
                    id: 2,
                    user: 'tester1@streamr.com',
                    operation: 'write',
                },
                {
                    id: 3,
                    user: 'tester1@streamr.com',
                    operation: 'share',
                },
            ]

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `/products/${productId}/permissions/me`)
            })

            const result = await services.getUserProductPermissions(productId)
            assert.deepStrictEqual(result, data)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith(productId, false))
        })
    })
})
