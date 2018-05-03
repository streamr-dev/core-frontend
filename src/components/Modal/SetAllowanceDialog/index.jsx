// @flow

import React from 'react'

import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'
import Dialog from '../Dialog'
import style from './setallowancedialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    onCancel: () => void,
    onSet: () => void,
}

const HelpText = () => (
    <p className={style.helpText}>
        Allowance is a requirement of ERC-20 token transfers,<br />
        designed to increase security and efficiency.<br />
        For more about allowances, see this <a href="#">page</a>.
    </p>
)

const SetAllowanceDialog = ({ gettingAllowance, settingAllowanceState, onCancel, onSet }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Set Marketplace Allowance"
        waiting={gettingAllowance || (!!settingAllowanceState && settingAllowanceState === transactionStates.STARTED)}
        helpText={<HelpText />}
        actions={{
            cancel: {
                title: 'Cancel',
                outline: true,
                onClick: onCancel,
            },
            next: {
                title: 'Next',
                color: 'primary',
                outline: true,
                onClick: () => onSet(),
            },
        }}
    >
        <p>
            This allows the marketplace to <br />transfer the required amount of DATA.
        </p>
    </Dialog>
)

SetAllowanceDialog.defaultProps = {
    gettingAllowance: false,
}

export default SetAllowanceDialog
