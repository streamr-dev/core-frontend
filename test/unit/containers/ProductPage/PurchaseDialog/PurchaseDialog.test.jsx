import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'

import { PurchaseDialog } from '../../../../../src/containers/ProductPage/PurchaseDialog'
import ChooseAccessPeriodDialog from '../../../../../src/containers/ProductPage/PurchaseDialog/ChooseAccessPeriodDialog'
import ErrorDialog from '../../../../../src/components/Modal/ErrorDialog'
import SetAllowanceDialog from '../../../../../src/components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../../../src/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../../../src/components/Modal/CompletePurchaseDialog'
import { purchaseFlowSteps, transactionStates } from '../../../../../src/utils/constants'

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
                        accountId="my address"
                    />)
                    assert(wrapper.is(CompletePurchaseDialog))
                    assert.equal(wrapper.props().purchaseState, transactionStates.STARTED)
                    assert.equal(wrapper.props().onCancel, props.onCancel)
                    assert.equal(wrapper.props().accountLinked, true)
                })
            })
        })
    })
})
