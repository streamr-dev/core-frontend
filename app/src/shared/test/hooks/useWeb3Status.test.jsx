import EventEmitter from 'events'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import * as web3Provider from '$shared/web3/web3Provider'
import Web3Poller from '$shared/web3/web3Poller'

import useWeb3Status from '$shared/hooks/useWeb3Status'

describe('useWeb3Status', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('does nothing if requireWeb3 parameter is false', () => {
        let result
        const Test = () => {
            result = useWeb3Status(false)
            return null
        }

        mount(<Test />)

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeFalsy()
        expect(result.checkingWeb3).toBeFalsy()
        expect(result.isLocked).toBe(true)
    })

    it('validates and returns the current account', async () => {
        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const account = '0x123'

        const defaultAccountStub = jest.fn(() => Promise.resolve(account))
        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBe(account)
        expect(defaultAccountStub).toHaveBeenCalledTimes(1)
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(false)
    })

    it('returns an error if validation fails', async () => {
        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(defaultAccountStub).not.toBeCalled()
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
    })

    it('returns an error if web3.getDefaultAccount() fails', async () => {
        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const defaultAccountStub = jest.fn(() => {
            throw new Error('no account')
        })

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('no account')
        expect(defaultAccountStub).toHaveBeenCalledTimes(1)
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)
    })

    it('subscribes to listen to account changes on mount', async () => {
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe')

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(subscribeStub).toHaveBeenCalledTimes(2)
        expect(result.isLocked).toBe(true)
    })

    it('unsubscribes on unmount', async () => {
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe')

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('unlocked')
        })

        let el
        await act(async () => {
            el = mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.isLocked).toBe(true)

        await act(async () => {
            el.unmount()
        })

        expect(unsubscribeStub).toHaveBeenCalledTimes(2)
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
            result = useWeb3Status()
            return null
        }

        let validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)

        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))

        validateWeb3Stub.mockRestore()
        validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()
        await act(async () => {
            emitter.emit(Web3Poller.events.ACCOUNT, account)
        })

        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(subscribeStub).toBeCalledWith(Web3Poller.events.ACCOUNT, handlers[Web3Poller.events.ACCOUNT])
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
            result = useWeb3Status()
            return null
        }

        const validateWeb3Stub = jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('wrong network')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('wrong network')
        expect(validateWeb3Stub).toHaveBeenCalledTimes(1)
        expect(result.isLocked).toBe(true)

        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))

        await act(async () => {
            emitter.emit(Web3Poller.events.ACCOUNT, account)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy() // validate should still return error
        expect(validateWeb3Stub).toHaveBeenCalledTimes(2)
        expect(result.isLocked).toBe(true)
    })

    it('subscribes to listen to account error when an account is received', async () => {
        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()
        const handlers = {}
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
        })

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }
        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(subscribeStub).toBeCalledWith(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])
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
            result = useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(result.isLocked).toBe(false)

        await act(async () => {
            emitter.emit(Web3Poller.events.ACCOUNT_ERROR)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.isLocked).toBe(true)
        expect(unsubscribeStub).toBeCalledWith(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])
    })

    it('unsubscribes error account error listener on unmount', async () => {
        const handlers = {}
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            handlers[event] = handler
        })

        const Test = () => {
            useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = jest.fn(() => Promise.resolve(account))

        jest.spyOn(web3Provider, 'default').mockImplementation(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation()

        let el
        await act(async () => {
            el = mount(<Test />)
        })

        await act(async () => {
            el.unmount()
        })

        expect(unsubscribeStub).toBeCalledWith(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])
    })

    it('doesnt subscribe to account error listener if there is no account', async () => {
        const subscribeHandlers = {}
        const subscribeStub = jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            subscribeHandlers[event] = handler
        })
        const unsubscribeHandlers = {}
        const unsubscribeStub = jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            unsubscribeHandlers[event] = handler
        })

        const Test = () => {
            useWeb3Status()
            return null
        }

        jest.spyOn(web3Provider, 'validateWeb3').mockImplementation(() => {
            throw new Error('unlocked')
        })

        let el
        await act(async () => {
            el = mount(<Test />)
        })

        await act(async () => {
            el.unmount()
        })

        expect(subscribeStub).not.toBeCalledWith(
            Web3Poller.events.ACCOUNT_ERROR,
            subscribeHandlers[Web3Poller.events.ACCOUNT_ERROR],
        )
        expect(unsubscribeStub).not.toBeCalledWith(
            Web3Poller.events.ACCOUNT_ERROR,
            unsubscribeHandlers[Web3Poller.events.ACCOUNT_ERROR],
        )
    })
})
