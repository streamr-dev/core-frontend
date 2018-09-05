import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { replace } from 'react-router-redux'

import { mapStateToProps, mapDispatchToProps, PurchaseDialog } from '../../../../../src/containers/ProductPage/PurchaseDialog'
import ChooseAccessPeriodDialog from '../../../../../src/containers/ProductPage/PurchaseDialog/ChooseAccessPeriodDialog'
import ErrorDialog from '../../../../../src/components/Modal/ErrorDialog'
import ReplaceAllowanceDialog from '../../../../../src/components/Modal/ReplaceAllowanceDialog'
import SetAllowanceDialog from '../../../../../src/components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../../../src/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../../../src/components/Modal/CompletePurchaseDialog'
import { purchaseFlowSteps, transactionStates } from '../../../../../src/utils/constants'
import * as allowanceSelectors from '../../../../../src/modules/allowance/selectors'
import * as purchaseSelectors from '../../../../../src/modules/purchase/selectors'
import * as purchaseDialogSelectors from '../../../../../src/modules/purchaseDialog/selectors'
import * as web3Selectors from '../../../../../src/modules/web3/selectors'
import * as contractProductSelectors from '../../../../../src/modules/contractProduct/selectors'
import * as userSelectors from '../../../../../src/modules/user/selectors'
import * as purchaseDialogActions from '../../../../../src/modules/purchaseDialog/actions'
import * as allowanceActions from '../../../../../src/modules/allowance/actions'
import * as userActions from '../../../../../src/modules/user/actions'
import * as urlUtils from '../../../../../src/utils/url'

