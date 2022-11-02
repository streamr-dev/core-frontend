import BN from 'bignumber.js'
import moxios from 'moxios'
import * as services from '$shared/modules/user/services'
import * as utils from '$mp/utils/web3'
import { BalanceType, User } from '$shared/types/user-types'
import setTempEnv from '$app/test/test-utils/setTempEnv'

describe('user - services', () => {
    let dateNowSpy
    const DATE_NOW = 1337
    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })
    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW)
    })
    afterAll(() => {
        dateNowSpy.mockReset()
        dateNowSpy.mockRestore()
    })
    beforeEach(() => {
        moxios.install()
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
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
                expect(request.config.url).toBe('http://localhost/api/v2/users/me?noCache=1337')
            })
            const result = await services.getUserData()
            expect(result).toStrictEqual(data)
        })
    })
    describe('saveCurrentUser', () => {
        it('should PUT the user to the api', async () => {
            const data: User = {
                id: 1,
                name: 'tester',
                email: 'test@tester.test',
                username: 'testonator',
                imageUrlSmall: '',
                imageUrlLarge: 'string'
            }
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })
                expect(request.config.method).toBe('put')
                expect(request.config.url).toBe('http://localhost/api/v2/users/me')
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
                expect(request.config.url).toBe('http://localhost/api/v2/users/me')
            })
            await services.deleteUserAccount()
        })
    })
    describe('updateCurrentUserImage', () => {
        it('should POST the image to the api and PUT the user to the API', async () => {
            const data: User = {
                id: 1,
                name: 'tester',
                email: 'test@tester.test',
                imageUrlSmall: 'testSmall.jpg',
                imageUrlLarge: 'testLarge.jpg',
                username: 'testonator'
            }
            const imageToUpload = new Blob(['0101'], {
                type: 'image/png',
            }) as File
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })
                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe('http://localhost/api/v2/users/me/image')
                expect(request.headers['Content-Type']).toBe('multipart/form-data')
            })
            const result = await services.uploadProfileAvatar(imageToUpload)
            expect(result).toStrictEqual(data)
        })
    })
    describe('createChallenge', () => {
        it('sends a POST request to get a challenge', async () => {
            const account = '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'
            const data = {
                expires: '2018-12-11T09:55:26Z',
                challenge: 'This is a challenge created by Streamr',
                id: '0fWncFCPW4CAeeBYKGAdUuHY8yN0Ty',
            }
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })
                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe(`http://localhost/api/v2/login/challenge/${account}`)
                expect(request.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
            })
            const result = await services.createChallenge(account)
            expect(result).toStrictEqual(data)
        })
    })
    describe('getBalance', () => {
        it('gets ETH balance', async () => {
            jest.spyOn(utils, 'getNativeTokenBalance').mockImplementation(async () => new BN('123'))
            const balance = await services.getBalance({
                address: 'testAccount',
                type: BalanceType.ETH,
            })
            expect(balance).toEqual(new BN('123'))
        })
        it('gets token balance', async () => {
            jest.spyOn(utils, 'getDataTokenBalance').mockImplementation(async () => new BN('123'))
            const balance = await services.getBalance({
                address: 'testAccount',
                type: BalanceType.DATA,
                chainId: 8995,
            })
            expect(balance).toEqual(new BN('123'))
        })
        it('throws an error if type is unknown', async () => {
            let balance
            let error

            try {
                balance = await services.getBalance({
                    address: 'testAccount',
                    type: 'someToken',
                })
            } catch (e) {
                error = e
            }

            expect(error).toBeDefined()
            expect(balance).not.toBeDefined()
        })
    })
})
