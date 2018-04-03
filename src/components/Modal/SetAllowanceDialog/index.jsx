// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    waiting: boolean,
    onSet: () => void,
}

const SetAllowanceDialog = ({ waiting, onSet }: Props) => (
    <Dialog
        title="Set Marketplace Allowance"
        actions={{
            next: {
                title: 'Set',
                onClick: () => onSet(),
            },
        }}
    >
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
