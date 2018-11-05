import React from 'react'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import * as getWeb3 from '$mp/web3/web3Provider'
import * as web3Actions from '$mp/modules/web3/actions'
import * as userActions from '$mp/modules/user/actions'
import * as globalActions from '$mp/modules/global/actions'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as transactionServices from '$mp/modules/transactions/services'
import * as web3Utils from '$mp/utils/web3'

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
            checkWeb3: sandbox.spy(),
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
            networkId,
            isWeb3Injected: false,
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
        sandbox.stub(globalActions, 'checkWeb3').callsFake(() => 'checkWeb3')
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
            checkWeb3: actions.checkWeb3(),
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
            checkWeb3: 'checkWeb3',
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
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
        const networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
            getEthereumNetwork: networkStub,
        }))

        const clockSpy = sinon.spy(clock, 'setTimeout')

        wrapper = mount(<GlobalInfoWatcher {...props} />)
        expect(props.getDataPerUsd.calledOnce).toEqual(true)
        expect(props.getUserData.calledOnce).toEqual(true)
        expect(defaultAccountStub.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(6)
    })

    it('polls web3 account', () => {
        wrapper = shallow(<GlobalInfoWatcher {...props} />)
        const pollWeb3Spy = sandbox.spy(wrapper.instance(), 'pollWeb3')

        // Advance clock for 6s
        clock.tick(6 * 1000)

        expect(pollWeb3Spy.callCount).toEqual(5)
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

    it('polls for Ethereum Network', () => {
        wrapper = shallow(<GlobalInfoWatcher {...props} />)
        const ethereumNetworkSpy = sandbox.spy(wrapper.instance(), 'pollEthereumNetwork')

        // Advance clock for 6s
        clock.tick(6 * 1000)

        expect(ethereumNetworkSpy.callCount).toEqual(5)
    })

    it('handles Ethereum Network change', () => {
        const newProps = {
            ...props,
            networkId: '3',
        }
        wrapper = shallow(<GlobalInfoWatcher {...newProps} />)
        wrapper.instance().handleNetwork('1', false)

        expect(props.updateEthereumNetworkId.calledOnce).toEqual(true)
    })

    it('handles account change', () => {
        let account = 'testAccount'
        const networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: () => {
                if (account === 'testAccount') {
                    account = 'anotherAccount'
                    return Promise.resolve('testAccount')
                }
                return Promise.resolve('anotherAccount')
            },
            getEthereumNetwork: networkStub,
        }))

        wrapper = mount(<GlobalInfoWatcher {...props} />)
        wrapper.instance().handleAccount('testAccount')
        wrapper.setProps({
            account: 'testAccount',
        })
        wrapper.instance().handleAccount('anotherAccount')
        expect(props.receiveAccount.calledOnce).toEqual(true)
        expect(props.changeAccount.calledOnce).toEqual(true)
    })

    it('does not change account if new account differs only by case', () => {
        let account = 'testAccount'
        const networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: () => {
                if (account === 'testAccount') {
                    account = 'TESTACCOUNT'
                    return Promise.resolve('testAccount')
                }
                return Promise.resolve('TESTACCOUNT')
            },
            getEthereumNetwork: networkStub,
        }))

        wrapper = mount(<GlobalInfoWatcher {...props} />)
        wrapper.instance().handleAccount('testAccount')
        wrapper.setProps({
            account: 'testAccount',
        })
        wrapper.instance().handleAccount('TESTACCOUNT')
        expect(props.receiveAccount.calledOnce).toEqual(true)
        expect(props.changeAccount.callCount).toEqual(0)
    })

    it('stops polling on unmount', () => {
        wrapper = mount(<GlobalInfoWatcher {...props} />)

        const web3Spy = sandbox.spy(wrapper.instance(), 'clearWeb3Poll')
        const dataPerUsdSpy = sandbox.spy(wrapper.instance(), 'clearDataPerUsdRatePoll')
        const loginPollSpy = sandbox.spy(wrapper.instance(), 'clearLoginPoll')
        const ethereumNetworkPollSpy = sandbox.spy(wrapper.instance(), 'clearEthereumNetworkPoll')
        const transactionPollSpy = sandbox.spy(wrapper.instance(), 'clearPendingTransactionsPoll')

        const clockSpy = sinon.spy(clock, 'clearTimeout')

        wrapper.unmount()
        expect(web3Spy.calledOnce).toEqual(true)
        expect(dataPerUsdSpy.calledOnce).toEqual(true)
        expect(loginPollSpy.calledOnce).toEqual(true)
        expect(ethereumNetworkPollSpy.calledOnce).toEqual(true)
        expect(transactionPollSpy.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(5)
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
        sandbox.stub(transactionServices, 'getTransactionsFromSessionStorage').callsFake(() => transactions)

        wrapper = mount(<GlobalInfoWatcher {...props} />)

        // Advance clock for 2s
        clock.tick(2 * 1000)

        expect(props.addTransaction.callCount).toEqual(2)
    })

    it('completes pending transactions', (done) => {
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
        const receipt = {
            status: true,
        }
        const receiptStub = sandbox.stub().callsFake(() => Promise.resolve(receipt))
        sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => ({
            eth: {
                getTransactionReceipt: receiptStub,
            },
        }))
        sandbox.stub(web3Utils, 'hasTransactionCompleted').callsFake(() => Promise.resolve(true))
        sandbox.stub(transactionServices, 'getTransactionsFromSessionStorage').callsFake(() => transactions)

        wrapper = shallow(<GlobalInfoWatcher {...props} />)

        // Restore the clock so setTimeout will work
        clock.restore()
        setTimeout(() => {
            expect(props.completeTransaction.callCount).toEqual(2)
            done()
        }, 1000)
    })

    it('completes pending transactions if the transaction results in error', (done) => {
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
        const receipt = {
            status: false,
        }
        const receiptStub = sandbox.stub().callsFake(() => Promise.resolve(receipt))
        sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => ({
            eth: {
                getTransactionReceipt: receiptStub,
            },
        }))
        sandbox.stub(web3Utils, 'hasTransactionCompleted').callsFake(() => Promise.resolve(true))
        sandbox.stub(transactionServices, 'getTransactionsFromSessionStorage').callsFake(() => transactions)

        wrapper = shallow(<GlobalInfoWatcher {...props} />)

        // Restore the clock so setTimeout will work
        clock.restore()
        setTimeout(() => {
            expect(props.transactionError.callCount).toEqual(2)
            done()
        }, 1000)
    })

    it('completes pending transactions only if the receipt is received', (done) => {
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
        const receipt = {
            status: true,
        }
        const receiptStub = sandbox.stub().callsFake((txHash) => {
            if (txHash !== '0x123') {
                return Promise.resolve(receipt)
            }

            return Promise.resolve(null)
        })
        sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => ({
            eth: {
                getTransactionReceipt: receiptStub,
            },
        }))
        sandbox.stub(web3Utils, 'hasTransactionCompleted').callsFake(() => Promise.resolve(true))
        sandbox.stub(transactionServices, 'getTransactionsFromSessionStorage').callsFake(() => transactions)

        wrapper = shallow(<GlobalInfoWatcher {...props} />)

        // Restore the clock so setTimeout will work
        clock.restore()
        setTimeout(() => {
            expect(props.completeTransaction.callCount).toEqual(1)
            expect(props.transactionError.callCount).toEqual(0)
            done()
        }, 2000)
    })
})
