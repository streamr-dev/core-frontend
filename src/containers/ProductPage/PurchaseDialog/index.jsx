// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'

import { selectStep, selectProduct, selectPurchaseData } from '../../../modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '../../../utils/constants'
import { selectEnabled } from '../../../modules/web3/selectors'
import { getAllowance } from '../../../modules/allowance/actions'
import { selectGettingAllowance, selectTransactionState as selectAllowanceTransactionState } from '../../../modules/allowance/selectors'
import { selectTransactionState as selectPurchaseTransactionState } from '../../../modules/purchase/selectors'

import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId } from '../../../flowtype/product-types'
import type { TimeUnit, Purchase, TransactionState } from '../../../flowtype/common-types'
import AlreadyPurchasedDialog from '../../../components/Modal/AlreadyPurchasedDialog'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import ChooseAccessPeriodDialog from '../../../components/Modal/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'

type StateProps = {
    walletEnabled: boolean,
    alreadypurchased: boolean,
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
    onSetAccessPeriod: (time: number, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        this.props.initPurchase(this.props.match.params.id)
        this.props.getAllowance()
    }

    render() {
        const {
            gettingAllowance,
            settingAllowanceState,
            walletEnabled,
            alreadypurchased,
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
            if (alreadypurchased) {
                return <AlreadyPurchasedDialog />
            }

            if (!walletEnabled) {
                return <UnlockWalletDialog />
            }

            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return (<ChooseAccessPeriodDialog
                    product={product}
                    onCancel={onCancel}
                    onNext={(time: number, timeUnit: TimeUnit) => (
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
                    return <CompletePurchaseDialog purchaseState={purchaseState} />
                }
            }
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletEnabled: selectEnabled(state),
    alreadypurchased: false,
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
    onCancel: () => dispatch(push(formatPath(links.products, ownProps.match.params.id))),
    onSetAccessPeriod: (time: number, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    onApprovePurchase: () => dispatch(approvePurchase()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDialog)
