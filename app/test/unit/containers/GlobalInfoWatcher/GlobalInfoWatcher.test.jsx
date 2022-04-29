import EventEmitter from 'events'
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import * as redux from 'react-redux'

import * as userActions from '$shared/modules/user/actions'
import * as globalActions from '$mp/modules/global/actions'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as transactionUtils from '$shared/utils/transactions'
import * as web3Utils from '$shared/utils/web3'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import * as useBalances from '$shared/hooks/useBalances'

import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'

describe('GlobalInfoWatcher', () => {
    const { location } = window

    beforeAll(() => {
        delete window.location
        window.location = {
            reload: jest.fn(),
        }
    })

    afterAll(() => {
        window.location = location
    })

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('renders the component', () => {
        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)
        jest.spyOn(useBalances, 'useBalances').mockImplementation(() => ({
            update: () => {},
        }))

        const wrapper = mount(<GlobalInfoWatcher />)
        expect(wrapper.length).toEqual(1)
    })

    it('polls usd rate', () => {
        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)
        jest.spyOn(useBalances, 'useBalances').mockImplementation(() => ({
            update: () => {},
        }))
        const dataPerUsdStub = jest.spyOn(globalActions, 'getDataPerUsd').mockImplementation()

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        expect(dataPerUsdStub).toHaveBeenCalledTimes(1)

        // Advance clock for 7h
        act(() => {
            jest.advanceTimersByTime(1000 * 60 * 60 * 7)
        })
        expect(dataPerUsdStub).toHaveBeenCalledTimes(3)
    })

    it('polls login', () => {
        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)
        jest.spyOn(useBalances, 'useBalances').mockImplementation(() => ({
            update: () => {},
        }))
        const userDataStub = jest.spyOn(userActions, 'getUserData').mockImplementation()

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        expect(userDataStub).toHaveBeenCalledTimes(1)

        // Advance clock for 6min
        act(() => {
            jest.advanceTimersByTime(1000 * 60 * 6)
        })
        expect(userDataStub).toHaveBeenCalledTimes(4)
    })

    it('stops polling on unmount', () => {
        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)
        jest.spyOn(useBalances, 'useBalances').mockImplementation(() => ({
            update: () => {},
        }))
        jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation()

        const clockSpy = jest.spyOn(window, 'clearTimeout')

        act(() => {
            const wrapper = mount(<GlobalInfoWatcher />)
            wrapper.unmount()
        })

        expect(clockSpy).toHaveBeenCalledTimes(5)
        expect(Web3Poller.unsubscribe).toHaveBeenCalledTimes(6)
    })

    it('adds pending transactions from storage on mount', () => {
        const transactions = {
            '0x123': 'setDataAllowance',
            '0x456': 'purchase',
        }

        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)
        jest.spyOn(useBalances, 'useBalances').mockImplementation(() => ({
            update: () => {},
        }))
        jest.spyOn(web3Utils, 'hasTransactionCompleted').mockImplementation(() => Promise.resolve(false))
        jest.spyOn(transactionUtils, 'getTransactionsFromSessionStorage').mockImplementation(() => transactions)
        const addTransactionStub = jest.spyOn(transactionActions, 'addTransaction').mockImplementation()

        act(() => {
            mount(<GlobalInfoWatcher />)
        })

        act(() => {
            // Advance clock for 2s
            jest.advanceTimersByTime(2 * 1000)
        })

        expect(addTransactionStub).toHaveBeenCalledTimes(2)
    })

    it('reloads page on network change', () => {
        jest.spyOn(redux, 'useSelector').mockImplementation()
        jest.spyOn(redux, 'useDispatch').mockImplementation(() => (action) => action)

        const emitter = new EventEmitter()

        jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            emitter.on(event, handler)
        })
        jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            emitter.off(event, handler)
        })
        const setEthereumNetworkIdStub = jest.spyOn(globalActions, 'setEthereumNetworkId').mockImplementation()

        act(() => {
            mount(<GlobalInfoWatcher />)
        })
        expect(setEthereumNetworkIdStub).toHaveBeenCalledTimes(0)

        // defining first time should not reload
        act(() => {
            emitter.emit(events.NETWORK, '8995')
        })
        expect(setEthereumNetworkIdStub).toHaveBeenCalledTimes(1)

        // should reload if network was defined
        act(() => {
            emitter.emit(events.NETWORK, '5')
        })
        expect(setEthereumNetworkIdStub).toHaveBeenCalledTimes(2)
    })
})
