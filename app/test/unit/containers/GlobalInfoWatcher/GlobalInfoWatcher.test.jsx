import React from 'react'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import * as getWeb3 from '$shared/web3/web3Provider'
import * as web3Actions from '$mp/modules/web3/actions'
import * as userActions from '$shared/modules/user/actions'
import * as globalActions from '$mp/modules/global/actions'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as transactionUtils from '$shared/utils/transactions'
import * as web3Utils from '$shared/utils/web3'
import Web3Poller from '$shared/web3/web3Poller'

import { GlobalInfoWatcher, mapStateToProps, mapDispatchToProps } from '$mp/containers/GlobalInfoWatcher'

describe('GlobalInfoWatcher', () => {
    let wrapper
    let props
    let sandbox
    let clock

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        clock = sandbox.useFakeTimers()

        props = {
            account: null,
            receiveAccount: sandbox.spy(),
            changeAccount: sandbox.spy(),
            accountError: sandbox.spy(),
            getUserData: sandbox.spy(),
            getDataPerUsd: sandbox.spy(),
            updateEthereumNetworkId: sandbox.spy(),
            addTransaction: sandbox.spy(),
            completeTransaction: sandbox.spy(),
            transactionError: sandbox.spy(),
            children: null,
            networkId: null,
        }
    })

    afterEach(() => {
        sandbox.restore()
        clock.restore()
    })

    it('renders the component', () => {
        wrapper = mount(<GlobalInfoWatcher {...props} />)
        expect(wrapper.length).toEqual(1)
    })

    it('maps state to props', () => {
        const account = 'testAccount'
        const dataPerUsd = 1
        const networkId = '4'
        const state = {
            web3: {
                accountId: account,
                ethereumNetworkId: networkId,
            },
            global: {
                dataPerUsd,
            },
        }
        const expectedProps = {
            account,
            dataPerUsd,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const receiveAccountStub = sandbox.stub(web3Actions, 'receiveAccount').callsFake(() => 'receiveAccount')
        const changeAccountStub = sandbox.stub(web3Actions, 'changeAccount').callsFake(() => 'changeAccount')
        const accountErrorStub = sandbox.stub(web3Actions, 'accountError').callsFake(() => 'accountError')
        sandbox.stub(userActions, 'getUserData').callsFake(() => 'getUserData')
        sandbox.stub(globalActions, 'getDataPerUsd').callsFake(() => 'getDataPerUsd')
        const updateEthereumNetworkIdStub = sandbox.stub(web3Actions, 'updateEthereumNetworkId').callsFake(() => 'updateEthereumNetworkId')
        const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction').callsFake(() => 'addTransaction')
        const completeTransactionStub = sandbox.stub(transactionActions, 'completeTransaction').callsFake(() => 'completeTransaction')
        const transactionErrorStub = sandbox.stub(transactionActions, 'transactionError').callsFake(() => 'transactionError')

        const actions = mapDispatchToProps(dispatchStub)
        const result = {
            receiveAccount: actions.receiveAccount('testAccount'),
            changeAccount: actions.changeAccount('anotherAccount'),
            accountError: actions.accountError('testError'),
            getUserData: actions.getUserData(),
            getDataPerUsd: actions.getDataPerUsd(),
            updateEthereumNetworkId: actions.updateEthereumNetworkId('1'),
            addTransaction: actions.addTransaction('txHash', 'purchase'),
            completeTransaction: actions.completeTransaction('txHash', 'receipt'),
            transactionError: actions.transactionError('txHash', 'error'),
        }
        const expectedResult = {
            receiveAccount: 'receiveAccount',
            changeAccount: 'changeAccount',
            accountError: 'accountError',
            getUserData: 'getUserData',
            getDataPerUsd: 'getDataPerUsd',
            updateEthereumNetworkId: 'updateEthereumNetworkId',
            addTransaction: 'addTransaction',
            completeTransaction: 'completeTransaction',
            transactionError: 'transactionError',
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
        expect(receiveAccountStub.calledWith('testAccount')).toEqual(true)
        expect(changeAccountStub.calledWith('anotherAccount')).toEqual(true)
        expect(accountErrorStub.calledWith('testError')).toEqual(true)
        expect(updateEthereumNetworkIdStub.calledWith('1')).toEqual(true)
        expect(addTransactionStub.calledWith('txHash', 'purchase')).toEqual(true)
        expect(completeTransactionStub.calledWith('txHash', 'receipt')).toEqual(true)
        expect(transactionErrorStub.calledWith('txHash', 'error')).toEqual(true)
    })

    it('starts polling on mount', () => {
        const clockSpy = sinon.spy(clock, 'setTimeout')
        sandbox.stub(Web3Poller, 'subscribe')

        wrapper = mount(<GlobalInfoWatcher {...props} />)
        expect(props.getDataPerUsd.calledOnce).toEqual(true)
        expect(props.getUserData.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(3)

        expect(Web3Poller.subscribe.callCount).toEqual(5)
        expect(Web3Poller.subscribe.calledWith(Web3Poller.events.ACCOUNT_ERROR, wrapper.handleAccountError))
        expect(Web3Poller.subscribe.calledWith(Web3Poller.events.ACCOUNT, wrapper.handleAccount))
        expect(Web3Poller.subscribe.calledWith(Web3Poller.events.NETWORK, wrapper.handleNetwork))
        expect(Web3Poller.subscribe.calledWith(Web3Poller.events.TRANSACTION_COMPLETE, wrapper.handleTransactionComplete))
        expect(Web3Poller.subscribe.calledWith(Web3Poller.events.TRANSACTION_ERROR, wrapper.handleTransactionError))
    })

    it('polls for login', () => {
        wrapper = shallow(<GlobalInfoWatcher {...props} />)

        const pollLoginSpy = sandbox.spy(wrapper.instance(), 'pollLogin')

        // Advance clock for 12min
        clock.tick(12 * 60 * 1000)
        expect(pollLoginSpy.callCount).toEqual(1)
    })

    it('polls for USD rate', () => {
        wrapper = shallow(<GlobalInfoWatcher {...props} />)

        const pollDataPerUsdRateSpy = sandbox.spy(wrapper.instance(), 'pollDataPerUsdRate')
        // Advance clock for 12hours
        clock.tick(12 * 60 * 60 * 1000)
        expect(pollDataPerUsdRateSpy.callCount).toEqual(1)
    })

    it('stops polling on unmount', () => {
        sandbox.stub(Web3Poller, 'unsubscribe')

        wrapper = mount(<GlobalInfoWatcher {...props} />)

        const dataPerUsdSpy = sandbox.spy(wrapper.instance(), 'clearDataPerUsdRatePoll')
        const loginPollSpy = sandbox.spy(wrapper.instance(), 'clearLoginPoll')

        const clockSpy = sinon.spy(clock, 'clearTimeout')

        wrapper.unmount()
        expect(dataPerUsdSpy.calledOnce).toEqual(true)
        expect(loginPollSpy.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(2)
        expect(Web3Poller.unsubscribe.callCount).toEqual(5)
        expect(Web3Poller.unsubscribe.calledWith(Web3Poller.events.ACCOUNT_ERROR, wrapper.handleAccountError))
        expect(Web3Poller.unsubscribe.calledWith(Web3Poller.events.ACCOUNT, wrapper.handleAccount))
        expect(Web3Poller.unsubscribe.calledWith(Web3Poller.events.NETWORK, wrapper.handleNetwork))
        expect(Web3Poller.unsubscribe.calledWith(Web3Poller.events.TRANSACTION_COMPLETE, wrapper.handleTransactionComplete))
        expect(Web3Poller.unsubscribe.calledWith(Web3Poller.events.TRANSACTION_ERROR, wrapper.handleTransactionError))
    })

    it('adds pending transactions from storage on mount', () => {
        const transactions = {
            '0x123': 'setAllowance',
            '0x456': 'purchase',
        }

        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
        const networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
            getEthereumNetwork: networkStub,
        }))
        sandbox.stub(web3Utils, 'hasTransactionCompleted').callsFake(() => Promise.resolve(false))
        sandbox.stub(transactionUtils, 'getTransactionsFromSessionStorage').callsFake(() => transactions)

        wrapper = mount(<GlobalInfoWatcher {...props} />)

        // Advance clock for 2s
        clock.tick(2 * 1000)

        expect(props.addTransaction.callCount).toEqual(2)
    })
})
