import React from 'react'
import EventEmitter from 'events'
import React from 'react'
import { render, act } from '@testing-library/react'
import * as globalActions from '$mp/modules/global/actions'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as transactionUtils from '$shared/utils/transactions'
import * as web3Utils from '$shared/utils/web3'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'
import { useWalletAccount } from '$shared/stores/wallet'

jest.mock('$shared/stores/wallet', () => ({
    __esModule: true,
    useWalletAccount: jest.fn(),
}))

jest.mock('$mp/modules/global/actions', () => ({
    setEthereumNetworkId: jest.fn().mockImplementation((...args) => void 0),
}))

jest.mock('$mp/modules/transactions/actions', () => ({
    addTransaction: jest.fn().mockImplementation((...args) => void 0),
}))

jest.mock('$shared/hooks/useBalances', () => ({
    useBalances: jest.fn().mockImplementation((): any => ({
        update: () => {},
    })),
}))

jest.mock('redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))

// Skipping for now. It might be deleted soon anyways
describe.skip('GlobalInfoWatcher', () => {
    beforeEach(() => {
        ;(useWalletAccount as any).mockImplementation(() => '0xIMSOAUTHENTICATED')
    })

    const { location } = window
    beforeAll(() => {
        delete window.location
        window.location = {
            ...window.location,
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
    it('stops polling on unmount', () => {
        const clockSpy = jest.spyOn(window, 'clearTimeout')
        act(() => {
            const wrapper = render(<GlobalInfoWatcher />)
            wrapper.unmount()
        })
        expect(clockSpy).toHaveBeenCalledTimes(3)
        expect(Web3Poller.unsubscribe).toHaveBeenCalledTimes(4)
    })
    it('adds pending transactions from storage on mount', () => {
        const transactions = {
            '0x123': 'setDataAllowance',
            '0x456': 'purchase',
        }
        jest.spyOn(web3Utils, 'hasTransactionCompleted').mockImplementation(() =>
            Promise.resolve(false),
        )
        jest.spyOn(
            transactionUtils,
            'getTransactionsFromSessionStorage',
        ).mockImplementation(() => transactions)
        act(() => {
            render(<GlobalInfoWatcher />)
        })
        act(() => {
            // Advance clock for 2s
            jest.advanceTimersByTime(2 * 1000)
        })
        expect(transactionActions.addTransaction).toHaveBeenCalledTimes(2)
    })
    it('reloads page on network change', () => {
        const emitter = new EventEmitter()
        jest.spyOn(Web3Poller, 'subscribe').mockImplementation((event, handler) => {
            emitter.on(event, handler)
        })
        jest.spyOn(Web3Poller, 'unsubscribe').mockImplementation((event, handler) => {
            emitter.off(event, handler)
        })
        act(() => {
            render(<GlobalInfoWatcher />)
        })
        expect(globalActions.setEthereumNetworkId).toHaveBeenCalledTimes(0)
        // defining first time should not reload
        act(() => {
            emitter.emit(events.NETWORK, '8995')
        })
        expect(globalActions.setEthereumNetworkId).toHaveBeenCalledTimes(1)
        // should reload if network was defined
        act(() => {
            emitter.emit(events.NETWORK, '5')
        })
        expect(globalActions.setEthereumNetworkId).toHaveBeenCalledTimes(2)
    })
})
