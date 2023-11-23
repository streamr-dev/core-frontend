import moxios from 'moxios'
import * as all from '~/shared/utils/api'
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
})
