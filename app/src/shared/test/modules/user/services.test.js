import assert from 'assert-diff'
import moxios from 'moxios'
import sinon from 'sinon'

import * as services from '$shared/modules/user/services'

describe('user - services', () => {
    let sandbox
    let dateNowSpy
    let oldStreamrApiUrl
    let oldStreamrUrl
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

    describe('saveCurrentUser', () => {
        it('should post the user to the api', async () => {
            const data = {
                id: '1',
                name: 'tester',
                email: 'test@tester.test',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/profile/update')
                assert.equal(request.headers['Content-Type'], 'application/x-www-form-urlencoded')
            })

            const result = await services.postUser(data)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('logout', () => {
        // TODO: Change `xit` to `it` when using the local auth pages again. – Mariusz
        xit('logs the user out', async (done) => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: '',
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, 'streamr/logout')
                done()
            })

            const result = await services.logout()
            assert.deepStrictEqual(result, '')
        })

        // TODO: Remove the following example when using the local auth pages. – Mariusz
        it('logs the user out (the old way, kinda)', async () => {
            const result = await services.logout()
            assert.deepStrictEqual(result, '')
        })
    })
})
