import assert from 'assert-diff'
import moxios from 'moxios'
import sinon from 'sinon'

import * as services from '$shared/modules/resourceKey/services'

describe('resourceKey - services', () => {
    let sandbox
    let oldStreamrApiUrl
    let oldStreamrUrl

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        oldStreamrUrl = process.env.STREAMR_URL
        process.env.STREAMR_URL = 'streamr'
        moxios.install()
    })

    afterEach(() => {
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
        process.env.STREAMR_URL = oldStreamrUrl
        moxios.uninstall()
    })

    describe('getStreamResourceKeys', () => {
        it('gets API keys from stream', async () => {
            const streamId = '1234'
            const data = [
                {
                    id: 'testid',
                    name: 'Test',
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
                assert.equal(request.config.url, `/streams/${streamId}/keys`)
            })

            const result = await services.getStreamResourceKeys(streamId)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('addStreamResourceKey', () => {
        it('makes a POST request', async () => {
            const streamId = '1234'
            const name = 'new key'
            const data = {
                id: 'testid',
                name,
                user: 'tester1@streamr.com',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `/streams/${streamId}/keys`)
            })

            const result = await services.addStreamResourceKey(streamId, name)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('removeStreamResourceKey', () => {
        it('makes a DELETE request', async () => {
            const streamId = 'streamid'
            const id = 'testid'
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 204,
                    response: null,
                })

                assert.equal(request.config.method, 'delete')
                assert.equal(request.config.url, `/streams/${streamId}/keys/${id}`)
            })

            const result = await services.removeStreamResourceKey(streamId, id)
            assert.deepStrictEqual(result, null)
        })
    })
})
