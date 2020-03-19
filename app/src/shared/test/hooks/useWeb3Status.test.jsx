import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'
import EventEmitter from 'events'

import * as web3Provider from '$shared/web3/web3Provider'
import Web3Poller from '$shared/web3/web3Poller'

import useWeb3Status from '$shared/hooks/useWeb3Status'

describe('useWeb3Status', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
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

        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve(account))

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = sandbox.stub(web3Provider, 'validateWeb3')

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBe(account)
        expect(defaultAccountStub.calledOnce).toBe(true)
        expect(validateWeb3Stub.calledOnce).toBe(true)
        expect(result.isLocked).toBe(false)
    })

    it('returns an error if validation fails', async () => {
        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve(account))

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = sandbox.stub(web3Provider, 'validateWeb3').callsFake(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(defaultAccountStub.calledOnce).toBe(false)
        expect(validateWeb3Stub.calledOnce).toBe(true)
        expect(result.isLocked).toBe(true)
    })

    it('returns an error if web3.getDefaultAccount() fails', async () => {
        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const defaultAccountStub = sandbox.stub().callsFake(() => {
            throw new Error('no account')
        })

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const validateWeb3Stub = sandbox.stub(web3Provider, 'validateWeb3')

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('no account')
        expect(defaultAccountStub.calledOnce).toBe(true)
        expect(validateWeb3Stub.calledOnce).toBe(true)
        expect(result.isLocked).toBe(true)
    })

    it('subscribes to listen to account changes on mount', async () => {
        const subscribeStub = sandbox.stub(Web3Poller, 'subscribe')

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        sandbox.stub(web3Provider, 'validateWeb3').callsFake(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(subscribeStub.calledOnce).toBe(true)
        expect(result.isLocked).toBe(true)
    })

    it('unsubscribes on unmount', async () => {
        const unsubscribeStub = sandbox.stub(Web3Poller, 'unsubscribe')

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        sandbox.stub(web3Provider, 'validateWeb3').callsFake(() => {
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

        expect(unsubscribeStub.calledOnce).toBe(true)
    })

    it('returns the next account when new account is detected', async () => {
        const emitter = new EventEmitter()

        // subscribe is called twice, once for ACCOUNT and ACCOUNT_ERROR event
        // save handlers to differentiate between them
        const handlers = {}
        const subscribeStub = sandbox.stub(Web3Poller, 'subscribe').callsFake((event, handler) => {
            handlers[event] = handler
            emitter.on(event, handler)
        })

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const validateWeb3Stub = sandbox.stub(web3Provider, 'validateWeb3').callsFake(() => {
            throw new Error('unlocked')
        })

        await act(async () => {
            mount(<Test />)
        })

        expect(result.account).toBeFalsy()
        expect(result.web3Error).toBeTruthy()
        expect(result.web3Error.message).toBe('unlocked')
        expect(validateWeb3Stub.calledOnce).toBe(true)
        expect(result.isLocked).toBe(true)

        const account = '0x123'

        await act(async () => {
            emitter.emit(Web3Poller.events.ACCOUNT, account)
        })

        expect(result.account).toBe(account)
        expect(result.web3Error).toBeFalsy()
        expect(subscribeStub.calledWithExactly(Web3Poller.events.ACCOUNT, handlers[Web3Poller.events.ACCOUNT])).toBe(true)
        expect(result.isLocked).toBe(false)
    })

    it('subscribes to listen to account error when an account is received', async () => {
        const account = '0x123'
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve(account))

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        sandbox.stub(web3Provider, 'validateWeb3')
        const handlers = {}
        const subscribeStub = sandbox.stub(Web3Poller, 'subscribe').callsFake((event, handler) => {
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
        expect(subscribeStub.calledWithExactly(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])).toBe(true)
        expect(result.isLocked).toBe(false)
    })

    it('returns an error if account lock is detected & unsubscribes error listener', async () => {
        const emitter = new EventEmitter()

        sandbox.stub(Web3Poller, 'subscribe').callsFake((event, handler) => {
            emitter.on(event, handler)
        })
        const handlers = {}
        const unsubscribeStub = sandbox.stub(Web3Poller, 'unsubscribe').callsFake((event, handler) => {
            handlers[event] = handler
        })

        let result
        const Test = () => {
            result = useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve(account))

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        sandbox.stub(web3Provider, 'validateWeb3')

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
        expect(unsubscribeStub.calledWithExactly(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])).toBe(true)
    })

    it('unsubscribes error account error listener on unmount', async () => {
        const handlers = {}
        const unsubscribeStub = sandbox.stub(Web3Poller, 'unsubscribe').callsFake((event, handler) => {
            handlers[event] = handler
        })

        const Test = () => {
            useWeb3Status()
            return null
        }

        const account = '0x123'
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve(account))

        sandbox.stub(web3Provider, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        sandbox.stub(web3Provider, 'validateWeb3')

        let el
        await act(async () => {
            el = mount(<Test />)
        })

        await act(async () => {
            el.unmount()
        })

        expect(unsubscribeStub.calledWithExactly(Web3Poller.events.ACCOUNT_ERROR, handlers[Web3Poller.events.ACCOUNT_ERROR])).toBe(true)
    })

    it('doesnt subscribe to account error listener if there is no account', async () => {
        const subscribeHandlers = {}
        const subscribeStub = sandbox.stub(Web3Poller, 'subscribe').callsFake((event, handler) => {
            subscribeHandlers[event] = handler
        })
        const unsubscribeHandlers = {}
        const unsubscribeStub = sandbox.stub(Web3Poller, 'unsubscribe').callsFake((event, handler) => {
            unsubscribeHandlers[event] = handler
        })

        const Test = () => {
            useWeb3Status()
            return null
        }

        sandbox.stub(web3Provider, 'validateWeb3').callsFake(() => {
            throw new Error('unlocked')
        })

        let el
        await act(async () => {
            el = mount(<Test />)
        })

        await act(async () => {
            el.unmount()
        })

        expect(subscribeStub.neverCalledWith(
            Web3Poller.events.ACCOUNT_ERROR,
            subscribeHandlers[Web3Poller.events.ACCOUNT_ERROR],
        )).toBe(true)
        expect(unsubscribeStub.neverCalledWith(
            Web3Poller.events.ACCOUNT_ERROR,
            unsubscribeHandlers[Web3Poller.events.ACCOUNT_ERROR],
        )).toBe(true)
    })
})
