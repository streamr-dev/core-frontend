import assert from 'assert-diff'
import moxios from 'moxios'
import sinon from 'sinon'

import * as services from '$shared/modules/integrationKey/services'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as utils from '$mp/utils/web3'
import { BalanceType } from '$shared/flowtype/integration-key-types'

import { integrationKeyServices } from '$shared/utils/constants'
import { Web3NotEnabledError } from '$shared/errors/Web3'

describe('integrationKey - services', () => {
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

    describe('getIntegrationKeys', () => {
        it('gets integration keys', async () => {
            const data = [
                {
                    id: '1234',
                    user: 1234,
                    name: 'Marketplace test',
                    service: integrationKeyServices.ETHEREREUM_IDENTITY,
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

    describe('createPrivateKey', () => {
        it('sends a POST request to create a new integration key', async () => {
            const name = 'My private key'
            const account = {
                address: '0x1234',
                privateKey: '1234567890abcdefgh',
            }
            const data = {
                id: '1',
                name,
                service: integrationKeyServices.PRIVATE_KEY,
                json: {
                    address: account.address,
                },
            }

            const createStub = sandbox.stub().callsFake(() => account)
            const publicWeb3Stub = {
                eth: {
                    accounts: {
                        create: createStub,
                    },
                },
            }
            sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => publicWeb3Stub)

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/integration_keys')
                assert.equal(request.headers['Content-Type'], 'application/json')
                assert.equal(request.config.data, JSON.stringify({
                    name,
                    service: integrationKeyServices.PRIVATE_KEY,
                    json: {
                        privateKey: account.privateKey,
                    },
                }))
            })

            const result = await services.createPrivateKey(name)
            assert.deepStrictEqual(result, data)
            assert(createStub.calledOnce)
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

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `/login/challenge/${account}`)
                assert.equal(request.headers['Content-Type'], 'application/x-www-form-urlencoded')
            })

            const result = await services.createChallenge(account)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('createEthereumIdentity', () => {
        it('sends a POST request to create a new integration key', async () => {
            const name = 'My identity'
            const account = '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'
            const challenge = {
                expires: '2018-12-11T09:55:26Z',
                challenge: 'This is a challenge created by Streamr',
                id: '0fWncFCPW4CAeeBYKGAdUuHY8yN0Ty',
            }
            const signature = 'signature'
            const data = {
                id: '1',
                name,
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
                json: {
                    address: account,
                },
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/integration_keys')
                assert.equal(request.headers['Content-Type'], 'application/json')
                assert.equal(request.config.data, JSON.stringify({
                    name,
                    service: integrationKeyServices.ETHEREREUM_IDENTITY,
                    challenge,
                    signature,
                    address: account,
                }))
            })

            const result = await services.createEthereumIdentity(name, account, challenge, signature)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('createIdentity', () => {
        it('throws an error if web is not enabled', async () => {
            const web3Stub = sandbox.stub(getWeb3, 'default').callsFake(() => ({
                isEnabled: () => false,
            }))

            try {
                await services.createIdentity('test')
            } catch (e) {
                assert(web3Stub.calledOnce)
                assert(e instanceof Web3NotEnabledError)
            }
        })

        it('sends a POST request with the signed challenge', async () => {
            const account = '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'
            const signature = 'signature'
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                isEnabled: () => true,
                getDefaultAccount: () => Promise.resolve(account),
                eth: {
                    personal: {
                        sign: () => Promise.resolve(signature),
                    },
                },
            }))
            const challenge = {
                expires: '2018-12-11T09:55:26Z',
                challenge: 'This is a challenge created by Streamr',
                id: '0fWncFCPW4CAeeBYKGAdUuHY8yN0Ty',
            }
            const name = 'My identity'
            const data = {
                id: '1',
                name,
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
                json: {
                    address: account,
                },
            }
            moxios.stubRequest(`/login/challenge/${account}`, {
                status: 200,
                response: challenge,
            })

            moxios.stubRequest('/integration_keys', {
                status: 200,
                response: data,
            })

            const result = await services.createIdentity('test')
            assert.deepStrictEqual(result, data)
        })
    })

    describe('deleteIntegrationKey', () => {
        it('sends a DELETE request', async () => {
            const id = 'testid'
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 201,
                    response: null,
                })

                assert.equal(request.config.method, 'delete')
                assert.equal(request.config.url, `/integration_keys/${id}`)
            })

            const result = await services.deleteIntegrationKey(id)
            assert.deepStrictEqual(result, null)
        })
    })

    describe('getBalance', () => {
        it('gets ETH balance', async () => {
            sandbox.stub(utils, 'getEthBalance').callsFake(() => '123')

            const balance = await services.getBalance({
                address: 'testAccount',
                type: BalanceType.ETH,
            })

            expect(balance).toBe('123')
        })

        it('gets token balance', async () => {
            sandbox.stub(utils, 'getDataTokenBalance').callsFake(() => '123')

            const balance = await services.getBalance({
                address: 'testAccount',
                type: BalanceType.DATA,
            })
            expect(balance).toBe('123')
        })

        it('throws an error if type is unknown', async () => {
            let balance
            let error
            try {
                balance = await services.getBalance({
                    adress: 'testAccount',
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