describe('PurchaseDialog container', () => {
    let sandbox
    let initialProps
    let productId

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        productId = 'test'
        initialProps = {
            initPurchase: sandbox.spy(),
            resetAllowance: sandbox.spy(),
            getAllowance: sandbox.spy(),
            getContractProduct: sandbox.spy(),
            onSetAccessPeriod: sandbox.spy(),
            onCancel: sandbox.spy(),
            onApprovePurchase: sandbox.spy(),
            gettingAllowance: false,
            translate: sandbox.stub().callsFake((a) => a),
            getWeb3Accounts: sandbox.spy(),
            productId,
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('calls props.initPurchase with productId', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.initPurchase.calledOnce)
            assert(initialProps.initPurchase.calledWith(productId))
        })
        it('calls props.resetAllowance', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.resetAllowance.calledOnce)
        })
        it('calls props.getAllowance', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.getAllowance.calledOnce)
        })
        it('calls props.getContractProduct with productId', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.getContractProduct.calledOnce)
            assert(initialProps.getContractProduct.calledWith(productId))
        })
        it('calls props.getWeb3Accounts', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.getWeb3Accounts.calledOnce)
        })
    })

    describe('render', () => {
        it('always renders null if there\'s no product', () => {
            const props = {
                ...initialProps,
                product: null, // To ensure the product is null
            }
            assert.equal(shallow(<PurchaseDialog {...props} />).type(), null)
            assert.equal(shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.ACCESS_PERIOD} />).type(), null)
            assert.equal(shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.ALLOWANCE} />).type(), null)
            assert.equal(shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.SUMMARY} />).type(), null)
            assert.equal(shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.COMPLETE} />).type(), null)
        })
        describe('with product', () => {
            let props
            beforeEach(() => {
                props = {
                    ...initialProps,
                    contractProduct: 'testContractProduct',
                    product: 'test product',
                }
            })
            describe('ACCESS_PERIOD step', () => {
                it('renders ChooseAccessPeriodDialog with correct props', () => {
                    const wrapper = shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.ACCESS_PERIOD} />)
                    assert(wrapper.is(ChooseAccessPeriodDialog))
                    assert.equal(wrapper.props().contractProduct, props.contractProduct)
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().onNext, props.onSetAccessPeriod)
                })
            })
            describe('RESET_ALLOWANCE step', () => {
                it('renders null if there is no purchase', () => {
                    const wrapper = shallow(<PurchaseDialog{...props} step={purchaseFlowSteps.RESET_ALLOWANCE} />)
                    assert.equal(wrapper.type(), null)
                })
                it('renders ReplaceAllowanceDialog with correct props', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.RESET_ALLOWANCE}
                    />)
                    assert(wrapper.is(ReplaceAllowanceDialog))
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().onSet, props.onSetAllowance)
                    assert.equal(wrapper.props().gettingAllowance, props.gettingAllowance)
                    assert.equal(wrapper.props().settingAllowanceState, props.settingAllowanceState)
                })
                it('renders ErrorDialog if there is allowanceError', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.RESET_ALLOWANCE}
                        allowanceError={{
                            message: 'test',
                        }}
                    />)
                    assert(wrapper.is(ErrorDialog))
                    assert.equal(wrapper.props().title, 'purchaseDialog.errorTitle')
                    assert.equal(wrapper.props().message, 'test')
                    assert.equal(wrapper.props().onDismiss, props.onCancel)
                })
            })
            describe('ALLOWANCE step', () => {
                it('renders null if there is no purchase', () => {
                    const wrapper = shallow(<PurchaseDialog{...props} step={purchaseFlowSteps.ALLOWANCE} />)
                    assert.equal(wrapper.type(), null)
                })
                it('renders SetAllowanceDialog with correct props', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.ALLOWANCE}
                    />)
                    assert(wrapper.is(SetAllowanceDialog))
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().onSet, props.onSetAllowance)
                    assert.equal(wrapper.props().gettingAllowance, props.gettingAllowance)
                    assert.equal(wrapper.props().settingAllowanceState, props.settingAllowanceState)
                })
                it('renders ErrorDialog if there is allowanceError', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.ALLOWANCE}
                        allowanceError={{
                            message: 'test',
                        }}
                    />)
                    assert(wrapper.is(ErrorDialog))
                    assert.equal(wrapper.props().title, 'purchaseDialog.errorTitle')
                    assert.equal(wrapper.props().message, 'test')
                    assert.equal(wrapper.props().onDismiss, props.onCancel)
                })
            })
            describe('SUMMARY step', () => {
                it('renders null if there is no purchase', () => {
                    const wrapper = shallow(<PurchaseDialog{...props} step={purchaseFlowSteps.SUMMARY} />)
                    assert.equal(wrapper.type(), null)
                })
                it('renders PurchaseSummaryDialog with correct props', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.SUMMARY}
                        purchaseState={transactionStates.STARTED}
                    />)
                    assert(wrapper.is(PurchaseSummaryDialog))
                    assert.equal(wrapper.props().purchaseState, transactionStates.STARTED)
                    assert.equal(wrapper.props().product, props.product)
                    assert.equal(wrapper.props().contractProduct, props.contractProduct)
                    assert.equal(wrapper.props().purchase, 'test purchase')
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().onPay, props.onApprovePurchase)
                })
            })
            describe('COMPLETE step', () => {
                it('renders null if there is no purchase', () => {
                    const wrapper = shallow(<PurchaseDialog{...props} step={purchaseFlowSteps.COMPLETE} />)
                    assert.equal(wrapper.type(), null)
                })
                it('renders CompletePurchaseDialog with correct props when no account linked', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.COMPLETE}
                        purchaseState={transactionStates.STARTED}
                    />)
                    assert(wrapper.is(CompletePurchaseDialog))
                    assert.equal(wrapper.props().purchaseState, transactionStates.STARTED)
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().accountLinked, false)
                })
                it('renders CompletePurchaseDialog with correct props when account linked', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.COMPLETE}
                        purchaseState={transactionStates.STARTED}
                        web3Accounts={[{
                            address: 'my address',
                        }]}
                        accountId="My Address"
                    />)
                    assert(wrapper.is(CompletePurchaseDialog))
                    assert.equal(wrapper.props().purchaseState, transactionStates.STARTED)
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().accountLinked, true)
                })
            })
        })
    })

    describe('mapStateToProps', () => {
        it('maps the state to props', () => {
            const selectAccountIdStub = sandbox.stub(web3Selectors, 'selectAccountId')
                .callsFake(() => 'selectAccountId')
            const selectAllowanceErrorStub = sandbox.stub(allowanceSelectors, 'selectAllowanceError')
                .callsFake(() => 'selectAllowanceError')
            const selectContractProductStub = sandbox.stub(contractProductSelectors, 'selectContractProduct')
                .callsFake(() => 'selectContractProduct')
            const selectGettingAllowanceStub = sandbox.stub(allowanceSelectors, 'selectGettingAllowance')
                .callsFake(() => 'selectGettingAllowance')
            const selectProductStub = sandbox.stub(purchaseDialogSelectors, 'selectProduct')
                .callsFake(() => 'selectProduct')
            const selectPurchaseDataStub = sandbox.stub(purchaseDialogSelectors, 'selectPurchaseData')
                .callsFake(() => 'selectPurchaseData')
            const selectPurchaseTransactionStateStub = sandbox.stub(purchaseSelectors, 'selectTransactionState')
                .callsFake(() => 'selectPurchaseTransactionState')
            const selectAllowanceTransactionStateStub = sandbox.stub(allowanceSelectors, 'selectTransactionState')
                .callsFake(() => 'selectAllowanceTransactionState')
            const selectStepStub = sandbox.stub(purchaseDialogSelectors, 'selectStep')
                .callsFake(() => 'selectStep')
            const selectWeb3AccountsStub = sandbox.stub(userSelectors, 'selectWeb3Accounts')
                .callsFake(() => 'selectWeb3Accounts')

            const state = {
                the: 'state',
                not: 'used',
            }

            assert.deepStrictEqual(mapStateToProps(state), {
                accountId: 'selectAccountId',
                allowanceError: 'selectAllowanceError',
                contractProduct: 'selectContractProduct',
                gettingAllowance: 'selectGettingAllowance',
                product: 'selectProduct',
                purchase: 'selectPurchaseData',
                purchaseState: 'selectPurchaseTransactionState',
                settingAllowanceState: 'selectAllowanceTransactionState',
                step: 'selectStep',
                web3Accounts: 'selectWeb3Accounts',
            })

            assert(selectAccountIdStub.calledOnce)
            assert(selectAccountIdStub.calledWith(state))
            assert(selectAllowanceErrorStub.calledOnce)
            assert(selectAllowanceErrorStub.calledWith(state))
            assert(selectContractProductStub.calledOnce)
            assert(selectContractProductStub.calledWith(state))
            assert(selectGettingAllowanceStub.calledOnce)
            assert(selectGettingAllowanceStub.calledWith(state))
            assert(selectProductStub.calledOnce)
            assert(selectProductStub.calledWith(state))
            assert(selectPurchaseDataStub.calledOnce)
            assert(selectPurchaseDataStub.calledWith(state))
            assert(selectPurchaseTransactionStateStub.calledOnce)
            assert(selectPurchaseTransactionStateStub.calledWith(state))
            assert(selectAllowanceTransactionStateStub.calledOnce)
            assert(selectAllowanceTransactionStateStub.calledWith(state))
            assert(selectStepStub.calledOnce)
            assert(selectStepStub.calledWith(state))
            assert(selectWeb3AccountsStub.calledOnce)
            assert(selectWeb3AccountsStub.calledWith(state))
        })
    })

    describe('mapDispatchToProps', () => {
        it('maps actions to props', () => {
            const getAllowanceStub = sandbox.stub(allowanceActions, 'getAllowance')
                .callsFake(() => 'getAllowance')
            const fetchLinkedWeb3AccountsStub = sandbox.stub(userActions, 'fetchLinkedWeb3Accounts')
                .callsFake(() => 'fetchLinkedWeb3Accounts')
            const initPurchaseStub = sandbox.stub(purchaseDialogActions, 'initPurchase')
                .callsFake(() => 'initPurchase')
            const approvePurchaseStub = sandbox.stub(purchaseDialogActions, 'approvePurchase')
                .callsFake(() => 'approvePurchase')
            const formatPathStub = sandbox.stub(urlUtils, 'formatPath')
                .callsFake(() => 'formatPath')
            const setAccessPeriodStub = sandbox.stub(purchaseDialogActions, 'setAccessPeriod')
                .callsFake(() => 'setAccessPeriod')
            const setAllowanceStub = sandbox.stub(purchaseDialogActions, 'setAllowance')
                .callsFake(() => 'setAllowance')
            const resetAllowanceActionStub = sandbox.stub(allowanceActions, 'resetAllowance')
                .callsFake(() => 'resetAllowance')

            const dispatchStub = sandbox.stub().callsFake((action) => action)
            const ownProps = {
                productId: 'test productId',
            }

            const mappedProps = mapDispatchToProps(dispatchStub, ownProps)

            mappedProps.getAllowance()
            assert(getAllowanceStub.calledOnce)
            assert(dispatchStub.calledOnce)
            assert(dispatchStub.calledWith('getAllowance'))

            mappedProps.getWeb3Accounts()
            assert(fetchLinkedWeb3AccountsStub.calledOnce)
            assert(dispatchStub.calledTwice)
            assert(dispatchStub.calledWith('fetchLinkedWeb3Accounts'))

            mappedProps.initPurchase('test id')
            assert(initPurchaseStub.calledOnce)
            assert(initPurchaseStub.calledWith('test id'))
            assert.equal(dispatchStub.callCount, 3)
            assert(dispatchStub.calledWith('initPurchase'))

            mappedProps.onApprovePurchase()
            assert(approvePurchaseStub.calledOnce)
            assert.equal(dispatchStub.callCount, 4)
            assert(dispatchStub.calledWith('approvePurchase'))

            mappedProps.onCancel()
            assert(formatPathStub.calledOnce)
            assert(formatPathStub.calledWith('/products', ownProps.productId))
            assert.equal(dispatchStub.callCount, 5)
            assert.deepStrictEqual(dispatchStub.getCall(dispatchStub.callCount - 1).args[0], replace('formatPath'))

            mappedProps.onSetAccessPeriod('123', 'years')
            assert(setAccessPeriodStub.calledOnce)
            assert(setAccessPeriodStub.calledWith('123', 'years'))
            assert.equal(dispatchStub.callCount, 6)
            assert(dispatchStub.calledWith('initPurchase'))

            mappedProps.onSetAllowance('test id')
            assert(setAllowanceStub.calledOnce)
            assert.equal(dispatchStub.callCount, 7)
            assert(dispatchStub.calledWith('setAllowance'))

            mappedProps.resetAllowance('test id')
            assert(resetAllowanceActionStub.calledOnce)
            assert.equal(dispatchStub.callCount, 8)
            assert(dispatchStub.calledWith('resetAllowance'))
        })
    })
})
