// @flow

import React from 'react'
import { connect } from 'react-redux'

import { selectModalProps } from '../../../modules/ui/selectors'
import { updatePurchaseModal } from '../../../modules/ui/actions'
import type { Purchase } from '../../../flowtype/common-types'
import type { StoreState } from '../../../flowtype/store-state'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import ChooseAccessPeriodDialog from '../../../components/Modal/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'

type StateProps = {
    walletLocked: boolean,
    modalProps: ?Purchase,
}
type DispatchProps = {
    dispatch: Function,
}

type Props = StateProps & DispatchProps

const ACCESS_PERIOD: string = 'accessPeriod'
const ALLOWANCE: string = 'allowance'

class PurchaseDialog extends React.Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        const { walletLocked, modalProps, dispatch } = this.props
        const { step } = modalProps || {}

        return (
            <div>
                {walletLocked && (
                    <UnlockWalletDialog />
                )}
                {!walletLocked && step === ACCESS_PERIOD && (
                    <ChooseAccessPeriodDialog onNext={() => dispatch(updatePurchaseModal({
                        step: ALLOWANCE,
                    }))} />
                )}
                {!walletLocked && step === ALLOWANCE && (
                    <SetAllowanceDialog onSet={() => dispatch(updatePurchaseModal({
                        step: ACCESS_PERIOD,
                    }))} />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletLocked: false,
    modalProps: selectModalProps(state),
})

export default connect(mapStateToProps)(PurchaseDialog)
