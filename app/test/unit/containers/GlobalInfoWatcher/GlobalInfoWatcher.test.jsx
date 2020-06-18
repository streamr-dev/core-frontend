import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { act } from 'react-dom/test-utils'
import * as redux from 'react-redux'

import * as getWeb3 from '$shared/web3/web3Provider'
import * as userActions from '$shared/modules/user/actions'
import * as globalActions from '$mp/modules/global/actions'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as transactionUtils from '$shared/utils/transactions'
import * as web3Utils from '$shared/utils/web3'
import Web3Poller from '$shared/web3/web3Poller'
import * as useBalances from '$shared/hooks/useBalances'

import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'

describe('GlobalInfoWatcher', () => {
    let sandbox
    let clock

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        clock = sandbox.useFakeTimers()
    })

    afterEach(() => {
        sandbox.restore()
        clock.restore()
    })

    it('renders the component', () => {
        sandbox.stub(redux, 'useSelector')
        sandbox.stub(redux, 'useDispatch').callsFake(() => (action) => action)
        sandbox.stub(useBalances, 'useBalances').callsFake(() => ({
            update: () => {},
        }))

        const wrapper = mount(<GlobalInfoWatcher />)
        expect(wrapper.length).toEqual(1)
    })

    it('polls usd rate', () => {
        sandbox.stub(redux, 'useSelector')
        sandbox.stub(redux, 'useDispatch').callsFake(() => (action) => action)
        sandbox.stub(useBalances, 'useBalances').callsFake(() => ({
            update: () => {},
        }))
        const dataPerUsdStub = sandbox.stub(globalActions, 'getDataPerUsd')

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        expect(dataPerUsdStub.calledOnce).toBe(true)

        // Advance clock for 7h
        act(() => {
            clock.tick(1000 * 60 * 60 * 7)
        })
        expect(dataPerUsdStub.callCount).toEqual(2)
    })

    it('polls login', () => {
        sandbox.stub(redux, 'useSelector')
        sandbox.stub(redux, 'useDispatch').callsFake(() => (action) => action)
        sandbox.stub(useBalances, 'useBalances').callsFake(() => ({
            update: () => {},
        }))
        const userDataStub = sandbox.stub(userActions, 'getUserData')

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        expect(userDataStub.calledOnce).toBe(true)

        // Advance clock for 6min
        act(() => {
            clock.tick(1000 * 60 * 6)
        })
        expect(userDataStub.callCount).toEqual(2)
    })

    it('stops polling on unmount', () => {
        sandbox.stub(redux, 'useSelector')
        sandbox.stub(redux, 'useDispatch').callsFake(() => (action) => action)
        sandbox.stub(useBalances, 'useBalances').callsFake(() => ({
            update: () => {},
        }))
        sandbox.stub(Web3Poller, 'unsubscribe')

        const clockSpy = sinon.spy(clock, 'clearTimeout')

        act(() => {
            const wrapper = mount(<GlobalInfoWatcher />)
            wrapper.unmount()
        })

        expect(clockSpy.callCount).toEqual(5)
        expect(Web3Poller.unsubscribe.callCount).toEqual(2)
    })

    it('adds pending transactions from storage on mount', () => {
        const transactions = {
            '0x123': 'setDataAllowance',
            '0x456': 'purchase',
        }

        sandbox.stub(redux, 'useSelector')
        sandbox.stub(redux, 'useDispatch').callsFake(() => (action) => action)
        sandbox.stub(useBalances, 'useBalances').callsFake(() => ({
            update: () => {},
        }))
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
        const networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
            getEthereumNetwork: networkStub,
        }))
        sandbox.stub(web3Utils, 'hasTransactionCompleted').callsFake(() => Promise.resolve(false))
        sandbox.stub(transactionUtils, 'getTransactionsFromSessionStorage').callsFake(() => transactions)
        const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        act(() => {
            // Advance clock for 2s
            clock.tick(2 * 1000)
        })

        expect(addTransactionStub.callCount).toEqual(2)
    })
})
