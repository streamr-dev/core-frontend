import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import { replace } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'

import { mapStateToProps, mapDispatchToProps, PurchaseDialog } from '$mp/containers/ProductPage/PurchaseDialog'
import ChooseAccessPeriodDialog from '$mp/containers/ProductPage/PurchaseDialog/ChooseAccessPeriodDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import { purchaseFlowSteps } from '$mp/utils/constants'
import { transactionStates } from '$shared/utils/constants'
import * as allowanceSelectors from '$mp/modules/allowance/selectors'
import * as purchaseSelectors from '$mp/modules/purchase/selectors'
import * as purchaseDialogSelectors from '$mp/modules/purchaseDialog/selectors'
import * as web3Selectors from '$mp/modules/web3/selectors'
import * as contractProductSelectors from '$mp/modules/contractProduct/selectors'
import * as integrationKeySelectors from '$shared/modules/integrationKey/selectors'
import * as purchaseDialogActions from '$mp/modules/purchaseDialog/actions'
import * as allowanceActions from '$mp/modules/allowance/actions'
import * as integrationKeyActions from '$shared/modules/integrationKey/actions'
import * as urlUtils from '$shared/utils/url'
import links from '$shared/../links'

describe('PurchaseDialog container', () => {
    let sandbox
    let initialProps
    let productId

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        productId = 'test'
        initialProps = {
            getAllowance: sandbox.spy(),
            getIntegrationKeys: sandbox.spy(),
            initPurchase: sandbox.spy(),
            onApprovePurchase: sandbox.spy(),
            onCancel: sandbox.spy(),
            onSetAccessPeriod: sandbox.spy(),
            onSetAllowance: sandbox.spy(),
            resetAllowanceState: sandbox.spy(),
            getContractProduct: sandbox.spy(),
            gettingAllowance: false,
            settingAllowance: false,
            resettingAllowance: false,
            productId,
        }
        sandbox.stub(I18n, 't').callsFake(String)
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
        it('calls props.resetAllowanceState', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.resetAllowanceState.calledOnce)
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
        it('calls props.getIntegrationKeys', () => {
            shallow(<PurchaseDialog {...initialProps} />)
            assert(initialProps.getIntegrationKeys.calledOnce)
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
                    const wrapper = shallow(<PurchaseDialog {...props} step={purchaseFlowSteps.RESET_ALLOWANCE} />)
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
                    assert.equal(wrapper.props().settingAllowance, props.settingAllowance)
                })
                it('renders ErrorDialog if there is resetAllowanceError', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.RESET_ALLOWANCE}
                        resetAllowanceError={{
                            message: 'test',
                        }}
                    />)
                    assert(wrapper.is(ErrorDialog))
                    assert.equal(wrapper.props().title, 'purchaseDialog.errorTitle')
                    assert.equal(wrapper.props().message, 'test')
                    assert.equal(wrapper.props().onClose, props.onCancel)
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
                    assert.equal(wrapper.props().settingAllowance, props.settingAllowance)
                })
                it('renders ErrorDialog if there is setAllowanceError', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.ALLOWANCE}
                        setAllowanceError={{
                            message: 'test',
                        }}
                    />)
                    assert(wrapper.is(ErrorDialog))
                    assert.equal(wrapper.props().title, 'purchaseDialog.errorTitle')
                    assert.equal(wrapper.props().message, 'test')
                    assert.equal(wrapper.props().onClose, props.onCancel)
                })
            })
            describe('NO_BALANCE step', () => {
                it('renders NoBalanceDialog with correct props when ETH balance is not enough', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.NO_BALANCE}
                        stepParams={{
                            requiredEthBalance: 2,
                            currentEthBalance: 1,
                            requiredDataBalance: 0,
                            currentDataBalance: 0,
                        }}
                        purchaseState={transactionStates.STARTED}
                    />)
                    assert(wrapper.is(NoBalanceDialog))
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().requiredEthBalance, 2)
                    assert.equal(wrapper.props().currentEthBalance, 1)
                })
                it('renders NoBalanceDialog with correct props when DATA balance is not enough', () => {
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.NO_BALANCE}
                        stepParams={{
                            requiredEthBalance: 0,
                            currentEthBalance: 0,
                            requiredDataBalance: 2,
                            currentDataBalance: 1,
                        }}
                        purchaseState={transactionStates.STARTED}
                    />)
                    assert(wrapper.is(NoBalanceDialog))
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().requiredDataBalance, 2)
                    assert.equal(wrapper.props().currentDataBalance, 1)
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
                        purchaseStarted
                    />)
                    assert(wrapper.is(PurchaseSummaryDialog))
                    assert.equal(wrapper.props().purchaseStarted, true)
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
                    const purchaseTransaction = {
                        state: transactionStates.STARTED,
                    }
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.COMPLETE}
                        purchaseTransaction={purchaseTransaction}
                    />)
                    assert(wrapper.is(CompletePurchaseDialog))
                    assert.equal(wrapper.props().purchaseState, transactionStates.STARTED)
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().accountLinked, false)
                })
                it('renders CompletePurchaseDialog with correct props when account linked', () => {
                    const purchaseTransaction = {
                        state: transactionStates.STARTED,
                    }
                    const wrapper = shallow(<PurchaseDialog
                        {...props}
                        purchase="test purchase"
                        step={purchaseFlowSteps.COMPLETE}
                        purchaseTransaction={purchaseTransaction}
                        ethereumIdentities={[{
                            json: {
                                address: 'my address',
                            },
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
            const selectSetAllowanceErrorStub = sandbox.stub(allowanceSelectors, 'selectSetAllowanceError')
                .callsFake(() => 'selectSetAllowanceError')
            const selectResetAllowanceErrorStub = sandbox.stub(allowanceSelectors, 'selectResetAllowanceError')
                .callsFake(() => 'selectResetAllowanceError')
            const selectContractProductStub = sandbox.stub(contractProductSelectors, 'selectContractProduct')
                .callsFake(() => 'selectContractProduct')
            const selectGettingAllowanceStub = sandbox.stub(allowanceSelectors, 'selectGettingAllowance')
                .callsFake(() => 'selectGettingAllowance')
            const selectSettingAllowanceStub = sandbox.stub(allowanceSelectors, 'selectSettingAllowance')
                .callsFake(() => 'selectSettingAllowance')
            const selectResettingAllowanceStub = sandbox.stub(allowanceSelectors, 'selectResettingAllowance')
                .callsFake(() => 'selectResettingAllowance')
            const selectProductStub = sandbox.stub(purchaseDialogSelectors, 'selectProduct')
                .callsFake(() => 'selectProduct')
            const selectPurchaseDataStub = sandbox.stub(purchaseDialogSelectors, 'selectPurchaseData')
                .callsFake(() => 'selectPurchaseData')
            const selectPurchaseStartedStub = sandbox.stub(purchaseSelectors, 'selectPurchaseStarted')
                .callsFake(() => 'selectPurchaseStarted')
            const selectPurchaseTransactionStub = sandbox.stub(purchaseSelectors, 'selectPurchaseTransaction')
                .callsFake(() => 'selectPurchaseTransaction')
            const selectStepStub = sandbox.stub(purchaseDialogSelectors, 'selectStep')
                .callsFake(() => 'selectStep')
            const selectStepParamsStub = sandbox.stub(purchaseDialogSelectors, 'selectStepParams')
                .callsFake(() => 'selectStepParams')
            const selectEthereumIdentitiesStub = sandbox.stub(integrationKeySelectors, 'selectEthereumIdentities')
                .callsFake(() => 'selectEthereumIdentities')

            const state = {
                the: 'state',
                not: 'used',
            }

            assert.deepStrictEqual(mapStateToProps(state), {
                accountId: 'selectAccountId',
                setAllowanceError: 'selectSetAllowanceError',
                resetAllowanceError: 'selectResetAllowanceError',
                contractProduct: 'selectContractProduct',
                gettingAllowance: 'selectGettingAllowance',
                settingAllowance: 'selectSettingAllowance',
                resettingAllowance: 'selectResettingAllowance',
                product: 'selectProduct',
                purchase: 'selectPurchaseData',
                purchaseStarted: 'selectPurchaseStarted',
                purchaseTransaction: 'selectPurchaseTransaction',
                step: 'selectStep',
                stepParams: 'selectStepParams',
                ethereumIdentities: 'selectEthereumIdentities',
            })

            assert(selectAccountIdStub.calledOnce)
            assert(selectAccountIdStub.calledWith(state))
            assert(selectSetAllowanceErrorStub.calledOnce)
            assert(selectSetAllowanceErrorStub.calledWith(state))
            assert(selectResetAllowanceErrorStub.calledOnce)
            assert(selectResetAllowanceErrorStub.calledWith(state))
            assert(selectContractProductStub.calledOnce)
            assert(selectContractProductStub.calledWith(state))
            assert(selectGettingAllowanceStub.calledOnce)
            assert(selectGettingAllowanceStub.calledWith(state))
            assert(selectSettingAllowanceStub.calledOnce)
            assert(selectSettingAllowanceStub.calledWith(state))
            assert(selectResettingAllowanceStub.calledOnce)
            assert(selectResettingAllowanceStub.calledWith(state))
            assert(selectProductStub.calledOnce)
            assert(selectProductStub.calledWith(state))
            assert(selectPurchaseDataStub.calledOnce)
            assert(selectPurchaseDataStub.calledWith(state))
            assert(selectPurchaseStartedStub.calledOnce)
            assert(selectPurchaseStartedStub.calledWith(state))
            assert(selectPurchaseTransactionStub.calledOnce)
            assert(selectPurchaseTransactionStub.calledWith(state))
            assert(selectStepStub.calledOnce)
            assert(selectStepStub.calledWith(state))
            assert(selectStepParamsStub.calledOnce)
            assert(selectStepParamsStub.calledWith(state))
            assert(selectEthereumIdentitiesStub.calledOnce)
            assert(selectEthereumIdentitiesStub.calledWith(state))
        })
    })

    describe('mapDispatchToProps', () => {
        it('maps actions to props', () => {
            const getAllowanceStub = sandbox.stub(allowanceActions, 'getAllowance')
                .callsFake(() => 'getAllowance')
            const fetchIntegrationKeysStub = sandbox.stub(integrationKeyActions, 'fetchIntegrationKeys')
                .callsFake(() => 'fetchIntegrationKeys')
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
            const resetAllowanceStateActionStub = sandbox.stub(allowanceActions, 'resetAllowanceState')
                .callsFake(() => 'resetAllowanceState')

            const dispatchStub = sandbox.stub().callsFake((action) => action)
            const ownProps = {
                productId: 'test productId',
            }

            const mappedProps = mapDispatchToProps(dispatchStub, ownProps)

            mappedProps.getAllowance()
            assert(getAllowanceStub.calledOnce)
            assert(dispatchStub.calledOnce)
            assert(dispatchStub.calledWith('getAllowance'))

            mappedProps.getIntegrationKeys()
            assert(fetchIntegrationKeysStub.calledOnce)
            assert(dispatchStub.calledTwice)
            assert(dispatchStub.calledWith('fetchIntegrationKeys'))

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
            assert(formatPathStub.calledWith(links.marketplace.products, ownProps.productId))
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

            mappedProps.resetAllowanceState('test id')
            assert(resetAllowanceStateActionStub.calledOnce)
            assert.equal(dispatchStub.callCount, 8)
            assert(dispatchStub.calledWith('resetAllowanceState'))
        })
    })
})
