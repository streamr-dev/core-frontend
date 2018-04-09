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

const HelpText = () => (
    <div>
        <p>Allowance is a requirement of ERC-20 token transfers, designed to increase security and efficiency.</p>
        <p>For more about allowances, see this <a href="#">page</a>.</p>
    </div>
)

const SetAllowanceDialog = ({ gettingAllowance, settingAllowanceState, onCancel, onSet }: Props) => (
    <Dialog
        title="Set Marketplace Allowance"
        waiting={gettingAllowance || (!!settingAllowanceState && settingAllowanceState === transactionStates.STARTED)}
        helpText={<HelpText />}
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
