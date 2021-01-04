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
        it('should PUT the user to the api', async () => {
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

                assert.equal(request.config.method, 'put')
                assert.equal(request.config.url, '/users/me')
                assert.equal(request.headers['Content-Type'], 'application/json')
            })

            const result = await services.putUser(data)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('deleteCurrentUser', () => {
        it('deletes the current user account', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 204,
                })

                assert.equal(request.config.method, 'delete')
                assert.equal(request.config.url, '/users/me')
            })

            await services.deleteUserAccount()
        })
    })

    describe('updateCurrentUserImage', () => {
        it('should POST the image to the api and PUT the user to the API', async () => {
            const data = {
                id: '1',
                name: 'tester',
                email: 'test@tester.test',
                imageUrlSmall: 'testSmall.jpg',
                imageUrlLarge: 'testLarge.jpg',
            }

            const imageToUpload = new Blob(['0101'], {
                type: 'image/png',
            })

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/users/me/image')
                assert.equal(request.headers['Content-Type'], 'multipart/form-data')
            })

            const result = await services.uploadProfileAvatar(imageToUpload)
            assert.deepStrictEqual(result, data)
        })
    })
})
