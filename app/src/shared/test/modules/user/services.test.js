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
        jest.clearAllMocks()
        jest.restoreAllMocks()
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

                expect(request.config.method).toBe('get')
                expect(request.config.url).toBe('/users/me?noCache=1337')
            })

            const result = await services.getUserData()
            expect(result).toStrictEqual(data)
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

                expect(request.config.method).toBe('put')
                expect(request.config.url).toBe('/users/me')
                expect(request.headers['Content-Type']).toBe('application/json')
            })

            const result = await services.putUser(data)
            expect(result).toStrictEqual(data)
        })
    })

    describe('deleteCurrentUser', () => {
        it('deletes the current user account', async () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 204,
                })

                expect(request.config.method).toBe('delete')
                expect(request.config.url).toBe('/users/me')
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

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe('/users/me/image')
                expect(request.headers['Content-Type']).toBe('multipart/form-data')
            })

            const result = await services.uploadProfileAvatar(imageToUpload)
            expect(result).toStrictEqual(data)
        })
    })
})
