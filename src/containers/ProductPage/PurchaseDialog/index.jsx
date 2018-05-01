// @flow

import React from 'react'

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { selectStep, selectProduct, selectPurchaseData } from '../../../modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '../../../utils/constants'
import { getAllowance } from '../../../modules/allowance/actions'
import { selectGettingAllowance, selectTransactionState as selectAllowanceTransactionState } from '../../../modules/allowance/selectors'
import { selectTransactionState as selectPurchaseTransactionState } from '../../../modules/purchase/selectors'
import { hideModal } from '../../../modules/modals/actions'
import ChooseAccessPeriodDialog from '../../../containers/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId } from '../../../flowtype/product-types'
import type { TimeUnit, Purchase, TransactionState, NumberString } from '../../../flowtype/common-types'
import withContractProduct from '../../WithContractProduct'

type StateProps = {
    step: ?PurchaseStep,
    product: ?Product,
    purchase: ?Purchase,
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    purchaseState: ?TransactionState,
}

type DispatchProps = {
    getAllowance: () => void,
    initPurchase: (ProductId) => void,
    onCancel: () => void,
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
}

export type OwnProps = {
    productId: ProductId,
}

type Props = StateProps & DispatchProps & OwnProps

class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        const { productId } = this.props

        this.props.initPurchase(productId)
        this.props.getAllowance()
    }

    render() {
        const {
            gettingAllowance,
            settingAllowanceState,
            step,
            product,
            purchaseState,
            purchase,
            onSetAccessPeriod,
            onSetAllowance,
            onApprovePurchase,
            onCancel,
        } = this.props

        if (product) {
            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return (<ChooseAccessPeriodDialog
                    product={product}
                    onCancel={onCancel}
                    onNext={(time: NumberString, timeUnit: TimeUnit) => (
                        onSetAccessPeriod(time, timeUnit)
                    )}
                />)
            }

            if (purchase) {
                if (step === purchaseFlowSteps.ALLOWANCE) {
                    return (
                        <SetAllowanceDialog
                            onCancel={onCancel}
                            onSet={() => onSetAllowance()}
                            gettingAllowance={gettingAllowance}
                            settingAllowanceState={settingAllowanceState}
                        />
                    )
                }

                if (step === purchaseFlowSteps.SUMMARY) {
                    return (
                        <PurchaseSummaryDialog
                            purchaseState={purchaseState}
                            product={product}
                            purchase={purchase}
                            onCancel={onCancel}
                            onPay={() => onApprovePurchase()}
                        />
                    )
                }

                if (step === purchaseFlowSteps.COMPLETE) {
                    return <CompletePurchaseDialog onCancel={onCancel} purchaseState={purchaseState} />
                }
            }
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    product: selectProduct(state),
    purchase: selectPurchaseData(state),
    gettingAllowance: selectGettingAllowance(state),
    settingAllowanceState: selectAllowanceTransactionState(state),
    purchaseState: selectPurchaseTransactionState(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getAllowance: () => dispatch(getAllowance()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onCancel: () => {
        dispatch(push(formatPath(links.products, ownProps.productId)))
        dispatch(hideModal())
    },
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    onApprovePurchase: () => dispatch(approvePurchase()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PurchaseDialog))
