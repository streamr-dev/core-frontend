import assert from 'assert-diff'
import moxios from 'moxios'

import * as all from '$shared/utils/api'

describe('api utils', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    const data = {
        test: true,
        test2: 'test',
    }
    const error = {
        code: 1337,
        message: 'I failed :(',
    }

    describe('get', () => {
        it('has correct properties', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, '/test-endpoint')
            })

            const result = await all.get({
                url: '/test-endpoint',
            })
            assert.equal(result, data)
        })

        it('responds to errors', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 500,
                    response: error,
                })
            })

            try {
                await all.get({
                    url: '/test-endpoint',
                })
            } catch (e) {
                assert.equal(e.statusCode, 500)
                assert.equal(e.code, error.code)
                assert.equal(e.message, error.message)
            }
        })
    })

    describe('post', () => {
        it('has correct properties', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/test-endpoint')
                assert.equal(request.config.headers['Content-Type'], 'application/json')
                assert.equal(request.config.data, JSON.stringify(data))
            })

            const result = await all.post({
                url: '/test-endpoint',
                data,
            })
            assert.equal(result, data)
        })
    })

    describe('put', () => {
        it('has correct properties', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'put')
                assert.equal(request.config.url, '/test-endpoint')
                assert.equal(request.config.headers['Content-Type'], 'application/json')
                assert.equal(request.config.data, JSON.stringify(data))
            })

            const result = await all.put({
                url: '/test-endpoint',
                data,
            })
            assert.equal(result, data)
        })
    })
})
