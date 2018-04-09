// @flow

import React from 'react'

import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'
import Dialog from '../Dialog'

export type Props = {
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    onCancel: () => void,
    onSet: () => void,
}

const SetAllowanceDialog = ({ gettingAllowance, settingAllowanceState, onCancel, onSet }: Props) => (
    <Dialog
        title="Set Marketplace Allowance"
        waiting={gettingAllowance || (!!settingAllowanceState && settingAllowanceState === transactionStates.STARTED)}
        actions={{
            cancel: {
                title: 'Cancel',
                onClick: onCancel,
            },
            next: {
                title: 'Set',
                color: 'primary',
                onClick: () => onSet(),
            },
        }}
    >
        <div>
            This allows the marketplace to transfer the required amount of DATA.
        </div>
    </Dialog>
)

SetAllowanceDialog.defaultProps = {
    gettingAllowance: false,
}

export default SetAllowanceDialog
