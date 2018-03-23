// @flow

import React from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import { selectStep, selectProduct, selectWaiting } from '../../../modules/ui/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/ui/actions'
import { purchaseFlowSteps } from '../../../utils/constants'

import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId } from '../../../flowtype/product-types'
import AlreadyPurchasedDialog from '../../../components/Modal/AlreadyPurchasedDialog'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import ChooseAccessPeriodDialog from '../../../components/Modal/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'

type StateProps = {
    walletLocked: boolean,
    alreadypurchased: boolean,
    step: ?PurchaseStep,
    product: ?Product,
    waiting: boolean,
}

type DispatchProps = {
    initPurchase: (ProductId) => void,
    onSetAccessPeriod: () => void,
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
    }

    render() {
        const { walletLocked, alreadypurchased, step, product, waiting, onSetAccessPeriod, onSetAllowance, onApprovePurchase } = this.props

        if (product) {
            if (alreadypurchased) {
                return <AlreadyPurchasedDialog />
            }

            if (walletLocked) {
                return <UnlockWalletDialog />
            }

            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return <ChooseAccessPeriodDialog product={product} onNext={() => onSetAccessPeriod()} />
            }

            if (step === purchaseFlowSteps.ALLOWANCE) {
                return <SetAllowanceDialog onSet={() => onSetAllowance()} waiting={waiting} />
            }

            if (step === purchaseFlowSteps.SUMMARY) {
                return <PurchaseSummaryDialog product={product} onPay={() => onApprovePurchase()} waiting={waiting} />
            }

            if (step === purchaseFlowSteps.COMPLETE) {
                return <CompletePurchaseDialog waiting={waiting} />
            }
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletLocked: false,
    alreadypurchased: false,
    step: selectStep(state),
    product: selectProduct(state),
    waiting: selectWaiting(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onSetAccessPeriod: () => dispatch(setAccessPeriod()),
    onSetAllowance: () => dispatch(setAllowance()),
    onApprovePurchase: () => dispatch(approvePurchase()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDialog)
