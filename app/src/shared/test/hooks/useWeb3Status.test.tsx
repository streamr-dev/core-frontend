import EventEmitter from 'events'
import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import validateWeb3 from '$utils/web3/validateWeb3'
jest.mock('$utils/web3/validateWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

function mockValidateWeb3(value?: any) {
    const validateWeb3Mock = validateWeb3 as jest.Mock
    return validateWeb3Mock.mockImplementation(value)
}

jest.mock('$utils/web3/getDefaultWeb3Account', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockDefaultAccount(defaultAccount) {
    const getDefaultWeb3AccountMock = getDefaultWeb3Account as jest.Mock
    return getDefaultWeb3AccountMock.mockImplementation(() => Promise.resolve(defaultAccount))
}

describe('useWeb3Status', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks();
        (getDefaultWeb3Account as jest.Mock).mockReset()
        const validateMock = validateWeb3 as jest.Mock
        validateMock.mockReset()
    })
    it('does nothing if requireWeb3 parameter is false', () => {
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: false,
            })
            return null
        }
        render(<Test />)
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeFalsy()
        expect(result.checkingWeb3).toBeFalsy()
        expect(result.isLocked).toBe(true)
    })
    it('validates and returns the current account', async () => {
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        const account = '0x123'
        const stub = mockDefaultAccount(account)
        const validateWeb3Stub = mockValidateWeb3(() => {})
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBe(account)
        expect(stub).toHaveBeenCalledTimes(1)
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(false)
    })
    it('returns an error if validation fails', async () => {
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        const account = '0x123'
        const stub = mockDefaultAccount(account)
        const validateWeb3Stub = mockValidateWeb3(() => {
            throw new Error('unlocked')
        })
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(stub).not.toBeCalled()
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
    })
    it('returns an error if `getDefaultWeb3Account` fails', async () => {
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        const stub = (getDefaultWeb3Account as jest.Mock).mockImplementation(() => Promise.reject(new Error('no account')))
        const validateWeb3Stub = mockValidateWeb3(() => {})
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('no account')
        expect(stub).toHaveBeenCalledTimes(1)
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
    })
    it('subscribes to listen to account changes on mount', async () => {
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe')
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        mockValidateWeb3(() => {
            throw new Error('unlocked')
        })
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(subscribeStub).toHaveBeenCalledTimes(4)
        expect(result.isLocked).toBe(true)
    })
    it('unsubscribes on unmount', async () => {
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe')
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        mockValidateWeb3(() => {
            throw new Error('unlocked')
        })
        let el
        await act(async () => {
            el = render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.isLocked).toBe(true)
        await act(async () => {
            el.unmount()
        })
        expect(unsubscribeStub).toHaveBeenCalledTimes(4)
    })
    it('returns the next account when new account is detected', async () => {
        const emitter = new EventEmitter()
        // subscribe is called twice, once for ACCOUNT and ACCOUNT_ERROR event
        // save handlers to differentiate between them
        const handlers = {}
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
            emitter.on(event, handler)
        })
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        let validateWeb3Stub = mockValidateWeb3(() => {
            throw new Error('unlocked')
        })
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
        const account = '0x123'
        mockDefaultAccount(account)
        validateWeb3Stub.mockRestore()
        validateWeb3Stub = mockValidateWeb3(() => {})
        await act(async () => {
            emitter.emit(events.ACCOUNT, account)
        })
        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(subscribeStub).toBeCalledWith(events.ACCOUNT, handlers[events.ACCOUNT])
        expect(result.isLocked).toBe(false)
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
    })
    it('does not overwrite the error state when new account is received', async () => {
        const emitter = new EventEmitter()
        // subscribe is called twice, once for ACCOUNT and ACCOUNT_ERROR event
        // save handlers to differentiate between them
        jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            emitter.on(event, handler)
        })
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        const validateWeb3Stub = mockValidateWeb3(() => {
            throw new Error('wrong network')
        })
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('wrong network')
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
        const account = '0x123'
        mockDefaultAccount(account)
        await act(async () => {
            emitter.emit(events.ACCOUNT, account)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy() // validate should still return error

        expect(validateWeb3Stub).toHaveBeenCalledTimes(2)
        expect(result.isLocked).toBe(true)
    })
    it('subscribes to listen to account error when an account is received', async () => {
        const account = '0x123'
        mockDefaultAccount(account)
        mockValidateWeb3(() => {})
        const handlers = {}
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
        })
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(subscribeStub).toBeCalledWith(events.ACCOUNT_ERROR, handlers[events.ACCOUNT_ERROR])
        expect(result.isLocked).toBe(false)
    })
    it('returns an error if account lock is detected & unsubscribes error listener', async () => {
        const emitter = new EventEmitter()
        jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            emitter.on(event, handler)
        })
        const handlers = {}
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
        })
        let result

        const Test = () => {
            result = useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        const account = '0x123'
        mockDefaultAccount(account)
        mockValidateWeb3()
        await act(async () => {
            render(<Test />)
        })
        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(result.isLocked).toBe(false)
        await act(async () => {
            emitter.emit(events.ACCOUNT_ERROR)
        })
        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.isLocked).toBe(true)
        expect(unsubscribeStub).toBeCalledWith(events.ACCOUNT_ERROR, handlers[events.ACCOUNT_ERROR])
        expect(unsubscribeStub).toBeCalledWith(events.NETWORK_ERROR, handlers[events.NETWORK_ERROR])
    })
    it('unsubscribes error account error listener on unmount', async () => {
        const handlers = {}
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
        })

        const Test = () => {
            useWeb3Status({
                requireWeb3: true,
            })
            return null
        }

        mockValidateWeb3()
        let renderResult
        await act(async () => {
            renderResult = render(<Test />)
        })
        await act(async () => {
            renderResult.unmount()
        })
        expect(unsubscribeStub).toBeCalledWith(events.ACCOUNT_ERROR, handlers[events.ACCOUNT_ERROR])
    })
})
