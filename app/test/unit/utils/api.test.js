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

                expect(request.config.method).toBe('get')
                expect(request.config.url).toBe('/test-endpoint')
            })

            const result = await all.get({
                url: '/test-endpoint',
            })
            expect(result).toBe(data)
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
                expect(e.statusCode).toBe(500)
                expect(e.code).toBe(error.code)
                expect(e.message).toBe(error.message)
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

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe('/test-endpoint')
                expect(request.config.headers['Content-Type']).toBe('application/json')
                expect(request.config.data).toBe(JSON.stringify(data))
            })

            const result = await all.post({
                url: '/test-endpoint',
                data,
            })
            expect(result).toBe(data)
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

                expect(request.config.method).toBe('put')
                expect(request.config.url).toBe('/test-endpoint')
                expect(request.config.headers['Content-Type']).toBe('application/json')
                expect(request.config.data).toBe(JSON.stringify(data))
            })

            const result = await all.put({
                url: '/test-endpoint',
                data,
            })
            expect(result).toBe(data)
        })
    })
})
