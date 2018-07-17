import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import * as getWeb3 from '../../../../src/web3/web3Provider'
import * as web3Actions from '../../../../src/modules/web3/actions'
import * as userActions from '../../../../src/modules/user/actions'
import * as globalActions from '../../../../src/modules/global/actions'
import { GlobalInfoWatcher, mapStateToProps, mapDispatchToProps } from '../../../../src/containers/GlobalInfoWatcher'

describe('GlobalInfoWatcher', () => {
    let wrapper
    let props
    let sandbox
    let clock

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        clock = sinon.useFakeTimers()

        props = {
            account: null,
            receiveAccount: sandbox.spy(),
            changeAccount: sandbox.spy(),
            accountError: sandbox.spy(),
            getUserData: sandbox.spy(),
            getDataPerUsd: sandbox.spy(),
            checkEthereumNetwork: sandbox.spy(),
            children: null,
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
        const state = {
            web3: {
                accountId: account,
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
        sandbox.stub(globalActions, 'checkEthereumNetwork').callsFake(() => 'checkEthereumNetwork')

        const actions = mapDispatchToProps(dispatchStub)
        const result = {
            receiveAccount: actions.receiveAccount('testAccount'),
            changeAccount: actions.changeAccount('anotherAccount'),
            accountError: actions.accountError('testError'),
            getUserData: actions.getUserData(),
            getDataPerUsd: actions.getDataPerUsd(),
            checkEthereumNetwork: actions.checkEthereumNetwork(),
        }
        const expectedResult = {
            receiveAccount: 'receiveAccount',
            changeAccount: 'changeAccount',
            accountError: 'accountError',
            getUserData: 'getUserData',
            getDataPerUsd: 'getDataPerUsd',
            checkEthereumNetwork: 'checkEthereumNetwork',
        }

        assert.deepStrictEqual(result, expectedResult)
        expect(dispatchStub.callCount).toEqual(Object.keys(expectedResult).length)
        expect(receiveAccountStub.calledWith('testAccount')).toEqual(true)
        expect(changeAccountStub.calledWith('anotherAccount')).toEqual(true)
        expect(accountErrorStub.calledWith('testError')).toEqual(true)
    })

    it('starts polling on mount', () => {
        const defaultAccountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: defaultAccountStub,
        }))
        const clockSpy = sinon.spy(clock, 'setTimeout')

        wrapper = mount(<GlobalInfoWatcher {...props} />)

        expect(props.getDataPerUsd.calledOnce).toEqual(true)
        expect(props.getUserData.calledOnce).toEqual(true)
        expect(props.checkEthereumNetwork.calledOnce).toEqual(true)
        expect(defaultAccountStub.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(3)
    })

    it('polls web3 account', () => {
        wrapper = mount(<GlobalInfoWatcher {...props} />)
        const web3Spy = sandbox.spy(wrapper.instance(), 'pollWeb3')

        // Advance clock for 6s
        clock.tick(6 * 1000)

        expect(web3Spy.callCount).toEqual(5)
    })

    it('polls for login', () => {
        wrapper = mount(<GlobalInfoWatcher {...props} />)
        const web3Spy = sandbox.spy(wrapper.instance(), 'pollLogin')

        // Advance clock for 12min
        clock.tick(12 * 60 * 1000)

        expect(web3Spy.callCount).toEqual(1)
    })

    it('polls for USD rate', () => {
        wrapper = mount(<GlobalInfoWatcher {...props} />)
        const web3Spy = sandbox.spy(wrapper.instance(), 'pollDataPerUsdRate')

        // Advance clock for 12hours
        clock.tick(12 * 60 * 60 * 1000)

        expect(web3Spy.callCount).toEqual(1)
    })

    it('handles account change', () => {
        let account = 'testAccount'
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: () => {
                if (account === 'testAccount') {
                    account = 'anotherAccount'
                    return Promise.resolve('testAccount')
                }
                return Promise.resolve('anotherAccount')
            },
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
        sandbox.stub(getWeb3, 'default').callsFake(() => ({
            getDefaultAccount: () => {
                if (account === 'testAccount') {
                    account = 'TESTACCOUNT'
                    return Promise.resolve('testAccount')
                }
                return Promise.resolve('TESTACCOUNT')
            },
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

        const clockSpy = sinon.spy(clock, 'clearTimeout')

        wrapper.unmount()
        expect(web3Spy.calledOnce).toEqual(true)
        expect(dataPerUsdSpy.calledOnce).toEqual(true)
        expect(loginPollSpy.calledOnce).toEqual(true)
        expect(clockSpy.callCount).toEqual(3)
    })
})
