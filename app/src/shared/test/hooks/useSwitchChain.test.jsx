import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import * as web3Provider from '$shared/web3/web3Provider'
import * as getConfig from '$shared/web3/config'
import MissingNetworkError from '$shared/errors/MissingNetworkError'
import UnsupportedNetworkError from '$shared/errors/UnsupportedNetworkError'

describe('useSwitchChain', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('prompts to switch chain', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {},
            },
        }))
        const requestStub = jest.fn()
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        await act(async () => {
            await result.switchChain('123')
        })

        expect(requestStub.mock.calls[0][0]).toStrictEqual({
            method: 'wallet_switchEthereumChain',
            params: [{
                chainId: '123',
            }],
        })
    })

    it('prompts to add chain if switching fails', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {
                    getParams: () => ({
                        param1: 'value1',
                        param2: 'value2',
                    }),
                },
            },
        }))
        const requestStub = jest.fn(({ method }) => {
            if (method === 'wallet_switchEthereumChain') {
                const error = new Error()
                error.code = 4902
                throw error
            }
        })
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        await act(async () => {
            try {
                await result.switchChain('123')
            } catch (e) {
                if (e instanceof MissingNetworkError === false) {
                    throw e
                }
            }
        })

        expect(requestStub.mock.calls[0][0]).toStrictEqual({
            method: 'wallet_switchEthereumChain',
            params: [{
                chainId: '123',
            }],
        })
        expect(requestStub.mock.calls[1][0]).toStrictEqual({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '123',
                param1: 'value1',
                param2: 'value2',
            }],
        })
    })

    it('throws a UnsupportedNetworkError if chain is not supported', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({}))
        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {},
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        await act(async () => {
            await expect(result.switchChain('1')).rejects.toThrow(UnsupportedNetworkError)
        })
    })

    it('throws an error if chain switching fails', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        const requestStub = jest.fn(({ method }) => {
            const error = new Error(method)
            throw error
        })
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {},
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        await act(async () => {
            await expect(result.switchChain('123')).rejects.toThrow(/wallet_switchEthereumChain/)
        })
    })

    it('throws an error if chain adding fails', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        const requestStub = jest.fn(({ method }) => {
            const error = new Error(method)
            error.code = 4902
            throw error
        })
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {
                    getParams: () => ({
                        param1: 'value1',
                        param2: 'value2',
                    }),
                },
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        await act(async () => {
            await expect(result.switchChain('123')).rejects.toThrow(/wallet_addEthereumChain/)
        })
    })

    it('sets penging status when switching succeeds', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {},
            },
        }))
        let requestResolve
        const requestPromise = new Promise((resolve) => {
            requestResolve = resolve
        })
        const requestStub = jest.fn(() => requestPromise)
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        expect(result.switchPending).toBe(false)

        act(() => {
            result.switchChain('123')
        })

        expect(result.switchPending).toBe(true)

        await act(async () => {
            await requestResolve()
        })

        expect(result.switchPending).toBe(false)
    })

    it('sets penging status when switching fails', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        mount(<Test />)

        jest.spyOn(getConfig, 'default').mockImplementation(() => ({
            metamask: {
                '123': {},
            },
        }))
        let requestReject
        const requestPromise = new Promise((resolve, reject) => {
            requestReject = reject
        })
        const requestStub = jest.fn(() => requestPromise)
        jest.spyOn(web3Provider, 'getWeb3').mockImplementation(() => ({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => Promise.resolve())

        expect(result.switchPending).toBe(false)

        act(() => {
            result.switchChain('123').catch((e) => {
                if (!/fail/.test(e.message)) {
                    throw e
                }
            })
        })

        expect(result.switchPending).toBe(true)

        await act(async () => {
            await requestReject(new Error('fail'))
        })

        expect(result.switchPending).toBe(false)
    })
})
