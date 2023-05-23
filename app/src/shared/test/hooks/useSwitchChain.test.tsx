import React from 'react'
import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import * as getConfig from '$shared/web3/config'
import MissingNetworkError from '$shared/errors/MissingNetworkError'
import UnsupportedNetworkError from '$shared/errors/UnsupportedNetworkError'
import getWeb3 from '$utils/web3/getWeb3'
import validateWeb3 from '$utils/web3/validateWeb3'
jest.mock('$utils/web3/getWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))
jest.mock('$utils/web3/validateWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

function mockGetWeb3(value) {
    return (getWeb3 as any).mockImplementation(() => value)
}

function mockValidateWeb3(value) {
    return (validateWeb3 as any).mockImplementation(() => value)
}

describe('useSwitchChain', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks();
        (getWeb3 as any)?.mockReset()
        (validateWeb3 as any)?.mockReset()
    })
    it('prompts to switch chain', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        render(<Test />)
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {},
            },
        }))
        const requestStub = jest.fn()
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        mockValidateWeb3(Promise.resolve())
        await act(async () => {
            await result.switchChain('123')
        })
        expect(requestStub.mock.calls[0][0]).toStrictEqual({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: '123',
                },
            ],
        })
    })
    it('prompts to add chain if switching fails', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        render(<Test />)
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
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
                const error = new Error();
                (error as any).code = 4902
                throw error
            }
        })
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        mockValidateWeb3(Promise.resolve())
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
            params: [
                {
                    chainId: '123',
                },
            ],
        })
        expect(requestStub.mock.calls[1][0]).toStrictEqual({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '123',
                    param1: 'value1',
                    param2: 'value2',
                },
            ],
        })
    })
    it('throws a UnsupportedNetworkError if chain is not supported', async () => {
        let result

        function Test() {
            result = useSwitchChain()
            return null
        }

        render(<Test />)
        mockGetWeb3({})
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {},
            },
        }))
        mockValidateWeb3(Promise.resolve())
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

        render(<Test />)
        const requestStub = jest.fn(({ method }) => {
            const error = new Error(method)
            throw error
        })
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {},
            },
        }))
        mockValidateWeb3(Promise.resolve())
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

        render(<Test />)
        const requestStub = jest.fn(({ method }) => {
            const error = new Error(method);
            (error as any).code = 4902
            throw error
        })
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {
                    getParams: () => ({
                        param1: 'value1',
                        param2: 'value2',
                    }),
                },
            },
        }))
        mockValidateWeb3(Promise.resolve())
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

        render(<Test />)
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {},
            },
        }))
        let requestResolve
        const requestPromise = new Promise((resolve) => {
            requestResolve = resolve
        })
        const requestStub = jest.fn(() => requestPromise)
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        mockValidateWeb3(Promise.resolve())
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

        render(<Test />)
        jest.spyOn(getConfig, 'default').mockImplementation((): any => ({
            metamask: {
                '123': {},
            },
        }))
        let requestReject
        const requestPromise = new Promise((resolve, reject) => {
            requestReject = reject
        })
        const requestStub = jest.fn(() => requestPromise)
        mockGetWeb3({
            currentProvider: {
                request: requestStub,
            },
            utils: {
                toHex: (number) => number,
            },
        })
        mockValidateWeb3(Promise.resolve())
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
