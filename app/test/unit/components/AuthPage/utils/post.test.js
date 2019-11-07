import moxios from 'moxios'
import sinon from 'sinon'

import post from '$auth/utils/post'

describe('post', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    it('posts with correct Content-Type header and method', async () => {
        post('url', {}, false)
        await moxios.promiseWait()
        const request = moxios.requests.mostRecent()

        expect(request.headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
        expect(request.config.method).toEqual('post')
    })

    describe('xhr requests', () => {
        it('posts without X-Requested-With header when xhr flag is NOT set', async () => {
            post('url', {}, false)
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()

            expect(request.headers['X-Requested-With']).toBeUndefined()
        })

        it('posts WITH correct X-Requested-With header when xhr flag IS set', async () => {
            post('url', {}, false, true)
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()

            expect(request.headers['X-Requested-With']).toEqual('XMLHttpRequest')
        })
    })

    it('posts with given params', async () => {
        post('url', {
            param: 'value',
        }, false)
        await moxios.promiseWait()
        const request = moxios.requests.mostRecent()

        expect(request.config.data).toEqual('param=value')
    })

    it('resolves on success with response body', async () => {
        moxios.stubRequest('url', {
            status: 200,
            response: {
                key: 'value',
            },
        })

        const onFulfilled = sinon.spy()
        post('url', {}, false).then(onFulfilled)

        await moxios.promiseWait()

        sinon.assert.calledOnce(onFulfilled)
        sinon.assert.calledWith(onFulfilled, sinon.match.has('key', 'value'))
    })

    it('raises errors attached to a successful response', async () => {
        const onFailure = sinon.spy()
        const error = 'My error message.'

        moxios.stubRequest('url', {
            status: 200,
            response: {
                error,
            },
        })

        post('url', {}, true).catch(onFailure)

        await moxios.promiseWait()

        sinon.assert.calledOnce(onFailure)
        sinon.assert.calledWith(onFailure, sinon.match({
            message: error,
        }))
    })

    it('rejectes and raises an error on failure', async () => {
        const onFailure = sinon.spy()
        const error = 'My error message.'

        moxios.stubRequest('url', {
            status: 422,
            response: {
                error,
            },
        })

        post('url', {}, false).catch(onFailure)

        await moxios.promiseWait()

        sinon.assert.calledOnce(onFailure)
        sinon.assert.calledWith(onFailure, sinon.match({
            message: error,
        }))
    })

    it('handles unknown request failures', async () => {
        const onFailure = sinon.spy()

        moxios.stubRequest('url', {
            status: 500,
            response: null,
        })

        post('url', {}, false).catch(onFailure)

        await moxios.promiseWait()

        sinon.assert.calledOnce(onFailure)
        sinon.assert.calledWith(onFailure, sinon.match({
            message: 'Something went wrong',
        }))
    })
})
