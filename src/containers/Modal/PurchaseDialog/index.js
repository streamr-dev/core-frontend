// @flow

import React from 'react'
import { connect } from 'react-redux'

import { selectStep, selectProduct, selectWaiting } from '../../../modules/ui/selectors'
import { setAccessPeriod, setAllowance } from '../../../modules/ui/actions'
import { purchaseFlowSteps } from '../../../utils/constants'

import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product } from '../../../flowtype/product-types'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import ChooseAccessPeriodDialog from '../../../components/Modal/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'

type StateProps = {
    walletLocked: boolean,
    step: ?PurchaseStep,
    product: ?Product,
    waiting: boolean,
}

type DispatchProps = {
    onSetAccessPeriod: () => void,
    onSetAllowance: () => void,
}

type Props = StateProps & DispatchProps

class PurchaseDialog extends React.Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        const { walletLocked, step, waiting, onSetAccessPeriod, onSetAllowance } = this.props

        return (
            <div>
                {walletLocked && (
                    <UnlockWalletDialog />
                )}
                {!walletLocked && step === purchaseFlowSteps.ACCESS_PERIOD && (
                    <ChooseAccessPeriodDialog onNext={() => onSetAccessPeriod()} />
                )}
                {!walletLocked && step === purchaseFlowSteps.ALLOWANCE && (
                    <SetAllowanceDialog onSet={() => onSetAllowance()} waiting={waiting} />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletLocked: false,
    step: selectStep(state),
    product: selectProduct(state),
    waiting: selectWaiting(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onSetAccessPeriod: () => dispatch(setAccessPeriod()),
    onSetAllowance: () => dispatch(setAllowance()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDialog)
