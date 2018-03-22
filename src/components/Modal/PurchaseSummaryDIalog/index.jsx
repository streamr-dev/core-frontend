// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    waiting: boolean,
    onPay: () => void,
}

const SetAllowanceDialog = ({ waiting, onPay }: Props) => (
    <Dialog title="Set Marketplace Allowance" actions={{
        next: {
            title: 'Set',
            onClick: () => onPay()
        }
    }}>
        {!waiting && (
            <div>
                This allows the marketplace to transfer the required amount of DATA.
            </div>
        )}
        {waiting && (
            <div>
                Waiting for metamask...
            </div>
        )}
    </Dialog>
)

SetAllowanceDialog.defaultProps = {
    waiting: false,
}

export default SetAllowanceDialog
